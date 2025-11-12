import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-coffee-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Creamy Roast
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-coffee-200">Inicio</Link>
          <Link to="/pos" className="hover:text-coffee-200">POS</Link>
          <Link to="/admin" className="hover:text-coffee-200">Admin</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar