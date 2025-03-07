
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Si le chargement est en cours, afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-carpu-purple border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle est requis, vérifier le rôle de l'utilisateur
  if (requiredRole && profile) {
    const userHasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(profile.role)
      : profile.role === requiredRole;
    
    if (!userHasRequiredRole) {
      // Rediriger vers la page d'accueil si le rôle n'est pas autorisé
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
