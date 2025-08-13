import React, { useState, useEffect } from "react";
import "../css/Cart.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartProducts from "../components/fragments/cartProducts";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
      autoClose: 7000,
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
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:3000/pessoa/buscar?CODPES=${decodedToken.CODPES}`, config);
        const user = response.data;
        setAddresses(user.ENDERECOS);
      } catch (error) {
        toast.error("Erro ao buscar dados. Tente mais tarde!", {
          position: "bottom-right",
          autoClose: 3000,
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
        autoClose: 3000,
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
        autoClose: 3000,
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

        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post("http://localhost:3000/pedido/cadastrar", orderData, config);

        localStorage.removeItem("cart");

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        toast.success("Pedido enviado com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error("Erro ao enviar pedido. Tente mais tarde!", {
          position: "bottom-right",
          autoClose: 3000,
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
    <div className="cart">
      <div className="h1-header-cart">
        <h1>Seu carrinho de compras</h1>
      </div>
      <div className="cart-container">
        <div className="left-cart-container">
          <div className="product-cart">
            <CartProducts items={cartItems} onTotalChange={handleTotalChange} onCartItemsChange={handleCartItemsChange} />
          </div>
        </div>
        <div className="right-cart-container">
          <h1>
            Subtotal: <b> R${total.toFixed(2)} </b>
          </h1>
          <div className="address-selection">
            <label htmlFor="address">Selecione o endereço de entrega:</label>
            <select id="address" value={selectedAddress} onChange={handleAddressChange}>
              <option value="">Selecione um endereço</option>
              {addresses.map((address, index) => (
                <option key={index} value={address.CODEND}>
                  {address.DESCRICAO}
                </option>
              ))}
            </select>
          </div>
          <input type="button" value="Fechar pedido" id="close-cart" onClick={handleOrderSubmit} disabled={!selectedAddress} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;
