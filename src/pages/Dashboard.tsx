// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const api = apiService;
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/auth/user');
        setData(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations utilisateur */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations utilisateur</h2>
          <div className="space-y-2">
            <p><strong>Nom d'utilisateur:</strong> {user?.preferred_username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nom:</strong> {user?.name}</p>
            <p><strong>Rôles:</strong> {user?.realm_access?.roles?.filter((role: string) => 
              !['default-roles-realm', 'offline_access', 'uma_authorization'].includes(role)
            ).join(', ')}</p>
          </div>
        </div>

        {/* Données de l'API */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Données de l'API</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : data ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </div>

        {/* Section admin */}
        {hasRole('admin') && (
          <div className="bg-yellow-50 p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Section Administrateur</h2>
            <p>Vous avez accès aux fonctionnalités d'administration.</p>
            <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
              Gérer les utilisateurs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;