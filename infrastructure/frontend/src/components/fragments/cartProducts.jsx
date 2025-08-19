import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

const CartProducts = ({ onTotalChange }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = cart.map((item) => axios.get(`http://localhost:3000/produto/buscar?CODPROD=${item.CODPROD}`));
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
    calculateTotal();
  }, [cart, products]);

  const handleRemoveProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.CODPROD !== productId);
    setCart(updatedCart);
    setProducts(products.filter((product) => product.CODPROD !== productId));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Produto removido do carrinho");
    calculateTotal();
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.CODPROD === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
    setProducts(
      products.map((product) => {
        if (product.CODPROD === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      })
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal();
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item.CODPROD === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    setProducts(
      products.map((product) => {
        if (product.CODPROD === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      })
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal();
  };

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => {
      const product = products.find((p) => p.CODPROD === item.CODPROD);
      return acc + (product ? product.VALOR * item.quantity : 0);
    }, 0);
    onTotalChange(total);
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Seu carrinho está vazio</h3>
        <p className="text-gray-500 mb-6">Adicione produtos para continuar com sua compra</p>
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
      
      {/* Cart Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Itens no Carrinho</h2>
        <p className="text-sm text-gray-600">{products.length} {products.length === 1 ? 'produto' : 'produtos'}</p>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.CODPROD} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img 
                  src={product.IMAGEM} 
                  alt={product.PRODUTO}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.PRODUTO}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Preço unitário: <span className="font-medium text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.VALOR)}</span></p>
                  <p>Tamanho: <span className="font-medium text-gray-900">{product.size}</span></p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Quantidade:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleDecreaseQuantity(product.CODPROD)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={product.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-3 py-2 text-sm font-medium">{product.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(product.CODPROD)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveProduct(product.CODPROD)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FiTrash2 size={14} />
                    <span className="text-sm">Remover</span>
                  </button>
                </div>
              </div>

              {/* Product Total */}
              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.VALOR * product.quantity)}
                </p>
                <p className="text-sm text-gray-500">
                  {product.quantity} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.VALOR)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProducts;
