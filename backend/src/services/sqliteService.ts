// src/services/sqliteService.ts
import Database from 'better-sqlite3';

const db: any = new Database(process.env.DATABASE_FILE || './cream_roast.db');

// Inicializar tablas completas según el esquema SQL
export const initializeDatabase = () => {
  // Tabla de perfiles de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('cajero', 'administrador', 'empleado')),
      estado TEXT DEFAULT 'activo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de categorías de productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de historial de precios
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_prices (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      price REAL NOT NULL,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_until DATETIME,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT,
      price_id TEXT,
      description TEXT,
      image_url TEXT,
      estado TEXT DEFAULT 'activo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de ventas
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      sale_number TEXT UNIQUE NOT NULL,
      cashier_id TEXT NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT CHECK (payment_method IN ('efectivo', 'tarjeta', 'yape')),
      payment_reference TEXT,
      descuento REAL DEFAULT 0,
      impuestos REAL DEFAULT 0,
      estado TEXT DEFAULT 'completada' CHECK (estado IN ('completada', 'cancelada', 'devuelta')),
      razon_cancelacion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de items de venta
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      product_id TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de ingredientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      unit TEXT,
      stock_actual REAL NOT NULL DEFAULT 0,
      stock_minimo REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de recetas de productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_recipes (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      ingredient_id TEXT,
      cantidad_requerida REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de movimientos de inventario
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory_movements (
      id TEXT PRIMARY KEY,
      ingredient_id TEXT,
      tipo TEXT CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
      cantidad REAL,
      responsable_id TEXT,
      razon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tabla de recibos
  db.exec(`
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      sale_id TEXT UNIQUE,
      receipt_type TEXT DEFAULT 'boleta',
      receipt_number TEXT UNIQUE,
      html_content TEXT,
      pdf_url TEXT,
      printed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Base de datos SQLite inicializada con esquema completo');
};

// =============================================================================
// FUNCIONES PARA PERFILES DE USUARIOS
// =============================================================================
export const getUserProfiles = () => {
  const stmt = db.prepare('SELECT * FROM user_profiles ORDER BY created_at DESC');
  return stmt.all();
};

export const createUserProfile = (user: any) => {
  const stmt = db.prepare(`
    INSERT INTO user_profiles (id, name, email, role, estado)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.id,
    user.name,
    user.email,
    user.role || 'cajero',
    user.estado || 'activo'
  );
  return user;
};

// =============================================================================
// FUNCIONES PARA CATEGORÍAS DE PRODUCTOS
// =============================================================================
export const getProductCategories = () => {
  const stmt = db.prepare('SELECT * FROM product_categories ORDER BY display_order ASC');
  return stmt.all();
};

export const createProductCategory = (category: any) => {
  const stmt = db.prepare(`
    INSERT INTO product_categories (id, name, display_order)
    VALUES (?, ?, ?)
  `);
  stmt.run(
    category.id,
    category.name,
    category.display_order || 0
  );
  return category;
};

// =============================================================================
// FUNCIONES PARA PRODUCTOS (con categorías)
// =============================================================================
export const getProducts = () => {
  const stmt = db.prepare(`
    SELECT p.*, c.name as category_name, pp.price as current_price
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN product_prices pp ON p.price_id = pp.id
    WHERE p.estado = 'activo'
    ORDER BY p.created_at DESC
  `);
  return stmt.all();
};

export const getProductsWithDetails = () => {
  const stmt = db.prepare(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.image_url,
      p.estado,
      p.created_at,
      p.updated_at,
      c.name as category_name,
      c.display_order as category_order,
      pp.price as current_price,
      pp.valid_from as price_valid_from
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN product_prices pp ON p.price_id = pp.id AND (pp.valid_until IS NULL OR pp.valid_until > CURRENT_TIMESTAMP)
    WHERE p.estado = 'activo'
    ORDER BY c.display_order ASC, p.name ASC
  `);
  return stmt.all();
};

export const createProduct = (product: any) => {
  // Primero crear la categoría si no existe
  if (product.category_name && !product.category_id) {
    const categoryId = `cat-${Date.now()}`;
    createProductCategory({
      id: categoryId,
      name: product.category_name,
      display_order: 0
    });
    product.category_id = categoryId;
  }

  // Crear el producto
  const stmt = db.prepare(`
    INSERT INTO products (id, name, category_id, description, image_url, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    product.id,
    product.name,
    product.category_id || null,
    product.description || null,
    product.image_url || null,
    product.estado || 'activo'
  );
  return product;
};

export const updateProduct = (id: string, product: any) => {
  const stmt = db.prepare(`
    UPDATE products SET 
      name = ?, category_id = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(
    product.name,
    product.category_id || null,
    product.description || null,
    product.image_url || null,
    id
  );
  return { id, ...product };
};

export const deleteProduct = (id: string) => {
  const stmt = db.prepare(`UPDATE products SET estado = 'inactivo', updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  stmt.run(id);
  return { message: 'Producto eliminado' };
};

// =============================================================================
// FUNCIONES PARA VENTAS
// =============================================================================
export const getSales = () => {
  const stmt = db.prepare(`
    SELECT s.*, up.name as cashier_name
    FROM sales s
    LEFT JOIN user_profiles up ON s.cashier_id = up.id
    ORDER BY s.created_at DESC
  `);
  return stmt.all();
};

export const getSalesWithDetails = () => {
  const stmt = db.prepare(`
    SELECT 
      s.id,
      s.sale_number,
      s.total,
      s.payment_method,
      s.descuento,
      s.impuestos,
      s.estado,
      s.razon_cancelacion,
      s.created_at,
      s.updated_at,
      up.name as cashier_name,
      up.email as cashier_email,
      COUNT(si.id) as total_items
    FROM sales s
    LEFT JOIN user_profiles up ON s.cashier_id = up.id
    LEFT JOIN sale_items si ON s.id = si.sale_id
    GROUP BY s.id, up.name, up.email
    ORDER BY s.created_at DESC
  `);
  return stmt.all();
};

export const createSale = (sale: any) => {
  // Generar número de venta si no existe
  if (!sale.sale_number) {
    const currentDate = new Date();
    const dateStr = currentDate.toISOString().split('T')[0]?.replace(/-/g, '') || '';
    const timestamp = String(Date.now()).slice(-4);
    sale.sale_number = `BOL-${dateStr}-${timestamp}`;
  }

  const stmt = db.prepare(`
    INSERT INTO sales (
      id, sale_number, cashier_id, total, payment_method, payment_reference,
      descuento, impuestos, estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    sale.id,
    sale.sale_number,
    sale.cashier_id || null,
    sale.total,
    sale.payment_method || null,
    sale.payment_reference || null,
    sale.descuento || 0,
    sale.impuestos || 0,
    sale.estado || 'completada'
  );
  return sale;
};

export const cancelSale = (id: string, razon?: string) => {
  const stmt = db.prepare(`
    UPDATE sales SET 
      estado = 'cancelada', 
      razon_cancelacion = ?,
      updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  stmt.run(razon || 'Cancelado por el usuario', id);
  return { message: 'Venta cancelada' };
};

// =============================================================================
// FUNCIONES PARA ITEMS DE VENTA
// =============================================================================
export const getSaleItems = (saleId: string) => {
  const stmt = db.prepare(`
    SELECT si.*, p.name as product_name
    FROM sale_items si
    LEFT JOIN products p ON si.product_id = p.id
    WHERE si.sale_id = ?
  `);
  return stmt.all();
};

export const createSaleItem = (item: any) => {
  const stmt = db.prepare(`
    INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.sale_id,
    item.product_id || null,
    item.quantity,
    item.unit_price,
    item.subtotal
  );
  return item;
};

export default db;