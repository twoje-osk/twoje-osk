import { createContext, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  organizationName: string;
}

interface AuthContextType {
  accessToken: string | null;
  logIn: (accessToken: string) => void;
  logOut: () => void;
  user: User;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  logIn: () => undefined,
  logOut: () => undefined,
  user: {} as any,
});

const ACCESS_TOKEN_STORAGE_KEY = 'access-token';

const getAccessTokenFromStorage = () =>
  localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

const useAuthContextProvider = (): AuthContextType => {
  const user: User = {
    username: 'Adam Abacki',
    organizationName: 'OSK Adam Nowak',
  };
  const [accessToken, setAccessToken] = useState<
    AuthContextType['accessToken']
  >(getAccessTokenFromStorage());
  const navigate = useNavigate();

  const logIn = (newAccessToken: string) => {
    setAccessToken(newAccessToken);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, newAccessToken);
  };

  const logOut = () => {
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    navigate('/');
  };

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
