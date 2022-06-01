import { DtoUser, UserMyProfileResponseDto } from '@osk/shared';
import { createContext, ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getMakeRequestWithAuth } from '../SWRConfigWithAuth/SWRConfigWithAuth.utils';

interface AuthContextType {
  accessToken: string | null;
  logIn: (accessToken: string) => void;
  logOut: () => void;
  user: DtoUser | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  logIn: () => undefined,
  logOut: () => undefined,
  user: undefined,
});

const ACCESS_TOKEN_STORAGE_KEY = 'access-token';

const getAccessTokenFromStorage = () =>
  localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

const useAuthContextProvider = (): AuthContextType => {
  const [accessToken, setAccessToken] = useState<
    AuthContextType['accessToken']
  >(getAccessTokenFromStorage());
  const navigate = useNavigate();

  const logIn = useCallback((newAccessToken: string) => {
    setAccessToken(newAccessToken);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, newAccessToken);
  }, []);

  const logOut = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    navigate('/');
  }, [navigate]);

  const { data } = useSWR<UserMyProfileResponseDto>(
    accessToken ? '/api/users/me' : null,
    getMakeRequestWithAuth(accessToken),
    {
      onError: logOut,
    },
  );

  const user = data?.user;

  return {
    accessToken,
    logIn,
    logOut,
    user,
  };
};

interface AuthContextProviderWrapperProps {
  children: ReactNode;
}
export const AuthContextProviderWrapper = ({
  children,
}: AuthContextProviderWrapperProps) => {
  const authContextValue = useAuthContextProvider();

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
