import { ReactNode, useCallback } from 'react';
import { SWRConfig } from 'swr';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { makeRequest } from '../../utils/makeRequest';

interface SWRConfigWithAuthProps {
  children: ReactNode;
}

export const SWRConfigWithAuth = ({ children }: SWRConfigWithAuthProps) => {
  const { accessToken } = useAuth();
  const makeRequestWithAuth = useCallback(
    async (resource: string) => {
      const response = await makeRequest(resource, accessToken);
      if (response.ok) {
        return response.data;
      }

      throw response.error;
    },
    [accessToken],
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
