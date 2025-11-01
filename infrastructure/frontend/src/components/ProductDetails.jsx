import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';
import LoadingSpinner from './UI/LoadingSpinner';
import SizeGuide from './Product/SizeGuide';
import { FiMinus, FiPlus, FiEdit, FiTrash2, FiHeart } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductReviews from './Product/ProductReviews';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Helper function to check if product is from FASHION category
  const isFashionProduct = () => {
    return product?.CATEGORIAS?.CATEGORIA === 'FASHION';
  };

  const hasProductSizes = () => {
    return product?.TAMANHOS && product.TAMANHOS !== null;
  };

  // Helper function to check if product is footwear
  const isFootwear = () => {
    const footwearKeywords = ['tênis', 'tenis', 'sapato', 'sandália', 'sandalia', 'bota', 'chinelo'];
    return footwearKeywords.some(keyword =>
      product?.PRODUTO?.toLowerCase().includes(keyword)
    );
  };

  useEffect(() => {
    loadProduct();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(item => item.CODPROD === parseInt(productId)));
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(productId);
      setProduct(response.data);
    } catch (error) {
      setError('Produto não encontrado');
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updated = favorites.filter(item => item.CODPROD !== product.CODPROD);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(product?.ESTOQUE || 1, prev + delta)));
  };

  const handleAddToCart = () => {
    // Only require size selection for products with sizes
    if (hasProductSizes() && !selectedSize) {
      alert('Por favor, selecione um tamanho');
      return;
    }

    const cartItem = {
      CODPROD: product.CODPROD,
      PRODUTO: product.PRODUTO,
      VALOR: product.VALOR,
      IMAGEM: product.IMAGEM,
      quantity: quantity
    };

    // Only add size for products with sizes
    if (hasProductSizes() && selectedSize) {
      cartItem.size = selectedSize;
    }

    addToCart(cartItem);
    toast.success("Produto adicionado ao carrinho", {
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
        });
  };

  const handleEdit = () => {
    navigate('/admin', {
      state: { editProduct: product, activeTab: 'products' }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      navigate('/');
    } catch (error) {
      alert('Erro ao excluir produto');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-light text-gray-900 mb-6">
            {error || 'Produto não encontrado'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Voltar à loja
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Get sizes from product data
  const getSizes = () => {
    if (!hasProductSizes()) {
      return [];
    }
    try {
      return JSON.parse(product.TAMANHOS);
    } catch (error) {
      console.error('Error parsing sizes:', error);
      return [];
    }
  };

  const sizes = getSizes();

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-50 overflow-hidden">
              <img
                src={product.IMAGEM}
                alt={product.PRODUTO}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/600';
                }}
              />
            </div>
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 p-2 transition-opacity hover:opacity-70"
              aria-label="Adicionar aos favoritos"
            >
              <FiHeart
                size={20}
                className={isFavorite ? 'text-black fill-black' : 'text-gray-400'}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="lg:pt-8">
            <div className="space-y-6">
              {/* Category */}
              <div className="text-xs tracking-wider text-gray-500 uppercase">
                {product.CATEGORIAS?.CATEGORIA || 'Produto'}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                {product.PRODUTO}
              </h1>

              {/* Price */}
              <div className="text-2xl font-normal text-gray-900">
                {formatPrice(product.VALOR)}
              </div>

              {/* Description */}
              {product.DESCRICAO && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.DESCRICAO}
                </p>
              )}

              {/* Size selector for products with sizes */}
              {hasProductSizes() && sizes.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-gray-900">
                      Tamanho
                    </span>
                    {isFashionProduct() && (
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-xs text-gray-500 hover:text-gray-900 underline transition-colors"
                      >
                        Guia de tamanhos
                      </button>
                    )}
                  </div>
                  <div className={`grid gap-2 ${isFootwear() ? 'grid-cols-5' : 'grid-cols-5'}`}>
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm border transition-colors ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-900 hover:border-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-gray-400 mt-2">
                      Selecione um tamanho
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-gray-900">
                    Quantidade
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.ESTOQUE} disponíveis
                  </span>
                </div>
                <div className="inline-flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-6 py-3 text-sm min-w-[60px] text-center border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.ESTOQUE}
                    className="px-4 py-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={(hasProductSizes() && !selectedSize) || product.ESTOQUE === 0}
                  className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {product.ESTOQUE === 0 ? 'Indisponível' : 'Adicionar ao carrinho'}
                </button>
              </div>

              {/* Admin actions */}
              {user?.isAdmin && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleEdit}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-gray-600 border border-gray-300 hover:border-gray-900 transition-colors"
                    >
                      <FiEdit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-red-600 border border-red-300 hover:border-red-600 transition-colors"
                    >
                      <FiTrash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-16 lg:mt-24 max-w-4xl">
          <ProductReviews productId={productId} />
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        isFootwear={isFootwear()}
      />
    </div>
  );
};

export default ProductDetails;