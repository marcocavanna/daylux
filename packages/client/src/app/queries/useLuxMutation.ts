import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { Lux } from 'daylux-interfaces';

import { Toast } from '../module/Notification';

import { useAppContext, LuxStatusResponse } from '../context';


export const useLuxMutation = () => {

  const { query } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation<Partial<Lux>, any, Partial<Lux>, LuxStatusResponse | undefined>(
    (partialLux) => axios.post('/api/lux', partialLux, { params: { wait: true } }), {
      /** On mutating cancel get-config query */
      onMutate: async (partialLux) => {
        /** Cancel old query */
        await queryClient.cancelQueries('get-status');
        query.stop();

        /** Get a snapshot of current value */
        const currentValue = queryClient.getQueryData<LuxStatusResponse>('get-status');

        /** Optimistically update query data */
        queryClient.setQueryData<LuxStatusResponse | undefined>('get-status', (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            lux: {
              ...old?.lux,
              ...partialLux
            }
          };
        });

        /** Return the ctx to next function */
        return currentValue;
      },

      /** On error, roll back state */
      onError: (error, value, previousValue) => {
        queryClient.setQueryData('get-status', previousValue);
      },

      /** Restart query on mutation end */
      onSettled: async (data, error) => {
        query.start();

        await queryClient.invalidateQueries('get-status');

        if (!error) {
          Toast.success('Fatto');
          return;
        }

        Toast.error(error as Error);
      }
    }
  );

};
