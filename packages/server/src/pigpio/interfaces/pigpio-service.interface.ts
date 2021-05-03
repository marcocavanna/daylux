export type GpioMode = 'output' | 'input';

export interface GetPinOption {
  /** Set the PIN mode */
  mode?: GpioMode;

  /** Reload PIN, without considering cache */
  reload?: boolean;
}
