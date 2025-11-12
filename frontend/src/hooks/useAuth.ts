import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  LoginCredentials,
  AuthState,
  RegisterData,
  UpdateUserData,
  ChangePasswordData,
} from '../types/users';

// Hook personalizado para manejar la autenticación
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });

  // Cargar datos de autenticación desde localStorage al iniciar
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const user = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (user && token) {
          setState(prev => ({
            ...prev,
            user,
            token,
          }));
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        // Limpiar datos corruptos
        authService.logout();
      }
    };

    loadAuthData();
  }, []);

  // Función para iniciar sesión
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authService.login(credentials);
      
      setState({
        user: result.user,
        token: result.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Función para cerrar sesión
  const logout = useCallback((): void => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Función para registrar un nuevo usuario
  const register = useCallback(async (userData: RegisterData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await authService.register(userData);
      
      setState({
        user: result.user,
        token: result.token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar usuario';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Función para actualizar el perfil del usuario
  const updateProfile = useCallback(async (userData: UpdateUserData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Función para cambiar la contraseña
  const changePassword = useCallback(async (passwordData: ChangePasswordData): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await authService.changePassword(passwordData);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Función para limpiar el error actual
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Función para refrescar los datos del usuario
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!state.token || !state.user) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedUser = await authService.getProfile();
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar datos del usuario';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      // Si el error es de autenticación, cerrar sesión
      if (error.statusCode === 401) {
        logout();
      }
    }
  }, [state.token, state.user, logout]);

  // Verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role: string): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  // Verificar si el usuario tiene al menos uno de los roles especificados
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!state.user?.role) return false;
    return roles.includes(state.user.role);
  }, [state.user]);

  // Verificar si el usuario está autenticado
  const isAuthenticated = useCallback((): boolean => {
    return !!(state.user && state.token);
  }, [state.user, state.token]);

  return {
    // Estado
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: isAuthenticated(),
    
    // Funciones
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    clearError,
    refreshUser,
    hasRole,
    hasAnyRole,
  };
};

export default useAuth;