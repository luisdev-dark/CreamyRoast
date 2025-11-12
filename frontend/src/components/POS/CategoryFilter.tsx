import React from 'react';
import { Category } from '../../types/products';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  loading?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {/* Botón "Todos" */}
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? 'bg-coffee-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todos
      </button>

      {/* Categorías */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            selectedCategory === category.id
              ? 'bg-coffee-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            backgroundColor: selectedCategory === category.id ? undefined : category.color || undefined,
            color: selectedCategory === category.id ? undefined : category.color ? 'white' : undefined,
          }}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;