import { api, setAuthToken, clearAuth } from './api';
import {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  ChangePasswordData,
  UserFilters,
  LoginResponse,
  RegisterResponse,
  UserListResponse,
  UserResponse,
  PasswordChangeResponse,
} from '../types/users';

export const authService = {
  // Login de usuario
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.success && response.data) {
        // Guardar token en localStorage
        setAuthToken(response.data.token);
        
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Registro de nuevo usuario
  register: async (userData: RegisterData): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      
      if (response.success && response.data) {
        // Guardar token en localStorage
        setAuthToken(response.data.token);
        
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Obtener perfil del usuario actual
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<UserResponse>('/auth/profile');
      
      if (response.success && response.data) {
        // Actualizar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al obtener perfil');
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put<UserResponse>('/auth/profile', userData);
      
      if (response.success && response.data) {
        // Actualizar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      const response = await api.post<PasswordChangeResponse>('/auth/change-password', passwordData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout: (): void => {
    clearAuth();
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr) as User;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  // Obtener token actual
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Refrescar token (si el backend lo soporta)
  refreshToken: async (): Promise<string> => {
    try {
      const response = await api.post<{ success: boolean; data: { token: string }; message: string }>('/auth/refresh');
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        return response.data.token;
      } else {
        throw new Error(response.message || 'Error al refrescar token');
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      throw error;
    }
  },
};

// Servicio de administración de usuarios (solo para admins)
export const userService = {
  // Listar todos los usuarios
  getUsers: async (filters?: UserFilters): Promise<{ users: User[]; total: number }> => {
    try {
      const response = await api.get<UserListResponse>('/users', filters);
      
      if (response.success && response.data) {
        return {
          users: response.data.users,
          total: response.data.total,
        };
      } else {
        throw new Error(response.message || 'Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario específico
  getUser: async (userId: number): Promise<User> => {
    try {
      const response = await api.get<UserResponse>(`/users/${userId}`);
      
      if (response.success && response.data) {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al obtener usuario');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario (admin)
  createUser: async (userData: RegisterData): Promise<User> => {
    try {
      const response = await api.post<UserResponse>('/users', userData);
      
      if (response.success && response.data) {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario (admin)
  updateUser: async (userId: number, userData: UpdateUserData): Promise<User> => {
    try {
      const response = await api.put<UserResponse>(`/users/${userId}`, userData);
      
      if (response.success && response.data) {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario (admin)
  deleteUser: async (userId: number): Promise<void> => {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  // Activar/desactivar usuario
  toggleUserStatus: async (userId: number, isActive: boolean): Promise<User> => {
    try {
      const response = await api.patch<UserResponse>(`/users/${userId}/status`, { isActive });
      
      if (response.success && response.data) {
        return response.data.user;
      } else {
        throw new Error(response.message || 'Error al cambiar estado del usuario');
      }
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      throw error;
    }
  },
};

export default authService;