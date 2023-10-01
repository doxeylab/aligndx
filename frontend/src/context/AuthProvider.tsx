import React, { useEffect, useState, useCallback, useMemo, createContext, useContext, ReactNode } from 'react';
import { setSession, getToken, ACCESS_STORAGE_KEY, refreshAccessToken, clearToken, isValidToken } from './utils';
import { fetcher, poster, endpoints } from './requests';

type AuthUserType = null | Record<string, any>;

interface AuthInterface {
  user: AuthUserType | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: ({ username, password }: { username: string, password: string }) => Promise<void>;
  signUp: ({ name, email, password }: { name: string, email: string, password: string }) => Promise<void>;
  logout: () => void;
}

interface Props {
  children: ReactNode
}

export const AuthContext = createContext<AuthInterface | null>(null);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setupUser = useCallback(async () => {
    try {
      let accessToken = getToken(ACCESS_STORAGE_KEY);
      
      if (!accessToken || !isValidToken(accessToken)) {
        try {
          accessToken = await refreshAccessToken();
          setSession(ACCESS_STORAGE_KEY, accessToken);
        } catch (error) {
          console.error("Failed to refresh access token: ", error);
          // Optionally, set some state variable or redirect user to login
          return; // Early return to avoid further execution if refresh fails
        }
      }
  
      if (accessToken && isValidToken(accessToken)) {
        const fetchedUser = await fetcher(endpoints.auth.me);
        setUser(fetchedUser);
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Consider any dependencies that might be needed here
  
  useEffect(() => {
    setupUser();
  }, [setupUser]); // Ensure that setupUser does not change too often
  

  const login = useCallback(async ({ username, password }: { username: string, password: string }) => {
    try {
      const data = { username, password };
      const { access_token } = await poster(endpoints.auth.login, data, {withCredentials : true});
      setSession(ACCESS_STORAGE_KEY, access_token);

      const fetchedUser = await fetcher(endpoints.auth.me);
      setUser(fetchedUser);
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  const signUp = useCallback(async ({ name, email, password }: { name: string, email: string, password: string }) => {
    try {
      const data = { name, email, password };
      await poster(endpoints.auth.login, data);
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);


  const logout = useCallback(async () => {
    clearToken(ACCESS_STORAGE_KEY);
    setUser(null);
    await fetcher([endpoints.auth.logout, { withCredentials: true }]);
  }, []);

  const authenticated = !!user && !loading;
  const unauthenticated = !user && !loading;

  const contextValue = useMemo(() => ({
    user,
    loading: loading,
    authenticated: authenticated,
    unauthenticated: unauthenticated,
    login,
    logout,
    signUp,
  }), [user, loading, authenticated, unauthenticated, login, logout, signUp]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
