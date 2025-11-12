import React from 'react'

const LandingPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-coffee-800 mb-4">
        Bienvenido a Creamy Roast
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Sistema de punto de venta para cafeterías
      </p>
      <div className="space-x-4">
        <a href="/pos" className="bg-coffee-600 text-white px-6 py-3 rounded-lg hover:bg-coffee-700">
          Abrir POS
        </a>
      </div>
    </div>
  )
}

export default LandingPage