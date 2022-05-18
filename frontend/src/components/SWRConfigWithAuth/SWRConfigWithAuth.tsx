import { ReactNode, useMemo } from 'react';
import { SWRConfig } from 'swr';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { getMakeRequestWithAuth } from './SWRConfigWithAuth.utils';

interface SWRConfigWithAuthProps {
  children: ReactNode;
}

export const SWRConfigWithAuth = ({ children }: SWRConfigWithAuthProps) => {
  const { accessToken } = useAuth();
  const makeRequestWithAuth = useMemo(
    () => getMakeRequestWithAuth(accessToken),
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
