// Tipos para usuarios y autenticación

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  WAITER = 'waiter',
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

// Estado de autenticación para el contexto
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Acciones del contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (userData: UpdateUserData) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  clearError: () => void;
}

// Respuestas del backend
export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number;
  };
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: number;
  };
  message: string;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
  message: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}