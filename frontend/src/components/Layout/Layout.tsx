import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/' || location.pathname === '/login'
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <Navbar />}
      <main className={`container mx-auto px-4 py-8 ${isLoginPage ? 'flex items-center justify-center min-h-screen' : ''}`}>
        {children || <Outlet />}
      </main>
    </div>
  )
}

export default Layout