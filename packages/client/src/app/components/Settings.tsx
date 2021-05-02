import Input from '@appbuckets/react-ui/Input';
import Section from '@appbuckets/react-ui/Section';
import axios from 'axios';
import * as React from 'react';

import Box from '@appbuckets/react-ui/Box';
import Button from '@appbuckets/react-ui/Button';
import Column from '@appbuckets/react-ui/Column';
import Header from '@appbuckets/react-ui/Header';
import NumericInput from '@appbuckets/react-ui/NumericInput';
import Row from '@appbuckets/react-ui/Row';

import { useAppContext } from '../context';

import { useConfigMutation } from '../queries/useConfigMutation';


const LuxSettings: React.VFC = () => {

  const { query } = useAppContext();


  // ----
  // Handlers
  // ----
  const [ weatherAPI, setWeatherAPI ] = React.useState(query.data?.config.weatherAPIKey || '');
  const [ latitude, setLatitude ] = React.useState(query.data?.config.location?.latitude);
  const [ longitude, setLongitude ] = React.useState(query.data?.config.location?.longitude);


  // ----
  // Mutations
  // ----
  const latitudeMutation = useConfigMutation('location.latitude');
  const longitudeMutation = useConfigMutation('location.longitude');
  const weatherAPIMutation = useConfigMutation('weatherAPIKey');


  const handleTestLocation = React.useCallback(
    () => {
      axios.get('/api/weather');
    },
    []
  );


  // ----
  // Component Render
  // ----
  return (
    <React.Fragment>

      <Header
        textAlign={'center'}
        content={'Impostami'}
        subheader={'Modifica i parametri di funzionamento'}
      />

      <Box my={6}>
        <Section
          label={'Rilevamento Meteo'}
          content={(
            <React.Fragment>
              <Input
                label={'Weather API Key'}
                value={weatherAPI}
                hint={'Inserisci la tua API Key da utilizzare per interfacciarsi con OpenWeatherMap'}
                onBlur={(e, p) => (
                  weatherAPIMutation.mutate(p.value || null)
                )}
                onChange={(e, p) => setWeatherAPI(p.value || '')}
              />
              <Row className={'mt-4 mb-4'}>
                <Column>
                  <NumericInput
                    label={'Latitudine'}
                    placeholder={'eg. 45.0114292'}
                    value={latitude}
                    precision={7}
                    onBlur={(e, p) => (
                      latitudeMutation.mutate(p.value || null)
                    )}
                    onChange={(e, p) => setLatitude(p.value)}
                    decimalSeparator={'.'}
                  />
                </Column>
                <Column>
                  <NumericInput
                    label={'Longitudine'}
                    placeholder={'eg. 7.8023018'}
                    value={longitude}
                    precision={7}
                    onBlur={(e, p) => (
                      longitudeMutation.mutate(p.value || null)
                    )}
                    onChange={(e, p) => setLongitude(p.value)}
                    decimalSeparator={'.'}
                  />
                </Column>
              </Row>

              <Button
                primary
                full
                disabled={!weatherAPI || typeof latitude !== 'number' || typeof longitude !== 'number'}
                className={'mt-4'}
                icon={'map-marker-alt'}
                content={'Test Localizzazione'}
                onClick={handleTestLocation}
              />
            </React.Fragment>
          )}
        />
      </Box>

    </React.Fragment>
  );

};

LuxSettings.displayName = 'LuxSettings';

export default LuxSettings;
