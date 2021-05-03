import { Logger } from '@nestjs/common';

/* --------
 * Types
 * -------- */
export interface GpioOptions {
  /**
   * INPUT, OUTPUT, ALT0, ALT1, ALT2, ALT3, ALT4, or ALT5 (optional, no default)
   */
  mode?: number;

  /**
   * PUD_OFF, PUD_DOWN, or PUD_UP (optional, no default)
   */
  pullUpDown?: number;

  /**
   * interrupt edge for inputs. RISING_EDGE, FALLING_EDGE, or EITHER_EDGE (optional, no default)
   */
  edge?: number;

  /**
   * interrupt timeout in milliseconds (optional, defaults to 0 meaning no timeout if edge specified)
   */
  timeout?: number;

  /**
   * boolean specifying whether or not alert events are emitted when the GPIO changes state (optional, default false)
   */
  alert?: boolean;
}


export class GpioMock {

  // ----
  // Static Constant
  // ----
  static INPUT: number = 0; // PI_INPUT

  static OUTPUT: number = 1; // PI_OUTPUT;

  static ALT0: number = 4; // PI_ALT0;

  static ALT1: number = 5; // PI_ALT1;

  static ALT2: number = 6; // PI_ALT2;

  static ALT3: number = 7; // PI_ALT3;

  static ALT4: number = 3; // PI_ALT4;

  static ALT5: number = 2; // PI_ALT5;

  /* pud */
  static PUD_OFF: number = 0; // PI_PUD_OFF;

  static PUD_DOWN: number = 1; // PI_PUD_DOWN;

  static PUD_UP: number = 2; // PI_PUD_UP;

  /* isr */
  static RISING_EDGE: number = 0; // RISING_EDGE;

  static FALLING_EDGE: number = 1; // FALLING_EDGE;

  static EITHER_EDGE: number = 2; // EITHER_EDGE;

  /* timeout */
  static TIMEOUT: number = 2; // PI_TIMEOUT;

  /* gpio numbers */

  static MIN_GPIO: number = 0; // PI_MIN_GPIO;

  static MAX_GPIO: number = 53; // PI_MAX_GPIO;

  static MAX_USER_GPIO: number = 31; // PI_MAX_USER_GPIO;


  // ----
  // Private Variable
  // ----
  private digitalValue: number = 0;

  private pwmValue: number = 0;

  private frequency: number = 31;

  private _pwmRange = 0;

  private servoPulseWidth: number = 1500;

  private _mode: number = GpioMock.OUTPUT;

  private logger: Logger;


  constructor(private readonly gpio: number, options: GpioOptions = {}) {

    /** Create the Logger */
    this.logger = new Logger(`GPIO ${this.gpio}`);

    this.logger.log('Initializing...');

    if (typeof options.mode === 'number') {
      this._mode = options.mode;
      this.logger.log(`Setting mode = ${options.mode}`);
    }
  }


  mode(mode: number): GpioMock {
    this.logger.log(`Setting mode = ${mode}`);
    this._mode = mode;
    return this;
  }


  getMode(): number {
    this.logger.log(`Getting mode = ${this.mode}`);
    return this._mode;
  }


  pullUpDown(pud: number): GpioMock {
    this.logger.log(`Setting pullUpDown = ${pud}`);
    return this;
  }


  digitalRead(): number {
    this.logger.log(`Getting digitalValue = ${this.digitalValue}`);
    return this.digitalValue;
  }


  digitalWrite(level: 1 | 0): GpioMock {
    this.logger.log(`Setting value = ${level}`);
    this.digitalValue = level;
    return this;
  }


  trigger(pulseLen: number, level: number): GpioMock {
    this.logger.log(`Triggering, pulseLen: ${pulseLen}, level: ${level}`);
    return this;
  }


  pwmWrite(dutyCycle: number): GpioMock {
    this.logger.log(`Setting dutyCycle = ${dutyCycle}`);
    this.pwmValue = dutyCycle;
    return this;
  }


  hardwarePwmWrite(frequency: number, dutyCycle: number): GpioMock {
    this.logger.log(`Setting dutyCycle = ${dutyCycle}, frequency = ${frequency}`);
    this.pwmValue = dutyCycle;
    this.frequency = frequency;
    return this;
  }


  getPwmDutyCycle() {
    this.logger.log(`Getting dutyCycle = ${this.pwmValue}`);
    return this.pwmValue;
  }


  pwmRange(range: number): GpioMock {
    this.logger.log(`Setting pwmRange = ${range}`);
    this._pwmRange = range;
    return this;
  }


  getPwmRange() {
    this.logger.log(`Getting pwmRange = ${this._pwmRange}`);
    return this._pwmRange;
  }


  getPwmRealRange() {
    this.logger.log(`Getting pwmRange = ${this._pwmRange}`);
    return this;
  }


  pwmFrequency(frequency: number): GpioMock {
    this.logger.log(`Setting frequency = ${this.frequency}`);
    this.frequency = frequency;
    return this;
  }


  getPwmFrequency() {
    this.logger.log(`Getting frequency = ${this.frequency}`);
    return this.frequency;
  }


  servoWrite(pulseWidth: number): GpioMock {
    this.logger.log(`Setting pulseWidth = ${this.servoPulseWidth}`);
    this.servoPulseWidth = Math.min(Math.max(pulseWidth, 500), 2500);
    return this;
  }


  getServoPulseWidth() {
    this.logger.log(`Getting pulseWidth = ${this.servoPulseWidth}`);
    return this.servoPulseWidth;
  }


  removeAllListeners() {
    this.logger.log('Removed all listeners for this pin');
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(event: string, handler: (...args: any[]) => void) {
    this.logger.log(`On ${event}] will run handler`);
  }
}
