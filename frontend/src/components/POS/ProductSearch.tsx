import React, { useState, useCallback, useRef } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onSearch, 
  onClear, 
  loading = false, 
  placeholder = "Buscar productos...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef<any>(null);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    // Limpiar timeout anterior
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Si la búsqueda está vacía, limpiar resultados inmediatamente
    if (!searchQuery.trim()) {
      onClear();
      return;
    }

    // Esperar 300ms después de que el usuario deje de escribir
    searchTimeout.current = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }, 300);
  }, [onSearch, onClear]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  }, [onClear]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      // Limpiar timeout y buscar inmediatamente
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-10 pr-10 py-2 border rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors ${
            isFocused ? 'border-coffee-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;