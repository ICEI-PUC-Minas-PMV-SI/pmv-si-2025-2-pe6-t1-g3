import React from "react";

const Product = ({ title, image, price }) => {
  return (
    <div className="product">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
    </div>
  );
};

export default Product;
