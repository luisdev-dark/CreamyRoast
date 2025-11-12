import { LoginCredentials, RegisterData, AuthResponse, UpdateUserData, ChangePasswordData } from '../types/users';
import api from './api';

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // Guardar token y usuario en localStorage
      const { token, user } = response.data;
      this.setToken(token);
      this.setUser(user);
      
      return { user, token, expiresIn: 8 * 60 * 60 }; // 8 horas en segundos
    } catch (error: any) {
      console.log('Error completo en authService:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
        throw new Error(error.response.data.error || 'Error de autenticación');
      } else if (error.request) {
        throw new Error('Error de red: No se pudo conectar al servidor');
      } else {
        throw new Error('Error desconocido al iniciar sesión');
      }
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    // Eliminar token de la instancia de API
    delete api.defaults.headers.common['Authorization'];
  }

  // Registro
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      const { token, user } = response.data;
      this.setToken(token);
      this.setUser(user);
      
      return { user, token, expiresIn: 8 * 60 };
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Error al registrar usuario');
      } else if (error.request) {
        throw new Error('Error de red: No se pudo conectar al servidor');
      } else {
        throw new Error('Error desconocido al registrar usuario');
      }
    }
  }

  // Actualizar perfil
  async updateProfile(userData: UpdateUserData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.put('/api/auth/profile', userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar datos locales
      const updatedUser = response.data.user;
      this.setUser(updatedUser);

      return updatedUser;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      throw new Error(error.response?.data?.error || 'Error al actualizar perfil');
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      await api.post('/api/auth/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      throw new Error(error.response?.data?.error || 'Error al cambiar contraseña');
    }
  }

  // Obtener perfil
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar datos locales
      const user = response.data.user;
      this.setUser(user);

      return user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      throw new Error(error.response?.data?.error || 'Error al obtener perfil');
    }
  }

  // Verificar si hay token válido
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Verificar si el token ha expirado
    try {
      // En una implementación real, podrías decodificar el JWT para verificar la expiración
      // Por ahora, simplemente verificamos si existe
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Establecer token
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    // Configurar token en la instancia de API
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Obtener usuario actual
  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al parsear el usuario almacenado:', error);
      return null;
    }
  }

  // Establecer usuario
  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Bloquear navegación hacia atrás después de autenticarse
  setupBackNavigationProtection(): void {
    // Esta función puede ser llamada después de la autenticación exitosa
    // para prevenir que el usuario regrese a la página de login con el botón de atrás
    if (this.isAuthenticated()) {
      // Importar la utilidad para prevenir navegación hacia atrás
      import('../utils/navigationUtils').then(({ preventBackNavigation }) => {
        preventBackNavigation();
      });
    }
  }
}

export const authService = new AuthService();
export default authService;