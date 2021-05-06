import * as React from 'react';

import axios from 'axios';

import { DayluxWeatherData } from 'daylux-interfaces';

import Box from '@appbuckets/react-ui/Box';
import Button from '@appbuckets/react-ui/Button';
import Column from '@appbuckets/react-ui/Column';
import Header from '@appbuckets/react-ui/Header';
import Input, { InputProps } from '@appbuckets/react-ui/Input';
import Item from '@appbuckets/react-ui/Item';
import Modal from '@appbuckets/react-ui/Modal';
import NumericInput, { NumericInputProps } from '@appbuckets/react-ui/NumericInput';
import Row from '@appbuckets/react-ui/Row';
import Section from '@appbuckets/react-ui/Section';

import { useAppContext } from '../context';

import { useConfigMutation } from '../queries/useConfigMutation';
import { useLuxMutation } from '../queries/useLuxMutation';

import { getSeasonName, getWeatherCondition, getWeatherIcon, will } from '../utils';


const LuxSettings: React.VFC = () => {

  const { query } = useAppContext();


  // ----
  // Internal States
  // ----
  const [ isTestingLocation, setIsTestingLocation ] = React.useState<boolean>(false);
  const [
    testLocationResponse,
    setTestLocationResponse
  ] = React.useState<{ weather: DayluxWeatherData | null, error: any } | null>(null);
  const [ weatherAPI, setWeatherAPI ] = React.useState(query.data?.config.weatherAPIKey || '');
  const [ latitude, setLatitude ] = React.useState(query.data?.config.location?.latitude);
  const [ longitude, setLongitude ] = React.useState(query.data?.config.location?.longitude);


  // ----
  // Mutations
  // ----
  const luxMutation = useLuxMutation();
  const latitudeMutation = useConfigMutation('location.latitude');
  const longitudeMutation = useConfigMutation('location.longitude');
  const weatherAPIMutation = useConfigMutation('weatherAPIKey');


  // ----
  // Handlers
  // ----
  const handleWeatherAPIChange = React.useCallback(
    (e: any, inputProps: InputProps) => {
      setWeatherAPI(inputProps.value ?? '');
    },
    []
  );

  const handleLatitudeChange = React.useCallback(
    (e: any, numericInputProps: NumericInputProps) => {
      setLatitude(numericInputProps.value);
    },
    []
  );

  const handleLongitudeChange = React.useCallback(
    (e: any, numericInputProps: NumericInputProps) => {
      setLongitude(numericInputProps.value);
    },
    []
  );

  const handleWeatherAPIBlur = React.useCallback(
    (e: any, inputProps: InputProps) => {
      weatherAPIMutation.mutate(inputProps.value || '');
    },
    [ weatherAPIMutation ]
  );

  const handleLatitudeBlur = React.useCallback(
    (e: any, numericInputProps: NumericInputProps) => {
      latitudeMutation.mutate(numericInputProps.value ?? null);
    },
    [ latitudeMutation ]
  );

  const handleLongitudeBlur = React.useCallback(
    (e: any, numericInputProps: NumericInputProps) => {
      longitudeMutation.mutate(numericInputProps.value ?? null);
    },
    [ longitudeMutation ]
  );

  const handleTestLocationClick = React.useCallback(
    async () => {
      setIsTestingLocation(true);

      const [ error, data ] = await will(axios.get<DayluxWeatherData>('/api/system/weather'));

      setIsTestingLocation(false);

      if (error) {
        setTestLocationResponse({ weather: null, error });
        return;
      }

      setTestLocationResponse({ weather: data.data, error: null });
    },
    []
  );

  const handleClearTestLocationData = React.useCallback(
    () => {
      setTestLocationResponse(null);
    },
    []
  );

  const { weather } = testLocationResponse || {};
  const handleSetSuggestedLux = React.useCallback(
    () => {
      if (weather) {
        luxMutation.mutate({
          ...weather.suggestedLux,
          duration: 2500
        });
      }
    },
    [ luxMutation, weather ]
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
                disabled={isTestingLocation}
                label={'Weather API Key'}
                value={weatherAPI}
                hint={'Inserisci la tua API Key da utilizzare per interfacciarsi con OpenWeatherMap'}
                onBlur={handleWeatherAPIBlur}
                onChange={handleWeatherAPIChange}
              />
              <Row className={'mt-4 mb-4'}>
                <Column>
                  <NumericInput
                    disabled={isTestingLocation}
                    label={'Latitudine'}
                    placeholder={'eg. 45.0114292'}
                    value={latitude}
                    precision={7}
                    decimalSeparator={'.'}
                    onBlur={handleLatitudeBlur}
                    onChange={handleLatitudeChange}
                  />
                </Column>
                <Column>
                  <NumericInput
                    disabled={isTestingLocation}
                    label={'Longitudine'}
                    placeholder={'eg. 7.8023018'}
                    value={longitude}
                    precision={7}
                    decimalSeparator={'.'}
                    onBlur={handleLongitudeBlur}
                    onChange={handleLongitudeChange}
                  />
                </Column>
              </Row>

              <Button
                primary
                full
                disabled={!weatherAPI || typeof latitude !== 'number' || typeof longitude !== 'number' || isTestingLocation}
                className={'mt-4'}
                icon={'map-marker-alt'}
                content={'Test Localizzazione'}
                onClick={handleTestLocationClick}
              />
            </React.Fragment>
          )}
        />
      </Box>


      {testLocationResponse && (
        <Modal
          open
          onClose={handleClearTestLocationData}
          icon={{
            name   : testLocationResponse.error ? 'times-circle' : 'check-circle',
            success: !!testLocationResponse.weather,
            danger : !!testLocationResponse.error
          }}
          header={{
            content  : 'Risultato Localizzazione',
            textAlign: 'center'
          }}
          actions={[
            {
              key    : 1,
              content: 'Chiudi',
              onClick: handleClearTestLocationData
            },
            {
              key    : 2,
              content: 'Imposta Luce Suggerita',
              primary: true,
              onClick: handleSetSuggestedLux
            }
          ]}
          content={(
            <Modal.Content>
              {testLocationResponse.error && (
                <div>
                  <h5>Errore di Localizzazione</h5>
                  <pre
                    style={{
                      overflow  : 'scroll',
                      whiteSpace: 'pre-wrap',
                      fontSize  : '.9em'
                    }}
                  >
                    {JSON.stringify(testLocationResponse.error, null, 2)}
                  </pre>
                </div>
              )}

              {testLocationResponse.weather && (
                <div>
                  <Row>
                    <Column>
                      <Section
                        label={'Località'}
                        content={(
                          <React.Fragment>
                            Ti trovi a <b>{testLocationResponse.weather.location}</b>
                          </React.Fragment>
                        )}
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Section
                        label={'Orario'}
                        content={(
                          <React.Fragment>
                            È il <b>{new Date(testLocationResponse.weather.timestamp).toLocaleString()}</b>
                          </React.Fragment>
                        )}
                      />
                    </Column>
                    <Column>
                      <Section
                        label={'Stagione'}
                        content={(
                          <React.Fragment>
                            Sei in <b>{getSeasonName(testLocationResponse.weather.season)}</b>
                          </React.Fragment>
                        )}
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Section
                        label={'Temperatura'}
                        content={(
                          <Item
                            avatar={{ icon: 'thermometer-half' }}
                            header={`${testLocationResponse.weather.temperature} ° C`}
                            content={`${testLocationResponse.weather.temperatureFeels} ° C percepita`}
                          />
                        )}
                      />
                    </Column>
                    <Column>
                      <Section
                        label={'Meteo'}
                        content={(
                          <Item
                            avatar={{ icon: getWeatherIcon(testLocationResponse.weather.current) }}
                            header={getWeatherCondition(testLocationResponse.weather.current)}
                          />
                        )}
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column>
                      <Section
                        label={'Alba'}
                        fontWeight={'semi bold'}
                        content={new Date(testLocationResponse.weather.sunrise).toLocaleTimeString()}
                      />
                    </Column>
                    <Column>
                      <Section
                        label={'Mezzogiorno'}
                        fontWeight={'semi bold'}
                        textAlign={'center'}
                        content={new Date(testLocationResponse.weather.midday).toLocaleTimeString()}
                      />
                    </Column>
                    <Column>
                      <Section
                        label={'Tramonto'}
                        fontWeight={'semi bold'}
                        textAlign={'right'}
                        content={new Date(testLocationResponse.weather.sunset).toLocaleTimeString()}
                      />
                    </Column>
                  </Row>
                  <Section
                    label={'Configurazione suggerita'}
                    content={(
                      <React.Fragment>
                        In base ai dati raccolti, la configurazione suggerita è <b>{testLocationResponse.weather.suggestedLux.temperature} Kelvin</b>{' '}
                        con intensità <b>{testLocationResponse.weather.suggestedLux.intensity} %</b>
                      </React.Fragment>
                    )}
                  />
                </div>
              )}
            </Modal.Content>
          )}
        />
      )}

    </React.Fragment>
  );

};

LuxSettings.displayName = 'LuxSettings';

export default LuxSettings;
