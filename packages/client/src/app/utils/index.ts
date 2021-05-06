import { IconProps } from '@appbuckets/react-ui/Icon';
import { Season, WeatherCondition } from 'daylux-interfaces';


export async function will<T>(promise: Promise<T>): Promise<Readonly<[ null | any, T ]>> {
  try {
    const result = await promise;

    return [ null, result ] as const;
  }
  catch (error) {
    return [ error, null as unknown as T ] as const;
  }
}


export function getSeasonName(season: Season): string {
  return {
    WINTER: 'Inverno',
    SPRING: 'Primavera',
    SUMMER: 'Estate',
    AUTUMN: 'Autunno'
  }[season];
}


export function getWeatherCondition(condition: WeatherCondition): string {
  const conditions: Record<WeatherCondition, string> = {
    CLEAR             : 'Cielo Sereno',
    CLOUDS            : 'Qualche Nuvola',
    DRIZZLE           : 'Pioviggine',
    FEW_CLOUDS        : 'Poche Nuvole',
    HEAVY_RAIN        : 'Pioggia Pesante',
    HEAVY_THUNDERSTORM: 'Forte Temporale',
    MIST              : 'Nebbia',
    OVERCAST_CLOUDS   : 'Cielo Nuvoloso',
    RAIN              : 'Pioggia',
    SNOW              : 'Neve',
    THUNDERSTORM      : 'Temporale'
  };

  return conditions[condition];
}


export function getWeatherIcon(condition: WeatherCondition): IconProps['name'] {
  const icons: Record<WeatherCondition, IconProps['name']> = {
    CLEAR             : 'sun',
    CLOUDS            : 'clouds-sun',
    DRIZZLE           : 'cloud-rain',
    FEW_CLOUDS        : 'cloud-sun',
    HEAVY_RAIN        : 'cloud-showers-heavy',
    HEAVY_THUNDERSTORM: 'bolt',
    MIST              : 'smog',
    OVERCAST_CLOUDS   : 'cloud',
    RAIN              : 'cloud-rain',
    SNOW              : 'snowflake',
    THUNDERSTORM      : 'bolt'
  };

  return icons[condition];
}
