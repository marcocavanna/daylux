import * as React from 'react';

import Box from '@appbuckets/react-ui/Box';
import Loader from '@appbuckets/react-ui/Loader';

import { useAppContext } from '../context';

import AdjustLux from './AdjustLux';
import LuxSettings from './Settings';


const AppContent: React.VFC = () => {

  const {
    view,
    query
  } = useAppContext();

  if (query.status !== 'success') {
    return (
      <Box textAlign={'center'}>
        <Loader
          primary
          inline
          type={'indeterminate bar'}
          size={'large'}
        />
      </Box>
    );
  }

  if (view === 'settings') {
    return <LuxSettings />;
  }

  return <AdjustLux />;

};

AppContent.displayName = 'AppContent';

export default AppContent;
