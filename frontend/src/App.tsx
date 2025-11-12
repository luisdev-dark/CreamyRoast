import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { InventoryProvider } from './context/InventoryContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { UserRole } from './types/users';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <InventoryProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pos" element={
                  <ProtectedRoute>
                    <POSPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/landing" element={<LandingPage />} />
              </Routes>
            </Layout>
          </Router>
        </InventoryProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;