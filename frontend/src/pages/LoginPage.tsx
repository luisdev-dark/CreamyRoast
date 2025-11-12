import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { login, error, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta a la que el usuario intentaba acceder
  const from = location.state?.from?.pathname || '/';

  // Cargar credenciales guardadas si están disponibles
  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username');
    const savedPassword = localStorage.getItem('remembered_password');
    const savedRememberMe = localStorage.getItem('remember_me') === 'true';
    
    if (savedRememberMe && savedUsername) {
      setUsername(savedUsername);
      setRememberMe(savedRememberMe);
      if (savedPassword) {
        setPassword(atob(savedPassword)); // Decodificar contraseña
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      await login(username, password);
      
      // Guardar credenciales si se marcó "Recordarme"
      if (rememberMe) {
        localStorage.setItem('remembered_username', username);
        localStorage.setItem('remembered_password', btoa(password)); // Codificar contraseña
        localStorage.setItem('remember_me', 'true');
      } else {
        // Limpiar credenciales guardadas si no se marcó recordarme
        localStorage.removeItem('remembered_username');
        localStorage.removeItem('remembered_password');
        localStorage.removeItem('remember_me');
      }
      
      // Bloquear la navegación hacia atrás después de la autenticación
      import('../utils/navigationUtils').then(({ preventBackNavigation }) => {
        preventBackNavigation();
      });
      
      // Redirigir a la página que el usuario intentaba acceder o al dashboard
      navigate(from, { replace: true });
    } catch (error) {
      // El error ya está manejado en el contexto
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-100 via-coffee-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-coffee-600 to-amber-60 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">CR</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-coffee-800">Creamy Roast</h1>
          <p className="mt-2 text-coffee-600">Sistema de Gestión de Cafetería</p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-coffee-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-90 mb-2">Bienvenido de vuelta</h2>
            <p className="text-gray-600">Inicia sesión en tu cuenta</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico o usuario
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 bg-white focus:bg-white text-gray-900"
                    placeholder="Ingresa tu correo o usuario"
                    required
                    disabled={authLoading}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            
             <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                 Contraseña
               </label>
               <div className="relative">
                 <input
                   id="password"
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full p-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 bg-white focus:bg-white text-gray-900"
                   placeholder="Ingresa tu contraseña"
                   required
                   disabled={authLoading}
                 />
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
               </div>
             </div>
           </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-coffee-600 hover:text-coffee-800 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-coffee-600 to-amber-600 text-white py-3 px-4 rounded-xl hover:from-coffee-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Iniciar Sesión
                </div>
              )}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-8 p-4 bg-coffee-50 rounded-xl border border-coffee-100">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-coffee-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-medium text-coffee-700">Credenciales de prueba:</p>
            </div>
            <div className="text-xs text-coffee-600 space-y-1">
              <p className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">admin@creamroast.com / admin123</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Cajero:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">cashier / cashier123</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Empleado:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">waiter / waiter123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Creamy Roast. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;