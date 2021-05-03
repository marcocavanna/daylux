import {
  IsOptional,
  IsNumber,
  Min,
  Max
} from 'class-validator';

import { Lux } from 'daylux-interfaces';


export class ValidatedLux implements Lux {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  public boostIntensity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public duration?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  public intensity!: number;

  @IsNumber()
  public temperature!: number;
}
