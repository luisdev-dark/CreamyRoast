import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import POSPage from './pages/POSPage'
import AdminDashboard from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { InventoryProvider } from './context/InventoryContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InventoryProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pos" element={<POSPage />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </Router>
        </InventoryProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App