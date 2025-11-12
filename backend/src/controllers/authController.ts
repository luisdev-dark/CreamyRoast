import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import { supabase } from '../services/supabaseService';

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // TODO: Implementar autenticación con Supabase
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    // Mock de autenticación por ahora
    let mockUser = null;
    
    if (email === 'admin@creamroast.com' && password === 'admin123') {
      mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: email,
        role: 'administrador',
        name: 'Administrador',
      };
    } else if (email === 'cashier' && password === 'cashier123') {
      mockUser = {
        id: '456e7890-e89b-12d3-a456-426614174001',
        email: 'cashier@creamroast.com',
        role: 'cajero',
        name: 'Cajero',
      };
    } else if (email === 'waiter' && password === 'waiter123') {
      mockUser = {
        id: '789e0123-e89b-12d3-a456-426614174002',
        email: 'waiter@creamroast.com',
        role: 'empleado',
        name: 'Empleado',
      };
    }

    if (mockUser) {
      const token = jwt.sign(
        {
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name,
        },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '8h' }
      );

      res.json({
        token,
        user: mockUser,
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Token simplemente expira (no stateless)
  res.json({ message: 'Logout exitoso' });
};