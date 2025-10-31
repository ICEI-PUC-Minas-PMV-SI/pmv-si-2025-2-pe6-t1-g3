import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartProducts from "../components/fragments/cartProducts";
import { jwtDecode } from "jwt-decode";
import { FiMapPin, FiShoppingBag } from "react-icons/fi";
import { userService, orderService2 } from "../services/api";

const Cart = () => {
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const handleTotalChange = (newTotal) => {
    setTotal(newTotal);
  };

  const handleCartItemsChange = (items) => {
    setCartItems(items);
  };

  const token = localStorage.getItem("token");

  if (!token) {
    toast.info("Por favor, faça login ou registre-se para continuar.", {
      position: "bottom-right",
      autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  }

  const fetchUserData = async () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const response = await userService.getProfile(decodedToken.CODPES);
        const user = response.data;
        setAddresses(user.ENDERECOS);
      } catch (error) {
        toast.error("Erro ao buscar dados. Tente mais tarde!", {
          position: "bottom-right",
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleOrderSubmit = async () => {
    if (!selectedAddress) {
      toast.error("Por favor, selecione um endereço antes de fechar o pedido!", {
        position: "bottom-right",
        autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("O carrinho está vazio. Adicione produtos antes de fechar o pedido!", {
        position: "bottom-right",
        autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const orderData = {
          CODEND: +selectedAddress,
          CODPES: decodedToken.CODPES,
          DESCONTO: 0,
          FRETE: 0,
          ITENS: cartItems.map((item) => ({
            CODPROD: item.CODPROD,
            TAMANHO: item.size || item.TAMANHO || null,
            QTD: item.quantity || item.QTD || 1,
          })).filter(item => item.CODPROD && item.QTD > 0),
        };
        console.log('Dados do pedido:', orderData);

        await orderService2.createOrder(orderData);

        localStorage.removeItem("cart");

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        toast.success("Pedido enviado com sucesso!", {
          position: "bottom-right",
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error('Erro ao criar pedido:', error);
        const errorMessage = error.response?.data?.message || error.message || "Erro ao enviar pedido. Tente mais tarde!";
        toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
        <p className="text-gray-600">Revise seus itens antes de finalizar a compra</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartProducts 
            items={cartItems} 
            onTotalChange={handleTotalChange} 
            onCartItemsChange={handleCartItemsChange} 
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
            
            {/* Total */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete:</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-semibold text-gray-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                </div>
              </div>
            </div>

            {/* Address Selection */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FiMapPin className="mr-2" size={16} />
                Endereço de Entrega
              </label>
              <select 
                value={selectedAddress} 
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
              >
                <option value="">Selecione um endereço</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.CODEND}>
                    {address.DESCRICAO} - {address.RUA}, {address.NUMERO}
                  </option>
                ))}
              </select>
              {addresses.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  <a href="/account" className="text-black hover:underline">
                    Adicione um endereço
                  </a> para continuar
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleOrderSubmit}
              disabled={!selectedAddress || cartItems.length === 0}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FiShoppingBag className="mr-2" size={18} />
              {cartItems.length === 0 ? 'Carrinho Vazio' : 'Finalizar Compra'}
            </button>

            {/* Security Info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Compra 100% segura e protegida
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default Cart;
