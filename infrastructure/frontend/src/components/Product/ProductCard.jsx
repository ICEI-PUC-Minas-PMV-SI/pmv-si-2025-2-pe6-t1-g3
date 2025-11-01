import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import StarRating from '../UI/StarRating';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(item => item.CODPROD === product.CODPROD);
  });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const price = Number(product.VALOR) || 0;
  const discount = Number(product.DESCONTO) || 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price - (price * discount / 100) : price;

  const categoryLabel = {
    'FASHION': 'Fashion',
    'ELETRÔNICOS': 'Eletrônicos',
    'CASA': 'Casa',
    'ESPORTES': 'Esportes'
  }[product.CATEGORIAS?.CATEGORIA] || '';

  if (imageError) {
    return null;
  }

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product has sizes and needs size selection
    const hasProductSizes = product.TAMANHOS && product.TAMANHOS !== null;
    if (hasProductSizes) {
      navigate(`/product/${product.CODPROD}`);
      return;
    }

    addToCart({
      CODPROD: product.CODPROD,
      PRODUTO: product.PRODUTO,
      VALOR: product.VALOR,
      IMAGEM: product.IMAGEM,
      quantity: 1
    });

    toast.success("Produto adicionado ao carrinho", {
      autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 2000
    });
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updated = favorites.filter(item => item.CODPROD !== product.CODPROD);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
      toast.info("Removido dos favoritos", { autoClose: 1500 });
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success("Adicionado aos favoritos", { autoClose: 1500 });
    }
  };

  return (
    <Link to={`/product/${product.CODPROD}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white transition-all duration-300 hover:shadow-md">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.IMAGEM}
            alt={product.PRODUTO}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

          {/* Category Badge */}
          {categoryLabel && (
            <div className="absolute top-3 left-3">
              <span className="text-xs uppercase tracking-wider bg-white/90 backdrop-blur-sm px-2 py-1 text-gray-900">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium bg-black text-white px-2 py-1">
                -{discount}%
              </span>
            </div>
          )}

          {/* Action Buttons - Appear on hover */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-white text-gray-900 py-2 px-3 text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={14} />
              {(product.TAMANHOS && product.TAMANHOS !== null) ? 'Ver opções' : 'Adicionar'}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`bg-white p-2 hover:bg-gray-100 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-900'
              }`}
            >
              <FiHeart size={16} className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-normal text-gray-900 line-clamp-2 min-h-[2.5rem] mb-3">
            {product.PRODUTO}
          </h3>

          <div className="mt-auto space-y-2">
            {/* Rating */}
            {product.TOTAL_AVALIACOES > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(product.MEDIA_AVALIACOES)} readonly size={12} />
                <span className="text-xs text-gray-500">
                  ({product.TOTAL_AVALIACOES})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base font-medium text-gray-900">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.VALOR)}
                </span>
              )}
            </div>

            {/* Stock status */}
            {product.ESTOQUE !== undefined && product.ESTOQUE === 0 && (
              <p className="text-xs text-red-600">Fora de estoque</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
