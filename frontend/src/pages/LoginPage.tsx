import React from 'react'

const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="admin@creamyroast.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="admin123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-coffee-600 text-white py-3 rounded-lg hover:bg-coffee-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Usa admin@creamyroast.com / admin123 para probar
        </p>
      </div>
    </div>
  )
}

export default LoginPage