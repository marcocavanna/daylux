import { ApiProperty } from '@nestjs/swagger';

import { DayluxWeatherData, Season, WeatherCondition } from 'daylux-interfaces';


export class WeatherResponse implements DayluxWeatherData {
  @ApiProperty()
  public clouds!: number;

  @ApiProperty()
  public current!: WeatherCondition;

  @ApiProperty()
  public location!: string;

  @ApiProperty()
  public midday!: number;

  @ApiProperty()
  public season!: Season;

  @ApiProperty()
  public sunrise!: number;

  @ApiProperty()
  public sunset!: number;

  @ApiProperty()
  public temperature!: number;

  @ApiProperty()
  public temperatureFeels!: number;

  @ApiProperty()
  public timestamp!: number;

  @ApiProperty()
  public suggestedLux!: { intensity: number; temperature: number };

}
