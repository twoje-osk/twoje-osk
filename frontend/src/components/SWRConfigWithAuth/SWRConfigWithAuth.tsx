import { ReactNode, useCallback } from 'react';
import { SWRConfig } from 'swr';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { RequestError } from '../../utils/makeRequest';
import { useMakeRequestWithAuth } from '../../hooks/useMakeRequestWithAuth/useMakeRequestWithAuth';
import { useCommonSnackbars } from '../../hooks/useCommonSnackbars/useCommonSnackbars';

interface SWRConfigWithAuthProps {
  children: ReactNode;
}

export const SWRConfigWithAuth = ({ children }: SWRConfigWithAuthProps) => {
  const { logOut } = useAuth();
  const { showInfoSnackbar } = useCommonSnackbars();

  const makeRequestWithAuth = useMakeRequestWithAuth();
  const curriedMakeRequestWithAuth = useCallback(
    async (resource: string) => {
      const response = await makeRequestWithAuth(resource);

      if (response.ok) {
        return response.data;
      }

      const { error } = response;
      if (error instanceof RequestError && error.status === 401) {
        logOut();
        showInfoSnackbar('Zostałeś wylogowany');
      }

      throw error;
    },
    [logOut, makeRequestWithAuth, showInfoSnackbar],
  );

  return (
    <SWRConfig
      value={{
        fetcher: curriedMakeRequestWithAuth,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
