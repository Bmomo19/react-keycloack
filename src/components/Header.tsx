import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, user, login, logout, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mon Application</h1>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span>Bonjour, {user?.preferred_username || user?.name}</span>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <button 
              onClick={login}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;