import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Buscar produtos...", 
  isSearching = false,
  onClear,
  className = ""
}) => {
  const handleClear = () => {
    onChange({ target: { value: '' } });
    if (onClear) onClear();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className={`h-5 w-5 transition-colors duration-200 ${
          isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
        }`} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
      />
      
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Limpar busca"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;