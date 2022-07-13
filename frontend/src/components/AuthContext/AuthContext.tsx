import {
  DtoUser,
  JwtPayload,
  UserMyProfileResponseDto,
  UserRole,
} from '@osk/shared';
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getMakeRequestWithAuth } from './AuthContext.utils';

interface AuthContextType {
  accessToken: string | null;
  logIn: (accessToken: string) => void;
  logOut: () => void;
  user: DtoUser | undefined;
  role: UserRole | null;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  logIn: () => undefined,
  logOut: () => undefined,
  user: undefined,
  role: null,
});

const ACCESS_TOKEN_STORAGE_KEY = 'access-token';

const getAccessTokenFromStorage = () =>
  localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

const useAuthContextProvider = (): AuthContextType => {
  const [accessToken, setAccessToken] = useState<
    AuthContextType['accessToken']
  >(getAccessTokenFromStorage());

  const role = useMemo(() => {
    if (accessToken === null) {
      return null;
    }

    const [, base64Data] = accessToken.split('.');

    if (base64Data === undefined) {
      return null;
    }

    const data: JwtPayload = JSON.parse(window.atob(base64Data));

    return data.role;
  }, [accessToken]);

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
    role,
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
