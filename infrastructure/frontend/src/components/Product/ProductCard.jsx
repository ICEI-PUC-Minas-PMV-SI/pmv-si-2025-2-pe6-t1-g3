import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const hasDiscount = product.DESCONTO && product.DESCONTO > 0;
  const discountedPrice = hasDiscount ? product.VALOR - (product.VALOR * product.DESCONTO / 100) : product.VALOR;

  return (
    <Link to={`/product/${product.CODPROD}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group-hover:scale-105">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100 rounded-lg mb-4">
          <img
            src={product.IMAGEM || '/api/placeholder/300/300'}
            alt={product.PRODUTO}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/api/placeholder/300/300';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.PRODUTO}
          </h3>
          
          {product.DESCRICAO && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.DESCRICAO}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.VALOR)}
                </span>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  -{product.DESCONTO}%
                </span>
              </>
            )}
          </div>

          {/* Stock indicator */}
          {product.ESTOQUE !== undefined && (
            <div className="text-xs text-gray-500">
              {product.ESTOQUE > 0 ? (
                <span className="text-green-600">Em estoque</span>
              ) : (
                <span className="text-red-600">Fora de estoque</span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;