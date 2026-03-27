import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, setAuthToken, setLogoutCallback } from '../services/api';

const TOKEN_KEY = 'goa_admin_jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    }
  }, [token]);

  // Set up global logout callback for 401 errors
  useEffect(() => {
    const handleLogout = () => {
      setTokenState(null);
      setUser(null);
      // Redirect will be handled by AdminLayout
    };
    
    setLogoutCallback(handleLogout);
    
    return () => {
      setLogoutCallback(null);
    };
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const response = await loginApi(emailOrUsername, password);
      const newToken = response.data?.data?.token ?? response.data?.token;
      if (!newToken) {
        throw new Error('Invalid login response');
      }
      // Set token immediately in API headers before updating state
      setAuthToken(newToken);
      // Then update state (which will also persist to localStorage via useEffect)
      setTokenState(newToken);
      setUser({ email: emailOrUsername });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
