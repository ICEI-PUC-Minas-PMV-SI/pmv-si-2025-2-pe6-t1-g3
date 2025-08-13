import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Product from "./fragments/Products";
import axios from "axios";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  // Products
  const [products, setProducts] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);
  // Scrolling features
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Route to list products
  const url_fetchproducts = `http://localhost:3000/produto/listar`;

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set css to spinner loading
  // // // // // // // // // // // // // // // // // // // // // // // //
  const override = css`
    display: block;
    height: 100vh;
    margin: 0 auto;
    border-color: red;
  `;

  const spinnerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Displaying products function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(url_fetchproducts, { params: { page } });

      const newProducts = response.data;

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(newProducts);
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Calling displaying function
  // // // // // // // // // // // // // // // // // // // // // // // //

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Scrolling displaying function
  // // // // // // // // // // // // // // // // // // // // // // // //
  let prevScrollPos = window.scrollY || window.pageYOffset;

  const handleScroll = () => {
    if (!hasMore || loading) return;
    const currentScrollPos = window.scrollY || window.pageYOffset;

    if (currentScrollPos > prevScrollPos && window.innerHeight + currentScrollPos >= document.documentElement.offsetHeight - 50) {
      setPage((prevPage) => prevPage + 1);
    }
    prevScrollPos = currentScrollPos;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="list-products">
      {Array.isArray(products) &&
        products.map((product, index) => (
          <Link to={`/product/${product.CODPROD}`} key={`${product.CODPROD}-${index}`}>
            <Product title={product.PRODUTO} image={product.IMAGEM} price={product.VALOR} />
          </Link>
        ))}
    </div>
  );
};

export default Dashboard;
