// src/contexts/AuthContext.ts
import { createContext } from 'react';
import type { KeycloakTokenParsed } from 'keycloak-js';

export interface AuthContextType {
  isAuthenticated: boolean | undefined;
  user: KeycloakTokenParsed | undefined;
  login: () => void;
  logout: () => void;
  token: string | undefined;
  loading: boolean;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
