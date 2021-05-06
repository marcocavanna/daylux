import { Lux } from 'daylux-interfaces';

import { ApiProperty } from '@nestjs/swagger';


export class LuxResponse implements Lux {
  @ApiProperty()
  public duration!: number;

  @ApiProperty()
  public intensity!: number;

  @ApiProperty()
  public temperature!: number;

}
