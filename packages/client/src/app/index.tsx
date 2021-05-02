import * as React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import ButterToast from 'butter-toast';

import '../assets/style/index.scss';

import Container from '@appbuckets/react-ui/Container';
import AppContent from './components/AppContent';

import Navbar from './components/Navbar';

import { AppProvider } from './context';


const App: React.VFC = () => {

  const queryClient = React.useRef<QueryClient>();

  if (!queryClient.current) {
    queryClient.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClient.current}>
      <AppProvider>
        <Navbar />

        <div className={'app-container'}>
          <Container fixedTo={'tablet'} className={'py-4'}>
            <AppContent />
          </Container>
        </div>

        <ButterToast
          namespace={'toast-container'}
          className={'toasts'}
          position={{
            horizontal: 'POS_CENTER',
            vertical  : 'POS_BOTTOM'
          }}
        />
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
