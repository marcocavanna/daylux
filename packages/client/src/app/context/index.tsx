import * as React from 'react';

import axios from 'axios';

import { useQuery, UseQueryResult } from 'react-query';

import { Lux, Config } from 'daylux-interfaces';


/* --------
 * API Types
 * -------- */
export interface LuxStatusResponse {
  config: Config,

  lux: Lux
}

export type UseLuxStatusResult = UseQueryResult<LuxStatusResponse> & {
  start: () => void;
  stop: () => void;
};


/* --------
 * Context Data
 * -------- */
type AppView = 'home' | 'settings';

export type AppContext = {
  /** Lux status Query */
  query: UseLuxStatusResult;

  /** Set current View */
  setView: React.Dispatch<React.SetStateAction<AppView>>;

  /** Current View */
  view: AppView;
};


/* --------
 * Main Query
 * -------- */
const useLuxStatus = (): UseLuxStatusResult => {

  const [ refetchEnabled, setRefetchEnabled ] = React.useState(true);

  const stop = React.useCallback(
    () => {
      setRefetchEnabled(false);
    },
    []
  );

  const start = React.useCallback(
    () => {
      setRefetchEnabled(true);
    },
    []
  );

  const status = useQuery({
    queryKey: [ 'get-status' ],
    enabled : refetchEnabled,
    queryFn : async () => {
      const response = await axios.get<LuxStatusResponse>('/api/get-status');
      return response.data;
    }
  });

  return {
    ...status,
    start,
    stop
  };
};

export default useLuxStatus;


/* --------
 * Context
 * -------- */
const AppCtx = React.createContext<AppContext | null>(null);

export function useAppContext(): AppContext {
  const ctx = React.useContext(AppCtx);

  if (ctx === null) {
    throw new Error('Invalid Context');
  }

  return ctx;
}

export const AppProvider: React.FunctionComponent = (props) => {

  // ----
  // Run Query to Load Lux Status
  // ----
  const status = useLuxStatus();


  // ----
  // Build State and Internal Handler
  // ----
  const [ view, setView ] = React.useState<AppView>('home');

  const ctx: AppContext = {
    query: status,
    setView,
    view
  };

  return (
    <AppCtx.Provider value={ctx}>
      {props.children}
    </AppCtx.Provider>
  );

};
