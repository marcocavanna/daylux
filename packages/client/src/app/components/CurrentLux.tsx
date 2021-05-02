import * as React from 'react';

import Column from '@appbuckets/react-ui/Column';
import Row from '@appbuckets/react-ui/Row';
import Section from '@appbuckets/react-ui/Section';


/* --------
 * Component Interfaces
 * -------- */
export interface CurrentLuxProps {
  kelvin: number;

  intensity: number;
}


/* --------
 * Component Definition
 * -------- */
const CurrentLux: React.VFC<CurrentLuxProps> = (props) => {

  const {
    kelvin,
    intensity
  } = props;

  return (
    <Row>
      <Column>
        <Section
          fontWeight={'semi bold'}
          textAlign={'center'}
          icon={'thermometer-three-quarters'}
          label={'Temperatura'}
          content={`${kelvin} K`}
          className={'mb-0'}
        />
      </Column>

      <Column>
        <Section
          fontWeight={'semi bold'}
          textAlign={'center'}
          icon={'lightbulb'}
          label={'Intensità'}
          content={`${intensity} %`}
          className={'mb-0'}
        />
      </Column>
    </Row>
  );
};

CurrentLux.displayName = 'CurrentLux';

export default CurrentLux;
