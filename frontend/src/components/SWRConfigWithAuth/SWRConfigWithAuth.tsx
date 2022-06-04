import { ReactNode, useCallback } from 'react';
import { SWRConfig } from 'swr';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { RequestError } from '../../utils/makeRequest';
import { getMakeRequestWithAuth } from './SWRConfigWithAuth.utils';

interface SWRConfigWithAuthProps {
  children: ReactNode;
}

export const SWRConfigWithAuth = ({ children }: SWRConfigWithAuthProps) => {
  const { accessToken, logOut } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const makeRequestWithAuth = useCallback(
    async function <ResponseDto>(resource: string) {
      try {
        return await getMakeRequestWithAuth<ResponseDto>(accessToken)(resource);
      } catch (error) {
        if (error instanceof RequestError && error.status === 401) {
          logOut();
          enqueueSnackbar('Zostałeś wylogowany', {
            autoHideDuration: 2000,
            variant: 'info',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }

        throw error;
      }
    },
    [accessToken, enqueueSnackbar, logOut],
  );

  return (
    <SWRConfig
      value={{
        fetcher: makeRequestWithAuth,
      }}
    >
      {children}
    </SWRConfig>
  );
};
