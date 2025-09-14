// import React from "react";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartProductsLiked from "../components/fragments/cartProductsLiked";
import { jwtDecode } from "jwt-decode";
import { FiMapPin, FiShoppingBag } from "react-icons/fi";
import { userService, orderService2 } from "../services/api";

const Likedproducts = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cartItems, setCartItems] = useState([]);


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
        // setAddresses(user.ENDERECOS);
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
          CODEND: selectedAddress,
          CODPES: decodedToken.CODPES,
          DESCONTO: 0,
          FRETE: 0,
          ITENS: cartItems.map((item) => ({
            CODPROD: item.CODPROD,
            TAMANHO: item.TAMANHO,
            QTD: item.QTD,
          })),
        };
        console.log(orderData);

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
        toast.error("Erro ao enviar pedido. Tente mais tarde!", {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Desejos</h1>
        <p className="text-gray-600">Adicione seus favoritos ao carrinho</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartProductsLiked 
            items={cartItems} 
            onCartItemsChange={handleCartItemsChange} 
          />
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default Likedproducts;
