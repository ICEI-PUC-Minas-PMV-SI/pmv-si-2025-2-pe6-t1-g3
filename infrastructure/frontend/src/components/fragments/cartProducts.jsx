import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Cart.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Cart.css";
import { FaTrash } from "react-icons/fa";

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
    return <div>Carregando...</div>;
  }

  if (products.length === 0) {
    return <div>Seu carrinho está vazio.</div>;
  }

  return (
    <div className="cart">
      <ToastContainer />
      <div className="cart-products">
        {products.map((product) => (
          <div key={product.CODPROD} className="cart-product">
            <img src={product.IMAGEM} alt={product.PRODUTO} />
            <div className="product-cart-right">
              <h2>{product.PRODUTO}</h2>
              <p>Preço: R${product.VALOR}</p>
              <p>Tamanho: {product.size}</p>
              <span className="remove-product-button" onClick={() => handleRemoveProduct(product.CODPROD)}>
                <FaTrash />
                <p>Remover</p>
              </span>
            </div>
            <div id="quantity-controlsss">
              <p>Quantidade: </p>
              <button className="cart-hover-quantity" onClick={() => handleDecreaseQuantity(product.CODPROD)}>
                -
              </button>
              <p>{product.quantity}</p>
              <button className="cart-hover-quantity" onClick={() => handleIncreaseQuantity(product.CODPROD)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProducts;
