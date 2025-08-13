import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../../css/Product.css";

const Products = ({ image, title, price }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <div className="product-info">
        <h1>{title}</h1>
        <h1>R$: {price}</h1>
        <div className="product-cart">
          <button className="buy-button">Comprar</button>
          <FontAwesomeIcon icon={faShoppingCart} className="shopping-cart-icon" />
        </div>
      </div>
    </div>
  );
};

export default Products;
