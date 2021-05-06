import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import type { Gpio } from 'pigpio';
import { easeSinInOut } from 'd3-ease';

import type { Lux } from 'daylux-interfaces';

import { ConfigService } from '../config/config.service';

import { LuxResponse } from '../responses';

import { Deferred } from '../utils/Deferred';
import { GpioDynamicModuleImportException, GpioModuleNotLoadedException } from './errors';

import { PigpioFactory, GetPinOption } from './interfaces';


@Injectable()
export class PigpioService {


  /* --------
   * Internal Variable
   * -------- */
  private readonly frameDuration: number;

  private readonly maxTemperature: number;

  private readonly minTemperature: number;

  private readonly pwmRange: number;


  /* --------
   * Gpio Connector Package
   * -------- */
  private isInitializingConnector: boolean = false;

  private initConnectorDefer: Deferred<typeof Gpio> = new Deferred<typeof Gpio>();

  private Gpio: typeof Gpio | undefined;

  private coldPin!: Gpio;

  private warmPin!: Gpio;


  /* --------
   * Logger
   * -------- */
  private readonly logger: Logger = new Logger('PigpioService');


  /* --------
   * Service Constructor
   * -------- */
  constructor(private readonly configService: ConfigService) {
    /** Get variable from config */
    const {
      frameDuration,
      maxTemperature,
      minTemperature,
      pwmRange
    } = this.configService.get('dutyCycle');

    this.frameDuration = frameDuration;
    this.maxTemperature = maxTemperature;
    this.minTemperature = minTemperature;
    this.pwmRange = pwmRange;

    /** Get the last lux object */
    const lastLux = this.configService.get('lastLux');

    /** If a last lux object exists, set it */
    this.logger.verbose('Await connector');
    this.initConnectorDefer.promise.then(() => {

      this.coldPin = this.getPIN(this.configService.get('PINS.cold'));
      this.warmPin = this.getPIN(this.configService.get('PINS.warm'));

      if (lastLux) {
        /** Override the duration to produce a small 'wakeUp' */
        this.setLux({
          ...lastLux,
          duration: 2000
        });
      }
    });
  }


  /* --------
   * Connector Init
   * -------- */
  public async initConnector(options?: PigpioFactory): Promise<typeof Gpio> {
    /** If a connector already exists, return it */
    if (this.Gpio) {
      this.logger.verbose('A valid Gpio Constructor already exists');
      return Promise.resolve(this.Gpio);
    }

    /** If module has not been found, but promise has already be resolve, throw an error */
    if (!this.initConnectorDefer.isPending) {
      throw new GpioModuleNotLoadedException();
    }

    /** If module is initializing, return the promise */
    if (this.isInitializingConnector) {
      this.logger.verbose('Module is already initializing');
      return this.initConnectorDefer.promise;
    }

    this.isInitializingConnector = true;

    /** Dynamically load the Module */
    try {
      this.Gpio = await new Promise<typeof Gpio>((resolve) => {
        if (options?.mock) {
          this.logger.verbose('Loading MockModule');
          import('./lib/GpioMock').then((mockModule) => {
            return resolve(mockModule.GpioMock as any as typeof Gpio);
          });
        }
        else {
          this.logger.verbose('Loading main Gpio');
          import('pigpio').then((gpioModule) => {
            return resolve(gpioModule.Gpio);
          });
        }
      });

      this.logger.verbose('Connector Initialized');

      this.isInitializingConnector = false;

      this.initConnectorDefer.resolve(this.Gpio);

      return this.Gpio;
    }
    catch (error) {
      this.isInitializingConnector = false;
      this.initConnectorDefer.reject(error);
      throw new GpioDynamicModuleImportException();
    }
  }


  /* --------
   * Pins Management
   * -------- */
  private readonly pinsCache = new Map<number, Gpio>();


  private getPIN(pinNumber: number, options?: GetPinOption): Gpio {
    /** Check if PIN has been already loaded */
    const cachedPIN = this.pinsCache.get(pinNumber);

    if (cachedPIN && !options?.reload) {
      return cachedPIN;
    }

    /** Check Gpio has been initialized */
    if (!this.Gpio) {
      const error = new Error('PigpioService has not been correctly initialized');
      this.logger.error(error);
      throw error;
    }

    /** Load PIN, setting Output mode as default */
    const newPin = new this.Gpio(pinNumber, {
      mode: options?.mode === 'input' ? this.Gpio.INPUT : this.Gpio.OUTPUT
    });

    /** Set the pwmRange */
    newPin.pwmRange(this.pwmRange);

    /** Save the PIN */
    this.pinsCache.set(pinNumber, newPin);

    return newPin;
  }


  private getPwmDutyCycle(pin: Gpio, initialValue: number = 0): number {
    try {
      /** Reading PWM DutyCycle of a PIN not set as PWM will throw an error */
      return this.clampPwm(pin.getPwmDutyCycle());
    }
    catch {
      const clamped = this.clampPwm(initialValue);
      /** Preset initial PWM and return it */
      pin.pwmWrite(clamped);
      return clamped;
    }
  }


  /* --------
   * Utilities
   * -------- */
  private clampPwm(value: number): number {
    return Math.max(Math.min(Math.round(value), this.pwmRange), 0);
  }


  private clampTemperature(value: number): number {
    return Math.max(Math.min(Math.round(value), this.maxTemperature), this.minTemperature);
  }


  /* --------
   * Work Management
   * --
   * Each PWM Change with a duration > 0 will have
   * a unique work id associated with it.
   * When a new animation is starting before the old one finish
   * the work id change, the first animation will stop and
   * unload the update timeout
   * -------- */
  private dutyCycleId: string | undefined;

  private nextDutyCycleFrame: NodeJS.Timeout | undefined;


  private stopCurrentDutyCycle(): void {
    /** Remove the timeout */
    if (this.nextDutyCycleFrame) {
      clearTimeout(this.nextDutyCycleFrame);
      this.nextDutyCycleFrame = undefined;
    }

    /** Reset dutyCycleId */
    this.dutyCycleId = undefined;
  }


  private prepareNextDutyCycleFrame(callback: () => void): void {
    this.nextDutyCycleFrame = setTimeout(callback, this.frameDuration);
  }


  /* --------
   * Temperature Utilities
   * -------- */
  private getTemperatureFromPwm(warmPwm: number, coldPwm: number): number {
    if (warmPwm === 0 && coldPwm === 0) {
      return this.minTemperature;
    }

    const coldComponent = 1 - (warmPwm / (warmPwm + coldPwm));

    return this.clampTemperature(this.minTemperature + (this.maxTemperature - this.minTemperature) * coldComponent);
  }


  private getPwmFromTemperature(temperature: number): { warmPwm: number, coldPwm: number } {
    const clamped = this.clampTemperature(temperature);

    const warmPwm = this.clampPwm(
      (this.pwmRange / 100) * (100 - ((clamped - this.minTemperature) / (this.minTemperature / 100)))
    );

    return {
      warmPwm,
      coldPwm: this.pwmRange - warmPwm
    };
  }


  /* --------
   * Return the current Lux Object
   * ---
   * This function will ge current PWM of two pin and
   * will compute kelvin, intensity and intensity booster
   * -------- */
  public getLux(): LuxResponse {
    /** Get current PWM */
    const currentWarmPwm = this.getPwmDutyCycle(this.warmPin);
    const currentColdPwm = this.getPwmDutyCycle(this.coldPin);

    /** Get current temperature */
    const temperature = this.getTemperatureFromPwm(currentWarmPwm, currentColdPwm);

    /** Get ideal PWM from Kelvin */
    const {
      warmPwm: idealWarmPwm,
      coldPwm: idealColdPwm
    } = this.getPwmFromTemperature(temperature);

    /** Get reference using the highest */
    const idealPwmReference = Math.max(idealColdPwm, idealWarmPwm);
    const currentPwmReference = Math.max(currentColdPwm, currentWarmPwm);

    let intensity = idealPwmReference !== 0
      ? currentPwmReference / idealPwmReference
      : 0;

    if (intensity > 1) {
      intensity = 1;
    }

    return {
      intensity: Math.round(intensity * 100),
      temperature,
      duration : 0
    };
  }


  /* --------
   * Set new Lux
   * ---
   * This function will gracefully set the new Lux
   * computing it from Kelvin and Intensity
   * If a valid non zero duration is passed, it produce an animation
   * -------- */
  public setLux(lux: Lux): Promise<LuxResponse> {
    const {
      temperature,
      intensity,
      duration: _duration
    } = lux;

    /** Assert Kelvin is in range */
    if (Number.isNaN(temperature) || temperature < this.minTemperature || temperature > this.maxTemperature) {
      throw new BadRequestException(
        'set-lux/temperature-out-of-range',
        `Invalid Kelvin Temperature : ${temperature} in not in range (${this.minTemperature} - ${this.minTemperature})`
      );
    }

    /** Assert intensity is in range 0 - 1 */
    if (Number.isNaN(intensity) || intensity < 0 || intensity > 100) {
      throw new Error(`Invalid Light Intensity : ${intensity} in not in range (0 - 100)`);
    }

    /** Save the Lux as Last Lux */
    this.configService.set('lastLux', lux);

    /** Stop any current work */
    this.stopCurrentDutyCycle();

    /** Get new PWM from Temperature */
    let { warmPwm, coldPwm } = this.getPwmFromTemperature(temperature);

    warmPwm *= intensity / 100;
    coldPwm *= intensity / 100;

    /** Direct set data */
    if (typeof _duration !== 'number' || _duration === 0) {
      this.warmPin.pwmWrite(warmPwm);
      this.coldPin.pwmWrite(coldPwm);
      return Promise.resolve({
        ...lux,
        duration: 0
      });
    }

    const duration = Math.max(_duration ?? 0, this.frameDuration);

    /** Get current PWM */
    const currentWarmPwm = this.getPwmDutyCycle(this.warmPin);
    const currentColdPwm = this.getPwmDutyCycle(this.coldPin);
    const warmPwmDifference = warmPwm - currentWarmPwm;
    const coldPwmDifference = coldPwm - currentColdPwm;

    /** If no difference, abort */
    if (warmPwmDifference === 0 && coldPwmDifference === 0) {
      return Promise.resolve({
        ...lux,
        duration
      });
    }

    /** Generate a new WorkID */
    const currentDutyCycleId = Math.random()
      .toString(36)
      .slice(2);
    this.dutyCycleId = currentDutyCycleId;

    /** Build transition props */
    const transitionDefer = new Deferred<LuxResponse>();
    const stepCount = Math.round(duration / this.frameDuration);

    let t = 0;
    let lastColdPwm: number | undefined;
    let lastWarmPwm: number | undefined;

    const tIncrement = 1 / stepCount;

    const self = this;

    function step() {
      /** If current work has been stopped, abort step */
      if (currentDutyCycleId !== self.dutyCycleId) {
        return;
      }

      /** Update value */
      const multiplier = easeSinInOut(t);
      t += tIncrement;

      /** Set Step PWM */
      if (warmPwmDifference !== 0) {
        const clamped = self.clampPwm(currentWarmPwm + (warmPwmDifference * multiplier));

        if (clamped !== lastWarmPwm) {
          self.warmPin.pwmWrite(clamped);
          lastWarmPwm = clamped;
        }
      }

      if (coldPwmDifference !== 0) {
        const clamped = self.clampPwm(currentColdPwm + (coldPwmDifference * multiplier));

        if (clamped !== lastColdPwm) {
          self.coldPin.pwmWrite(clamped);
          lastColdPwm = clamped;
        }
      }

      /** Go next */
      if (t < 1) {
        self.prepareNextDutyCycleFrame(step);
      }
      else {
        self.stopCurrentDutyCycle();
        transitionDefer.resolve({
          ...lux,
          duration
        });
      }
    }

    /** Start the Animation */
    this.prepareNextDutyCycleFrame(step);

    /** Return the deferred object */
    return transitionDefer.promise;
  }

}
