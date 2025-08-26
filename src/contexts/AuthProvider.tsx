// src/contexts/AuthProvider.tsx
import React, { useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import { KeycloakService } from '../services/KeycloakService';
import type { KeycloakTokenParsed } from 'keycloak-js';

const _kc = new KeycloakService();

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(false);
  const [user, setUser] = useState<KeycloakTokenParsed>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await _kc.init();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setUser(_kc.getUserInfo());
          console.log(_kc.getUserInfo());
        }
      } catch (error) {
        console.error("Erreur d'initialisation de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => _kc.login();
  const logout = () => {
    _kc.logout();
    setIsAuthenticated(false);
    setUser(undefined);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    token: _kc.getToken(),
    loading,
    hasRole: (role: string) => _kc.hasRole(role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
