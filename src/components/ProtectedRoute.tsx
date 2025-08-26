import React, { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Authentification requise</h2>
          <button 
            onClick={login}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Vérification des rôles si spécifiés
  if (roles.length > 0) {
    const hasRequiredRole = roles.some(role => 
      user?.resource_access?.["app-test-id"].roles?.includes(role)
    );
    
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Accès refusé</h2>
            <p>Vous n'avez pas les permissions nécessaires.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;