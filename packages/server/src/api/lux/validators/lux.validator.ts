import {
  IsOptional,
  IsNumber,
  Min,
  Max
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Lux } from 'daylux-interfaces';


export class ValidatedLux implements Lux {
  @ApiProperty({
    description: 'Set the duration of change light transition in MS. Pass 0 to disable transition',
    minimum    : 0,
    required   : false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  public duration?: number;

  @ApiProperty({
    description: 'Set the light intensity',
    minimum    : 0,
    maximum    : 100,
    required   : true
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  public intensity!: number;

  @ApiProperty({
    description: 'Set the temperature of the light, expressed in Kelvin',
    minimum    : 3000,
    maximum    : 6000,
    required   : true
  })
  @IsNumber()
  @Min(3000)
  @Max(6000)
  public temperature!: number;
}
