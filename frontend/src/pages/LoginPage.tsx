import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const { login, error, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta a la que el usuario intentaba acceder
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      await login(username, password);
      // Redirigir a la página que el usuario intentaba acceder o al dashboard
      navigate(from, { replace: true });
    } catch (error) {
      // El error ya está manejado en el contexto
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo o título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-800 mb-2">Creamy Roast</h1>
          <p className="text-coffee-600">Sistema de Gestión de Cafetería</p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu nombre de usuario"
                required
                disabled={authLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu contraseña"
                required
                disabled={authLoading}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-coffee-600 text-white py-3 px-4 rounded-lg hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {authLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">Credenciales de prueba:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Cajero:</strong> cashier / cashier123</p>
              <p><strong>Mesero:</strong> waiter / waiter123</p>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            ¿Olvidaste tu contraseña? Contacta al administrador
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;