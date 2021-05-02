import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import dotProp from 'dot-prop';
import { FieldPathValue, Path, Config } from 'daylux-interfaces';

import { Toast } from '../module/Notification';

import { useAppContext, LuxStatusResponse } from '../context';


export const useConfigMutation = <TPath extends Path<Config>>(field: TPath) => {

  const { query } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation<FieldPathValue<Config, TPath>, any, FieldPathValue<Config, TPath>, LuxStatusResponse | undefined>(
    (value) => axios.post(
      '/api/set-config',
      {
        field,
        value
      }
    ), {
      /** On mutating cancel get-config query */
      onMutate: async (value) => {
        /** Cancel old query */
        await queryClient.cancelQueries('get-status');
        query.stop();

        /** Get a snapshot of current value */
        const currentValue = queryClient.getQueryData<LuxStatusResponse>('get-status');

        /** Optimistically update query data */
        queryClient.setQueryData<LuxStatusResponse | undefined>('get-status', (old) => {
          if (old) {
            dotProp.set(old.config, field, value);
          }
          return old;
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
