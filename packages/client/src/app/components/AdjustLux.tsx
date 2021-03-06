import * as React from 'react';

import Box from '@appbuckets/react-ui/Box';
import Checkbox, { CheckboxProps } from '@appbuckets/react-ui/Checkbox';
import Divider from '@appbuckets/react-ui/Divider';
import Header from '@appbuckets/react-ui/Header';
import Slider, { SliderProps } from '@appbuckets/react-ui/Slider';

import { useAppContext } from '../context';

import { useConfigMutation } from '../queries/useConfigMutation';
import { useLuxMutation } from '../queries/useLuxMutation';

import CurrentLux from './CurrentLux';


const AdjustLux: React.VFC = () => {

  const { query } = useAppContext();

  const [ temperature, setTemperature ] = React.useState(query.data?.lux.temperature || 3000);
  const [ intensity, setIntensity ] = React.useState(query.data?.lux.intensity || 0);


  // ----
  // Mutations
  // ----
  const autoLuxMutation = useConfigMutation('autoLux');
  const luxMutation = useLuxMutation();


  // ----
  // Handlers
  // ----
  const handleAutoLuxClick = React.useCallback(
    (event: any, checkboxProps: CheckboxProps) => {
      autoLuxMutation.mutate(!!checkboxProps.checked);
    },
    [ autoLuxMutation ]
  );

  const handleKelvinSlideChange = React.useCallback(
    (event: any, sliderProps: SliderProps) => {
      setTemperature(sliderProps.value || 0);
    },
    []
  );

  const handleIntensitySlideChange = React.useCallback(
    (event: any, sliderProps: SliderProps) => {
      setIntensity(sliderProps.value || 0);
    },
    []
  );

  const handleKelvinSlideEnd = React.useCallback(
    (nothing: null, sliderProps: SliderProps) => {
      luxMutation.mutate({
        intensity,
        temperature: sliderProps.value,
        duration   : 2500
      });
    },
    [ luxMutation, intensity ]
  );

  const handleIntensitySlideEnd = React.useCallback(
    (nothing: null, sliderProps: SliderProps) => {
      luxMutation.mutate({
        temperature,
        intensity: sliderProps.value,
        duration : 2500
      });
    },
    [ luxMutation, temperature ]
  );


  // ----
  // Component Render
  // ----
  return (
    <React.Fragment>

      <Header
        textAlign={'center'}
        content={'Ciao'}
        subheader={'Cambia la tua Giornata'}
      />

      <Box my={6}>
        <Checkbox
          disabled={luxMutation.isLoading}
          textAlign={'center'}
          checked={!!query.data?.config.autoLux}
          label={'Modalit?? Automatica'}
          hint={'Spunta questa opzione per impostare automaticamente la luminosit?? del tuo DayLux in base alle condizioni meteo'}
          onClick={handleAutoLuxClick}
        />
      </Box>

      {!query.data?.config.autoLux && (
        <React.Fragment>
          <Divider content={'Variazione Manuale'} />

          <Box my={6}>
            <CurrentLux
              kelvin={temperature}
              intensity={intensity}
            />
          </Box>

          <Box my={6}>
            <Slider
              disabled={luxMutation.isLoading}
              label={'Temperatura'}
              step={25}
              min={3000}
              max={6000}
              value={temperature}
              onChange={handleKelvinSlideChange}
              onAfterChange={handleKelvinSlideEnd}
              hint={'Vuoi una luce pi?? calda o pi?? fredda?'}
            />
          </Box>

          <Box my={6}>
            <Slider
              disabled={luxMutation.isLoading}
              label={'Intensit??'}
              step={5}
              min={0}
              max={100}
              value={intensity}
              onChange={handleIntensitySlideChange}
              onAfterChange={handleIntensitySlideEnd}
              hint={'Vuoi una luce pi?? forte o pi?? dolce?'}
            />
          </Box>
        </React.Fragment>
      )}

    </React.Fragment>
  );

};

AdjustLux.displayName = 'AdjustLux';

export default AdjustLux;
