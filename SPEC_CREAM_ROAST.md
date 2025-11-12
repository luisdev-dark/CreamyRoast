# Documentación Completa: Sistema POS Cream & Roast

**Versión:** 2.0 | **Fecha:** Noviembre 2025  
**Stack Tecnológico:** React + Node.js/Express + PostgreSQL (Supabase)

---

## 📋 Índice

1. [Alcance del Sistema](#alcance)
2. [Arquitectura Técnica](#arquitectura)
3. [Modelo de Datos](#modelo-datos)
4. [Historias de Usuario (Ampliadas)](#historias)
5. [Backlog Priorizado](#backlog)
6. [Escenarios de Aceptación (Gherkin)](#gherkin)
7. [Especificaciones Frontend (React)](#frontend)
8. [Especificaciones Backend (Node.js)](#backend)
9. [Seguridad y Autenticación](#seguridad)
10. [Criterios de Finalización](#dod)

---

<a name="alcance"></a>
## 1. Alcance del Sistema

### Objetivo General
Operar y administrar la cafetería **Cream & Roast** mediante:
- **Backoffice**: Gestión de ventas, productos, inventario, usuarios y reportes
- **POS (Punto de Venta)**: Interfaz rápida para cajeros
- **Landing Pública**: Presentación de la cafetería y menú

### Roles y Permisos

| Rol | Ventas | Productos | Inventario | Usuarios | Reportes |
|-----|--------|-----------|-----------|----------|----------|
| **Cajero** | ✅ Registrar | 👁️ Ver | 👁️ Ver alertas | ❌ | ❌ |
| **Empleado** | ❌ | 👁️ Ver | 👁️ Ver | ❌ | ❌ |
| **Administrador** | ✅ Ver historial | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| **Cliente** | ❌ | 👁️ Ver (Landing) | ❌ | ❌ | ❌ |

### Canales de Acceso
- **Web Backoffice**: `https://admin.creamandroast.pe`
- **Web POS**: `https://pos.creamandroast.pe`
- **Landing Pública**: `https://www.creamandroast.pe`

---

<a name="arquitectura"></a>
## 2. Arquitectura Técnica

### Stack Recomendado

```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                │
│  - React 18+                            │
│  - TypeScript                           │
│  - Context API + useReducer (state)     │
│  - Zustand (opcional para POS)          │
│  - React Router v6                      │
│  - Tailwind CSS / shadcn/ui             │
└─────────────────────────────────────────┘
           ↕ (HTTP REST)
┌─────────────────────────────────────────┐
│       BACKEND (Node.js/Express)         │
│  - Express.js 4.18+                     │
│  - TypeScript                           │
│  - JWT Authentication                   │
│  - Rate Limiting (express-rate-limit)   │
│  - Validación (Zod/Joi)                 │
│  - Thermal Printer (node-thermal-printer) │
│  - PDF Generation (pdfkit/html2pdf)     │
└─────────────────────────────────────────┘
           ↕ (SQL)
┌─────────────────────────────────────────┐
│   DATABASE (PostgreSQL via Supabase)    │
│  - Row Level Security (RLS)             │
│  - Realtime Subscriptions               │
│  - Edge Functions (Deno)                │
│  - Storage para recibos/imágenes        │
└─────────────────────────────────────────┘
```

### Diagrama de Flujo de Autenticación

```
Usuario Ingresa Credenciales
           ↓
Express POST /auth/login
           ↓
Verificar en Supabase Auth
           ↓
Generar JWT con Custom Claims (role)
           ↓
Cliente almacena token (memory)
           ↓
Todas las requests incluyen: Authorization: Bearer {JWT}
           ↓
RLS Policies en BD validan acceso por rol
```

---

<a name="modelo-datos"></a>
## 3. Modelo de Datos (PostgreSQL)

### Tablas Principales

#### **users** (Autenticación - Supabase Auth)
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) NOT NULL, -- 'cajero', 'administrador', 'empleado'
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'bloqueado'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **products** (Menú)
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES product_categories(id),
  price_id UUID REFERENCES product_prices(id), -- Historial de precios
  description TEXT,
  image_url VARCHAR(500),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Bebidas Calientes, Frías, Postres, Snacks
  display_order INT
);

-- Historial de Precios
CREATE TABLE public.product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  price DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **sales** (Ventas)
```sql
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number VARCHAR(20) UNIQUE NOT NULL, -- Número comprobante
  cashier_id UUID NOT NULL REFERENCES user_profiles(id),
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50), -- 'efectivo', 'tarjeta', 'yape'
  payment_reference VARCHAR(100),
  descuento DECIMAL(10,2) DEFAULT 0,
  impuestos DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'completada', -- 'completada', 'cancelada', 'devuelta'
  razon_cancelacion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items de venta
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **inventory** (Inventario)
```sql
CREATE TABLE public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50), -- 'kg', 'L', 'unidad', etc
  stock_actual DECIMAL(10,2) NOT NULL,
  stock_minimo DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mapeo: Producto → Ingredientes (Recetas)
CREATE TABLE public.product_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  ingredient_id UUID REFERENCES ingredients(id),
  cantidad_requerida DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Historial de movimientos
CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID REFERENCES ingredients(id),
  tipo VARCHAR(50), -- 'entrada', 'salida', 'ajuste'
  cantidad DECIMAL(10,2),
  responsable_id UUID REFERENCES user_profiles(id),
  razon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **receipts** (Comprobantes)
```sql
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID UNIQUE REFERENCES sales(id),
  receipt_type VARCHAR(20), -- 'boleta', 'factura'
  receipt_number VARCHAR(20) UNIQUE,
  html_content TEXT,
  pdf_url VARCHAR(500),
  printed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

<a name="historias"></a>
## 4. Historias de Usuario (Ampliadas)

### Fase 1: MVP

#### H1.1: Registrar Venta
**Como** cajero  
**Quiero** registrar una venta completa  
**Para** llevar control de dinero ingresado y generar comprobante

**Criterios:**
- Seleccionar productos del menú (cantidad)
- Aplicar descuentos (si existen)
- Elegir método de pago (efectivo, tarjeta, Yape)
- Generar número de comprobante único
- Actualizar inventario automáticamente
- Imprimir o descargar comprobante (80mm)

#### H1.2: Comprobante Completo
**Como** cliente  
**Quiero** recibir un comprobante detallado  
**Para** tener constancia de mi compra

**Contenido del Comprobante:**
- Logo y nombre "Cream & Roast"
- RUC/NIT
- Fecha y hora
- Número de comprobante
- Detalle de productos (nombre, cantidad, precio unitario)
- Descuentos aplicados
- Subtotal, impuestos (IGV), total
- Método de pago
- Mensaje de agradecimiento

#### H1.3: Autenticación de Empleados
**Como** empleado  
**Quiero** iniciar sesión con credenciales  
**Para** acceder a mis funciones específicas

**Criterios:**
- Email + Contraseña
- JWT con custom claims (role)
- Token almacenado en memory (no localStorage)
- Expiración: 8 horas

### Fase 2: Control de Inventario

#### H2.1: Gestión de Productos
**Como** administrador  
**Quiero** agregar, editar y eliminar productos  
**Para** mantener el menú actualizado

**Crud Operations:**
- Nombre, categoría, precio (con historial)
- Descripción, imagen
- Estado (activo/inactivo)
- Auditoría de cambios

#### H2.2: Registro de Inventario
**Como** administrador  
**Quiero** registrar stock de ingredientes  
**Para** evitar quiebres

**Criterios:**
- Stock inicial y mínimo por ingrediente
- Movimientos: entrada/salida/ajuste
- Responsable y fecha
- Alertas automáticas cuando < stock_minimo

### Fase 3: Administración Avanzada

#### H3.1: Historial de Ventas
**Como** administrador  
**Quiero** consultar ventas por período  
**Para** analizar rendimiento

**Filtros:**
- Por fecha (rango)
- Por cajero
- Por método de pago
- Por producto

#### H3.2: Gestión de Usuarios
**Como** administrador  
**Quiero** crear, bloquear o eliminar cuentas  
**Para** mantener seguridad

#### H3.3: Reportes
**Como** administrador  
**Quiero** exportar reportes en PDF/Excel  
**Para** compartir con gerencia

---

<a name="backlog"></a>
## 5. Backlog Priorizado

### 🔴 Fase 1 – MVP (2-3 semanas)
- [ ] Autenticación (login/logout)
- [ ] Registro de ventas
- [ ] Generación de comprobante (vista previa)
- [ ] Menú de productos
- [ ] Impresión térmica 80mm (ESC/POS)
- [ ] Interface POS basic

### 🟠 Fase 2 – Inventario (2-3 semanas)
- [ ] CRUD productos
- [ ] Registro de ingredientes
- [ ] Alertas de bajo stock
- [ ] Movimientos de inventario
- [ ] Descuentos configurables

### 🟡 Fase 3 – Administración (2-3 semanas)
- [ ] **Cancelación de ventas**
- [ ] **Devoluciones/Reembolsos**
- [ ] **Ajustes por merma**
- [ ] Historial de ventas con filtros
- [ ] Reportes diarios/semanales/mensuales
- [ ] Gestión de usuarios (crear/bloquear)
- [ ] Roles y permisos granulares

### 🟢 Fase 4 – Optimización (1-2 semanas)
- [ ] Reportes avanzados
- [ ] Analítica (top productos, horas pico)
- [ ] Sincronización offline (cache local)
- [ ] Internacionalización (ES/EN)
- [ ] Proveedores (CRUD, órdenes de compra)

### ⚪ Backlog Baja Prioridad (Futuro)
- [ ] Push notifications
- [ ] QR codes dinámicos
- [ ] Integración con delivery (Uber Eats, etc)

---

<a name="gherkin"></a>
## 6. Escenarios de Aceptación (Gherkin)

### Feature: Ventas

```gherkin
Feature: Registro de ventas en Cream & Roast
  Como cajero
  Quiero registrar una venta
  Para llevar control del dinero ingresado

  Background:
    Given el cajero ha iniciado sesión
    And el menú de productos está disponible

  Scenario: Venta exitosa con pago efectivo
    When selecciona "Espresso doble" (cantidad: 1)
    And selecciona "Capuccino" (cantidad: 2)
    And confirma el pago en efectivo por S/ 45.00
    Then el sistema guarda la venta
    And genera comprobante numero "BOL-2024-0001"
    And actualiza inventario de insumos
    And muestra opción para imprimir

  Scenario: Venta con descuento válido
    When selecciona un producto
    And aplica descuento "DESCUENTO10" (10%)
    Then el subtotal disminuye
    And el descuento se registra en auditoría

  Scenario: Cancelación de venta (Fase 3)
    Given una venta fue completada hace 30 minutos
    When el cajero solicita cancelarla
    And proporciona razón "Cliente solicitó"
    Then la venta cambia estado a "cancelada"
    And se reembolsa el dinero
    And se revierte cambios en inventario

  Scenario: Devolución parcial (Fase 3)
    Given una venta completada
    When el cliente devuelve 1 producto de 3
    Then se genera comprobante de devolución
    And se calcula reembolso proporcional
    And se actualizan insumos (retorno a stock)
```

### Feature: Métodos de Pago

```gherkin
Feature: Procesamiento de pagos múltiples
  Como cajero
  Quiero registrar pagos en efectivo, tarjeta y Yape
  Para flexibilidad de clientes

  Scenario: Pago con efectivo
    When selecciona método "Efectivo"
    Then muestra campo para monto recibido
    And calcula cambio automáticamente

  Scenario: Pago con Yape (Integración)
    When selecciona método "Yape"
    And scannea código QR desde aplicativo
    Then envía referencia de transacción a servidor
    And verifica estado del pago
    And registra venta si es aprobado

  Scenario: Pago con Tarjeta (POS físico)
    When selecciona método "Tarjeta"
    Then muestra dispositivo POS disponible
    And espera confirmación del lector
    And registra número de autorización
```

### Feature: Comprobantes

```gherkin
Feature: Generación y impresión de comprobantes
  Como sistema
  Quiero generar comprobantes en formato térmico 80mm
  Para que el cliente tenga constancia

  Scenario: Vista previa antes de imprimir
    Given una venta completada
    When el cajero hace clic en "Previsualizar"
    Then muestra documento A4 con formato 80mm
    And opciones: Imprimir / Descargar PDF

  Scenario: Impresión en impresora térmica
    When hace clic en "Imprimir"
    Then envía formato ESC/POS a impresora
    And espera confirmación de impresión
    And registra "printed_at"

  Scenario: Generación de Factura (Tipo de Comprobante)
    Given cliente solicita factura
    When ingresa RUC/DNI
    Then genera documento de tipo "Factura"
    And incluye información fiscal
    And permite descargar PDF
```

### Feature: Inventario

```gherkin
Feature: Gestión de inventario
  Como administrador
  Quiero registrar y monitorear stock
  Para evitar quiebres

  Scenario: Registrar stock inicial
    When ingresa ingrediente "Café Arábica" con 50 kg
    And define stock mínimo de 10 kg
    Then el sistema guarda con fecha y responsable

  Scenario: Alerta de bajo stock
    Given stock de "Leche" = 2 L (mínimo: 5 L)
    When sistema valida en cada venta
    Then muestra alerta roja en POS
    And notifica al administrador

  Scenario: Movimiento de ajuste por merma (Fase 3)
    When administrador registra "Merma: Café derramado"
    And cantidad: 2 kg
    Then reduce stock automáticamente
    And genera reporte de pérdida
```

### Feature: Reportes

```gherkin
Feature: Generación de reportes
  Como administrador
  Quiero reportes de ventas y inventario
  Para tomar decisiones

  Scenario: Reporte diario PDF
    When solicita reporte del día
    Then muestra total de ingresos
    And cantidad de transacciones
    And productos más vendidos
    And permite descargar en PDF/Excel

  Scenario: Reporte por período
    When selecciona rango de fechas
    And aplica filtro por método de pago
    Then filtra ventas automáticamente
    And exporta resultados
```

---

<a name="frontend"></a>
## 7. Especificaciones Frontend (React)

### Estructura de Carpetas

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── POS/
│   │   ├── ProductGrid.tsx
│   │   ├── Cart.tsx
│   │   ├── PaymentModal.tsx
│   │   └── ReceiptPreview.tsx
│   ├── Admin/
│   │   ├── ProductForm.tsx
│   │   ├── UserManagement.tsx
│   │   ├── InventoryTable.tsx
│   │   └── ReportBuilder.tsx
│   ├── Common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   └── Landing/
│       ├── Hero.tsx
│       ├── Menu.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── POSPage.tsx
│   ├── AdminDashboard.tsx
│   └── LandingPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useSales.ts
│   └── usePrinter.ts
├── context/
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── InventoryContext.tsx
├── services/
│   ├── api.ts (axios instance)
│   ├── authService.ts
│   ├── salesService.ts
│   ├── productsService.ts
│   └── printerService.ts
├── types/
│   ├── index.ts
│   ├── sales.ts
│   ├── products.ts
│   └── users.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
└── App.tsx
```

### Context API - CartContext

```typescript
// context/CartContext.tsx
import React, { createContext, useReducer } from 'react';

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  discount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'APPLY_DISCOUNT'; payload: number }
  | { type: 'CLEAR' };

const initialState: CartState = {
  items: [],
  total: 0,
  discount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const exists = state.items.find(i => i.productId === action.payload.productId);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'APPLY_DISCOUNT':
      return { ...state, discount: action.payload };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
```

### Ejemplo: Hook useCart

```typescript
// hooks/useCart.ts
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  const { state, dispatch } = context;

  return {
    items: state.items,
    total: state.items.reduce((sum, item) => sum + item.subtotal, 0) - state.discount,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (productId: string) =>
      dispatch({ type: 'REMOVE_ITEM', payload: productId }),
    updateQuantity: (productId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    applyDiscount: (amount: number) =>
      dispatch({ type: 'APPLY_DISCOUNT', payload: amount }),
    clear: () => dispatch({ type: 'CLEAR' }),
  };
}
```

### Componente: ReceiptPreview (Formato 80mm)

```typescript
// components/POS/ReceiptPreview.tsx
import React from 'react';
import { useCart } from '../../hooks/useCart';

interface ReceiptPreviewProps {
  receiptNumber: string;
  paymentMethod: string;
  cashierName: string;
}

export function ReceiptPreview({ receiptNumber, paymentMethod, cashierName }: ReceiptPreviewProps) {
  const { items, total } = useCart();
  const now = new Date();

  return (
    <div className="receipt-preview" style={{ width: '80mm', margin: '0 auto' }}>
      <style>{`
        .receipt-preview {
          font-family: 'Courier New', monospace;
          font-size: 10pt;
          line-height: 1.2;
          border: 1px solid #ddd;
          padding: 10px;
        }
        .receipt-header { text-align: center; margin-bottom: 10px; }
        .receipt-header h1 { margin: 0; font-size: 14pt; }
        .receipt-divider { border-top: 1px dashed #000; margin: 5px 0; }
        .receipt-item { display: flex; justify-content: space-between; }
        .receipt-total { font-weight: bold; text-align: right; margin-top: 10px; }
      `}</style>

      <div className="receipt-header">
        <h1>CREAM & ROAST</h1>
        <p>Café de especialidad y momentos reales</p>
        <p>RUC: 20XXXXXXXXX</p>
      </div>

      <div className="receipt-divider"></div>

      <div>
        <p><strong>Boleta: {receiptNumber}</strong></p>
        <p>Fecha: {now.toLocaleDateString()}</p>
        <p>Hora: {now.toLocaleTimeString()}</p>
      </div>

      <div className="receipt-divider"></div>

      <div>
        {items.map((item) => (
          <div key={item.productId} className="receipt-item">
            <span>{item.name} x{item.quantity}</span>
            <span>S/ {(item.subtotal).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="receipt-divider"></div>

      <div className="receipt-total">
        <p>Total: S/ {total.toFixed(2)}</p>
        <p>Pago: {paymentMethod}</p>
      </div>

      <div className="receipt-divider"></div>

      <div style={{ textAlign: 'center', fontSize: '9pt' }}>
        <p>¡Gracias por tu compra!</p>
        <p>Te esperamos pronto</p>
      </div>
    </div>
  );
}
```

---

<a name="backend"></a>
## 8. Especificaciones Backend (Node.js)

### Estructura de Carpetas

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── salesController.ts
│   │   ├── productsController.ts
│   │   ├── inventoryController.ts
│   │   └── reportController.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── sales.ts
│   │   ├── products.ts
│   │   ├── inventory.ts
│   │   └── reports.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── supabaseService.ts
│   │   ├── printerService.ts
│   │   ├── receiptService.ts
│   │   └── paymentService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── validators.ts
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds.ts
│   └── app.ts
├── .env.example
├── package.json
└── tsconfig.json
```

### Archivo: authController.ts

```typescript
// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { supabase } from '../services/supabaseService';

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener rol del perfil de usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, name')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: 'Error obteniendo perfil' });
    }

    // Generar JWT con custom claims
    const token = jwt.sign(
      {
        sub: data.user.id,
        email: data.user.email,
        role: profile.role,
        name: profile.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
        name: profile.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Token simplemente expira (no stateless)
  res.json({ message: 'Logout exitoso' });
};
```

### Archivo: salesController.ts (Registrar Venta)

```typescript
// src/controllers/salesController.ts
import { Request, Response } from 'express';
import { supabase } from '../services/supabaseService';
import { ReceiptService } from '../services/receiptService';
import { PaymentService } from '../services/paymentService';

interface CreateSaleRequest {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: 'efectivo' | 'tarjeta' | 'yape';
  discount: number;
  paymentReference?: string; // Para tarjeta/Yape
}

export const createSale = async (
  req: Request<{}, {}, CreateSaleRequest>,
  res: Response
) => {
  try {
    const cashierId = req.user?.id;
    if (!cashierId) return res.status(401).json({ error: 'No autenticado' });

    const { items, paymentMethod, discount, paymentReference } = req.body;

    // Generar número de comprobante
    const saleNumber = await generateSaleNumber();

    // Calcular totales
    let total = 0;
    const saleItems = [];

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, name, price_id')
        .eq('id', item.productId)
        .single();

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Obtener precio actual
      const { data: priceData } = await supabase
        .from('product_prices')
        .select('price')
        .eq('id', product.price_id)
        .single();

      const unitPrice = priceData?.price || 0;
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    const impuestos = total * 0.18; // IGV 18%
    const totalFinal = total + impuestos - discount;

    // Validar pago según método
    if (paymentMethod === 'yape' && paymentReference) {
      const paymentService = new PaymentService();
      const isValid = await paymentService.verifyYapePayment(paymentReference);
      if (!isValid) {
        return res.status(400).json({ error: 'Pago Yape no válido' });
      }
    }

    // Insertar venta
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert({
        sale_number: saleNumber,
        cashier_id: cashierId,
        total: totalFinal,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        descuento: discount,
        impuestos,
      })
      .select();

    if (saleError) {
      return res.status(500).json({ error: 'Error creando venta' });
    }

    const saleId = saleData[0].id;

    // Insertar items de venta
    for (const item of saleItems) {
      await supabase.from('sale_items').insert({
        sale_id: saleId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      });

      // Actualizar inventario (restar insumos)
      await updateInventoryFromSale(item.productId, item.quantity);
    }

    // Generar comprobante
    const receiptService = new ReceiptService();
    const receipt = await receiptService.generateReceipt(saleId, saleNumber);

    res.json({
      saleId,
      saleNumber,
      total: totalFinal,
      receipt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando venta' });
  }
};

// Cancelar venta (Fase 3)
export const cancelSale = async (req: Request, res: Response) => {
  try {
    const { saleId } = req.params;
    const { razon } = req.body;

    // Obtener venta original
    const { data: sale } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });

    // Actualizar estado a cancelada
    await supabase
      .from('sales')
      .update({
        estado: 'cancelada',
        razon_cancelacion: razon,
      })
      .eq('id', saleId);

    // Revertir inventario
    const { data: saleItems } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);

    for (const item of saleItems || []) {
      await revertInventoryFromSale(item.product_id, item.quantity);
    }

    res.json({ message: 'Venta cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelando venta' });
  }
};

async function generateSaleNumber(): Promise<string> {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const { data } = await supabase
    .from('sales')
    .select('sale_number')
    .like('sale_number', `BOL-${today}%`)
    .order('created_at', { ascending: false })
    .limit(1);

  const number = (data?.length || 0) + 1;
  return `BOL-${today}-${String(number).padStart(4, '0')}`;
}

async function updateInventoryFromSale(productId: string, quantity: number) {
  // Obtener receta del producto
  const { data: recipes } = await supabase
    .from('product_recipes')
    .select('ingredient_id, cantidad_requerida')
    .eq('product_id', productId);

  for (const recipe of recipes || []) {
    const cantidadTotal = (recipe.cantidad_requerida || 0) * quantity;

    // Restar del stock
    const { data: ingredient } = await supabase
      .from('ingredients')
      .select('stock_actual')
      .eq('id', recipe.ingredient_id)
      .single();

    await supabase
      .from('ingredients')
      .update({
        stock_actual: (ingredient?.stock_actual || 0) - cantidadTotal,
      })
      .eq('id', recipe.ingredient_id);

    // Registrar movimiento
    await supabase.from('inventory_movements').insert({
      ingredient_id: recipe.ingredient_id,
      tipo: 'salida',
      cantidad: cantidadTotal,
      razon: `Venta de ${productId}`,
    });
  }
}

async function revertInventoryFromSale(productId: string, quantity: number) {
  // Similar a updateInventoryFromSale pero sumando
  const { data: recipes } = await supabase
    .from('product_recipes')
    .select('ingredient_id, cantidad_requerida')
    .eq('product_id', productId);

  for (const recipe of recipes || []) {
    const cantidadTotal = (recipe.cantidad_requerida || 0) * quantity;

    const { data: ingredient } = await supabase
      .from('ingredients')
      .select('stock_actual')
      .eq('id', recipe.ingredient_id)
      .single();

    await supabase
      .from('ingredients')
      .update({
        stock_actual: (ingredient?.stock_actual || 0) + cantidadTotal,
      })
      .eq('id', recipe.ingredient_id);
  }
}
```

### Middleware: authMiddleware.ts

```typescript
// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### Rate Limiting

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: 'Demasiadas solicitudes, intente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 intentos de login
  skipSuccessfulRequests: true,
  message: 'Demasiados intentos de login',
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requests por minuto
});
```

### Express App Principal

```typescript
// src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import { authenticate, authorize } from './middleware/authMiddleware';
import { authLimiter, generalLimiter, apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import salesRoutes from './routes/sales';
import productsRoutes from './routes/products';
import inventoryRoutes from './routes/inventory';
import reportRoutes from './routes/reports';

const app: Express = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Rutas públicas
app.use('/api/auth', authLimiter, authRoutes);

// Rutas protegidas
app.use('/api/sales', authenticate, apiLimiter, salesRoutes);
app.use('/api/products', authenticate, apiLimiter, productsRoutes);
app.use('/api/inventory', authenticate, apiLimiter, inventoryRoutes);
app.use('/api/reports', authenticate, authorize('administrador'), reportRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

---

<a name="seguridad"></a>
## 9. Seguridad y Autenticación

### Arquitectura JWT + Supabase RLS

```
┌─────────────────────────────────────────┐
│ Usuario Login (React Frontend)          │
│ email + password                        │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Express POST /auth/login                │
│ - Valida en Supabase Auth               │
│ - Lee role de user_profiles             │
│ - Genera JWT con custom claims (role)   │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Cliente React                           │
│ - Almacena JWT en memory                │
│ - Envía en Authorization header         │
│ - Nunca en localStorage                 │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Supabase RLS Policies                   │
│ - Valida rol en JWT                     │
│ - Filtra datos por usuario/rol          │
│ - Rechaza acceso no autorizado          │
└─────────────────────────────────────────┘
```

### RLS Policies Ejemplo

```sql
-- Tabla: sales (solo administrador ve todas, cajero solo suyas)
CREATE POLICY "admin_all_sales" ON sales
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.jwt() ->> 'user_role' = 'administrador'));

CREATE POLICY "cashier_own_sales" ON sales
  FOR SELECT
  TO authenticated
  USING (cashier_id = (SELECT auth.uid()));

-- Tabla: products (todos ven, solo admin edita)
CREATE POLICY "all_read_products" ON products
  FOR SELECT
  TO authenticated
  USING (estado = 'activo');

CREATE POLICY "admin_manage_products" ON products
  FOR ALL
  TO authenticated
  USING ((SELECT auth.jwt() ->> 'user_role' = 'administrador'));
```

### Custom Claims Auth Hook (Supabase)

```sql
-- En Supabase Dashboard → SQL Editor
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  -- Obtener rol del usuario
  SELECT role INTO user_role
  FROM public.user_profiles
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  
  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Registrar hook en Supabase → Auth Hooks
-- Evento: `jwt_gen`
-- Función: `custom_access_token_hook`
```

---

<a name="dod"></a>
## 10. Criterios de Finalización (Definition of Done)

### ✅ Para Cada User Story

- [ ] Todos los escenarios Gherkin pasan QA
- [ ] Código revisado (code review)
- [ ] Tests unitarios ≥ 80% cobertura
- [ ] No hay warnings en consola
- [ ] Documentación actualizada
- [ ] Accesibilidad (WCAG AA)

### ✅ MVP Completo (Fase 1)

- [ ] Login con JWT
- [ ] Venta con múltiples métodos de pago
- [ ] Comprobante generable e imprimible
- [ ] Menú cargable desde BD
- [ ] Respuesta API < 300ms promedio
- [ ] POS funcional (≤ 5 clics hasta comprobante)

### ✅ Fase 2 (Inventario)

- [ ] CRUD productos completo
- [ ] Alertas stock bajo en POS
- [ ] Historial movimientos inventario
- [ ] Descuentos configurables

### ✅ Fase 3 (Administración)

- [ ] Cancelación ventas
- [ ] Devoluciones/reembolsos
- [ ] Reportes PDF/Excel
- [ ] Gestión usuarios y permisos

### ✅ Fase 4 (Optimización)

- [ ] Sincronización offline + cache local
- [ ] Reportes avanzados con gráficos
- [ ] Internacionalización (ES/EN)
- [ ] Velocidad < 2s (landing)

---

## 📚 Referencias y Links Útiles

- **Supabase Docs**: https://supabase.com/docs
- **React 18 Docs**: https://react.dev
- **Express.js**: https://expressjs.com
- **node-thermal-printer**: https://github.com/Klemen1337/node-thermal-printer
- **Gherkin Syntax**: https://cucumber.io/docs/gherkin
- **PostgreSQL RLS**: https://www.postgresql.org/docs/current/sql-createpolicy.html

---

**Versión**: 2.0  
**Última actualización**: Noviembre 2025  
**Autor**: Documentación Cream & Roast  
**Estado**: ✅ Listo para desarrollo
