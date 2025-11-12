import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Interfaz para respuestas de error estándar
interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Interfaz para respuestas exitosas estándar
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// Clase para manejar errores de API personalizados
export class ApiException extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Crear instancia de axios con configuración base
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación a cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Si la respuesta tiene éxito, retornar los datos
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const { status, data } = error.response;
      
      // Manejar errores de autenticación
      if (status === 401) {
        // Token inválido o expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir al login si no estamos ya en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Manejar errores de servidor
      if (status === 500) {
        console.error('Error del servidor:', data?.message || 'Error interno del servidor');
      }
      
      // Crear y lanzar error personalizado
      const apiError = new ApiException(
        data?.message || 'Error en la petición',
        status,
        data?.code,
        data?.details
      );
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      const networkError = new ApiException(
        'No se pudo conectar con el servidor. Por favor, verifica tu conexión.',
        0,
        'NETWORK_ERROR'
      );
      return Promise.reject(networkError);
    } else {
      // Algo pasó al configurar la petición
      const configError = new ApiException(
        'Error al configurar la petición',
        0,
        'CONFIG_ERROR'
      );
      return Promise.reject(configError);
    }
  }
);

// Funciones auxiliares para hacer peticiones HTTP
export const api = {
  // GET request
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  },
};

// Función para limpiar la autenticación
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Función para establecer el token manualmente (útil después del login)
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Función para obtener el token actual
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export default apiClient;