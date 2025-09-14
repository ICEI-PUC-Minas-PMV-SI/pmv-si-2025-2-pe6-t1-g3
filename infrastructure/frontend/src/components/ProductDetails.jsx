import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';
import Card from './UI/Card';
import Button from './UI/Button';
import LoadingSpinner from './UI/LoadingSpinner';
import { FiMinus, FiPlus, FiShoppingCart, FiEdit, FiTrash2, FiHeart } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    addToCart({
      CODPROD: product.CODPROD,
      PRODUTO: product.PRODUTO,
      VALOR: product.VALOR,
      IMAGEM: product.IMAGEM,
      size: selectedSize,
      quantity: quantity
    });
    toast.success("Produto adicionado ao carrinho", {
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
        });
  };

  const handleEdit = () => {
    navigate(`/admin/products/edit/${productId}`);
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
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Produto não encontrado'}
            </h2>
            <Button onClick={() => navigate('/')}>
              Voltar à loja
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const sizes = ['P', 'M', 'G', 'GG'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.IMAGEM}
                alt={product.PRODUTO}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/600/600';
                }}
              />
              <button
                onClick={handleToggleFavorite}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                <FiHeart
                  size={22}
                  className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />

              </button>
            </div>
          </Card>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.PRODUTO}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.DESCRICAO}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.VALOR)}
              </span>
              <span className="text-sm text-gray-500">
                {product.ESTOQUE} em estoque
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho
              </label>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus size={16} />
                </Button>
                <span className="px-4 py-2 text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.ESTOQUE}
                >
                  <FiPlus size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={!selectedSize || product.ESTOQUE === 0}
              >
                <FiShoppingCart className="mr-2" size={18} />
                Adicionar ao carrinho
              </Button>

              {user?.isAdmin && (
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center"
                    onClick={handleEdit}
                  >
                    <FiEdit className="mr-2" size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 flex items-center justify-center"
                    onClick={handleDelete}
                  >
                    <FiTrash2 className="mr-2" size={16} />
                    Excluir
                  </Button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Categoria
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {product.CATEGORIAS?.CATEGORIA || 'Sem categoria'}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Informações do produto
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Material de alta qualidade</li>
                    <li>Confortável para uso diário</li>
                    <li>Fácil manutenção</li>
                    <li>Envio rápido e seguro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;