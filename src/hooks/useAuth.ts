// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
