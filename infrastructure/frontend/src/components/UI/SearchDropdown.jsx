import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';

const SearchDropdown = ({ 
  placeholder = "Buscar produtos...", 
  className = "",
  onClose 
}) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const {
    searchTerm,
    suggestions,
    isOpen,
    loading,
    isSearching,
    handleSearchChange,
    closeSuggestions,
    clearSearch
  } = useSearchSuggestions();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        closeSuggestions();
        if (onClose) onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSuggestions, onClose]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      closeSuggestions();
      if (onClose) onClose();
    }
  };
  
  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.CODPROD}`);
    clearSearch();
    if (onClose) onClose();
  };
  
  const handleInputChange = (e) => {
    handleSearchChange(e.target.value);
  };
  
  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };
  
  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900">
          {part}
        </mark>
      ) : part
    );
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-sm"
          autoComplete="off"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={14} />
            </button>
          )}
          
          <button
            type="submit"
            className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            {isSearching ? (
              <FiLoader size={14} className="animate-spin" />
            ) : (
              <FiSearch size={14} />
            )}
          </button>
        </div>
      </form>
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {loading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FiLoader className="animate-spin mx-auto mb-2" size={20} />
              Carregando sugestões...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs text-gray-600">
                  {suggestions.length} produto{suggestions.length !== 1 ? 's' : ''} encontrado{suggestions.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="py-2">
                {suggestions.map((product) => (
                  <button
                    key={product.CODPROD}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        {product.IMAGEM ? (
                          <img 
                            src={product.IMAGEM} 
                            alt={product.PRODUTO}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <FiSearch className="text-gray-400" size={20} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-black">
                          {highlightText(product.PRODUTO || product.NOME, searchTerm)}
                        </p>
                        {product.DESCRICAO && (
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {highlightText(product.DESCRICAO, searchTerm)}
                          </p>
                        )}
                        {product.PRECO && (
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            {formatPrice(product.PRECO)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <FiSearch className="text-gray-400 group-hover:text-black transition-colors" size={16} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={handleSubmit}
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors text-center"
                >
                  Ver todos os resultados para "{searchTerm}"
                </button>
              </div>
            </>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <FiSearch className="mx-auto mb-2" size={24} />
              <p className="text-sm">Nenhum produto encontrado</p>
              <p className="text-xs mt-1">Tente usar termos diferentes</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;