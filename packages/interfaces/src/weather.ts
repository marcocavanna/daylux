export type WeatherCode = { id: number, main: string, description: string, icon: string };

export interface OpenWeatherMapData {
  coord: {
    lon: number,
    lat: number
  };

  weather: WeatherCode[];

  base: string;

  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number
  };

  visibility: number;

  wind: {
    speed: number,
    deg: number
  };

  clouds: {
    all: number;
  }

  dt: number;

  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone: number;

  id: number;

  name: string;

  cod: number
}


export type Season = 'WINTER' | 'SPRING' | 'SUMMER' | 'AUTUMN';

export type WeatherCondition =
  'HEAVY_THUNDERSTORM'
  | 'THUNDERSTORM'
  | 'DRIZZLE'
  | 'HEAVY_RAIN'
  | 'RAIN'
  | 'SNOW'
  | 'MIST'
  | 'CLEAR'
  | 'OVERCAST_CLOUDS'
  | 'CLOUDS'
  | 'FEW_CLOUDS';


export interface DayluxWeatherData {
  clouds: number;

  current: WeatherCondition;

  location: string;

  midday: number;

  season: Season;

  suggestedLux: {
    intensity: number;
    temperature: number;
  };

  sunrise: number;

  sunset: number;

  temperature: number;

  temperatureFeels: number;

  timestamp: number;
}
