import Divider from '@appbuckets/react-ui/Divider';
import * as React from 'react';

import Box from '@appbuckets/react-ui/Box';
import Checkbox, { CheckboxProps } from '@appbuckets/react-ui/Checkbox';
import Header from '@appbuckets/react-ui/Header';
import Slider, { SliderProps } from '@appbuckets/react-ui/Slider';

import { useAppContext } from '../context';

import { useConfigMutation } from '../queries/useConfigMutation';
import { useLuxMutation } from '../queries/useLuxMutation';

import CurrentLux from './CurrentLux';


const AdjustLux: React.VFC = () => {

  const { query } = useAppContext();

  const [ kelvin, setKelvin ] = React.useState(query.data?.lux.kelvin || 3000);
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
      setKelvin(sliderProps.value || 0);
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
        kelvin  : sliderProps.value,
        duration: 2500
      });
    },
    [ luxMutation, intensity ]
  );

  const handleIntensitySlideEnd = React.useCallback(
    (nothing: null, sliderProps: SliderProps) => {
      luxMutation.mutate({
        kelvin,
        intensity: sliderProps.value,
        duration : 2500
      });
    },
    [ luxMutation, kelvin ]
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
          textAlign={'center'}
          checked={!!query.data?.config.autoLux}
          label={'Modalità Automatica'}
          hint={'Spunta questa opzione per impostare automaticamente la luminosità del tuo DayLux in base alle condizioni meteo'}
          onClick={handleAutoLuxClick}
        />
      </Box>

      {!query.data?.config.autoLux && (
        <React.Fragment>
          <Divider content={'Variazione Manuale'} />

          <Box my={6}>
            <CurrentLux
              kelvin={kelvin}
              intensity={intensity}
            />
          </Box>

          <Box my={6}>
            <Slider
              label={'Temperatura'}
              step={25}
              min={3000}
              max={6000}
              value={kelvin}
              onChange={handleKelvinSlideChange}
              onAfterChange={handleKelvinSlideEnd}
              hint={'Vuoi una luce più calda o più fredda?'}
            />
          </Box>

          <Box my={6}>
            <Slider
              label={'Intensità'}
              step={5}
              min={0}
              max={100}
              value={intensity}
              onChange={handleIntensitySlideChange}
              onAfterChange={handleIntensitySlideEnd}
              hint={'Vuoi una luce più forte o più dolce?'}
            />
          </Box>
        </React.Fragment>
      )}

    </React.Fragment>
  );

};

AdjustLux.displayName = 'AdjustLux';

export default AdjustLux;
