import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeartCrack } from "react-icons/fa6";
import { productService } from "../../services/api";

const CartProductsLiked = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("favorites")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = cart.map((item) => productService.getProduct(item.CODPROD));
        const responses = await Promise.all(productDetailsPromises);

        const fetchedProducts = responses.map((response, index) => ({
          ...response.data,
          quantity: cart[index].quantity,
          size: cart[index].size,
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao buscar os detalhes dos produtos do carrinho:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [cart]);

  useEffect(() => {
    // calculateTotal();
  }, [cart, products]);

  const handleRemoveProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.CODPROD !== productId);
    setCart(updatedCart);
    setProducts(products.filter((product) => product.CODPROD !== productId));
    localStorage.setItem("favorites", JSON.stringify(updatedCart));
    toast.success("Produto removido dos favoritos", {
      autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
    });
    // calculateTotal();
  };


  const handleAddToCart = (product) => {
    // if (!selectedSize) {
    //   alert('Por favor, selecione um tamanho');
    //   return;
    // }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => 
      item.CODPROD === product.CODPROD
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        CODPROD: product.CODPROD,
        PRODUTO: product.PRODUTO,
        VALOR: product.VALOR,
        IMAGEM: product.IMAGEM,
        size: product.size,
        quantity: product.quantity || 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success("Produto adicionado ao carrinho", {
      autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
    });
    handleRemoveProduct(product.CODPROD);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-2 text-gray-600">Carregando produtos...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sua lista de desejos está vazia</h3>
        <p className="text-gray-500 mb-6">Adicione produtos para sua lista de desejos</p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
        >
          Continuar Comprando
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Itens na sua lista de desejos</h2>
        <p className="text-sm text-gray-600">{products.length} {products.length === 1 ? 'produto' : 'produtos'}</p>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.CODPROD} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={product.IMAGEM} 
                  alt={product.PRODUTO}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.PRODUTO}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Preço unitário: <span className="font-medium text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.VALOR)}</span></p>
                  <p>Tamanho: <span className="font-medium text-gray-900">{product.size}</span></p>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center text-right justify-between space-x-2">
                <button
                    onClick={() => handleAddToCart(product)}
                    className="flex bg-blue-500 items-center space-x-1 p-1 rounded-lg text-white transition-colors"
                  >
                    <FiShoppingCart size={14} />
                    <span className="text-sm">Adicionar ao Carrinho</span>
                  </button>
                  <button
                    onClick={() => handleRemoveProduct(product.CODPROD)}
                    className="flex bg-red-400 items-center space-x-1 p-1 rounded-lg text-white transition-colors"
                  >
                    <FaHeartCrack  size={14} />
                    {/* <span className="text-sm">Remover do Carrinho</span> */}
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProductsLiked;
