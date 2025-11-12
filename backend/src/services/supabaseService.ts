// src/services/supabaseService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Crear cliente solo si las variables están configuradas
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Verificar conexión
export const checkConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase no configurado, usando SQLite temporal');
      return false;
    }
    
    if (!supabase) {
      console.log('⚠️  Cliente Supabase no inicializado');
      return false;
    }
    
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.log('⚠️  Error conectando a Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conectado a Supabase');
    return true;
  } catch (err) {
    console.log('⚠️  Supabase no disponible:', err);
    return false;
  }
};

// Productos en Supabase
export const getSupabaseProducts = async () => {
  try {
    if (!supabase) {
      console.log('⚠️  Supabase no configurado, usando SQLite');
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('estado', 'activo');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error obteniendo productos de Supabase:', error);
    return [];
  }
};

export const createSupabaseProduct = async (product: any) => {
  try {
    if (!supabase) {
      console.log('⚠️  Supabase no configurado, usando SQLite');
      return null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creando producto en Supabase:', error);
    throw error;
  }
};

export const updateSupabaseProduct = async (id: string, product: any) => {
  try {
    if (!supabase) {
      console.log('⚠️  Supabase no configurado, usando SQLite');
      return null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error actualizando producto en Supabase:', error);
    throw error;
  }
};

export const deleteSupabaseProduct = async (id: string) => {
  try {
    if (!supabase) {
      console.log('⚠️  Supabase no configurado, usando SQLite');
      return { message: 'Producto eliminado (SQLite)' };
    }
    
    const { error } = await supabase
      .from('products')
      .update({ estado: 'eliminado' })
      .eq('id', id);
    
    if (error) throw error;
    return { message: 'Producto eliminado' };
  } catch (error) {
    console.error('Error eliminando producto en Supabase:', error);
    throw error;
  }
};

export { supabase };