import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';
import { User } from '../types/users';

// Re-exportar el tipo User para compatibilidad
export type { User } from '../types/users';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  changePassword: (passwordData: any) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthHook();

  // Adaptar la función de login para mantener compatibilidad con el código existente
  const login = async (username: string, password: string): Promise<void> => {
    await auth.login({ username, password });
  };

  const value: AuthContextType = {
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    error: auth.error,
    login,
    logout: auth.logout,
    register: auth.register,
    updateProfile: auth.updateProfile,
    changePassword: auth.changePassword,
    clearError: auth.clearError,
    refreshUser: auth.refreshUser,
    hasRole: auth.hasRole,
    hasAnyRole: auth.hasAnyRole,
    isAuthenticated: auth.isAuthenticated,
  };

  // Bloquear la navegación hacia atrás después de autenticarse
  useEffect(() => {
    if (auth.isAuthenticated) {
      // Importar y usar la utilidad para prevenir navegación hacia atrás
      import('../utils/navigationUtils').then(({ preventBackNavigation }) => {
        preventBackNavigation();
      });
    }
  }, [auth.isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};