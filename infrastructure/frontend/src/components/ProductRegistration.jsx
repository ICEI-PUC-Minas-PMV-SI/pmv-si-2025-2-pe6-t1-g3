import React, { useState, useRef } from "react";
import Inputs from "./fragments/Inputs";
import axios from "axios";
import "../css/ProductRegistration.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductRegistration = () => {
  // Route to register products
  const url_register_product = "http://localhost:3000/produto/cadastrar";

  // Product field
  const [product, setProduct] = useState({
    PRODUTO: "",
    DESCRICAO: "",
    VALOR: 0,
    ESTOQUE: 0,
    DESCONTO: 0,
    IMAGEM: "",
    CATEGORIA: "",
  });

  // Reference for file input
  const fileInputRef = useRef(null);

  // Getting inputs value to product field
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  // Update product image (conversion png - base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({
          ...product,
          IMAGEM: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Upload product
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const registerProduct = await axios.post(url_register_product, product, config);
      setProduct({
        PRODUTO: "",
        DESCRICAO: "",
        VALOR: 0,
        ESTOQUE: 0,
        DESCONTO: 0,
        IMAGEM: "",
        CATEGORIA: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Produto cadastrado com sucesso!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error("Erro 500: Erro ao cadastrar produto. Tente novamente mais tarde.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Erro ao cadastrar produto. Tente novamente.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      console.error("Erro ao cadastrar produto:", error);
    }
  };

  return (
    <form className="product-registration" onSubmit={handleSubmit}>
      <div className="form-group-container">
        <div className="column">
          <div className="form-group">
            <Inputs label="Título do Produto:" type="text" name="PRODUTO" id="title" value={product.PRODUTO} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <Inputs
              label="Descrição do Produto:"
              type="text"
              name="DESCRICAO"
              id="description"
              value={product.DESCRICAO}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Categoria:</label>
            <select name="CATEGORIA" id="category" value={product.CATEGORIA} onChange={handleChange} className="form-control" required>
              <option value="">Selecione a categoria</option>
              <option value="FEMININO">FEMININO</option>
              <option value="MASCULINO">MASCULINO</option>
            </select>
          </div>
          <div className="form-group">
            <Inputs
              label="Imagem do Produto:"
              type="file"
              name="IMAGEM"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              required
              ref={fileInputRef}
            />
          </div>
        </div>
        <div className="column">
          <div className="form-group">
            <Inputs label="Preço:" type="number" name="VALOR" id="price" value={product.VALOR} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <Inputs label="Estoque:" type="number" name="ESTOQUE" id="stock" value={product.ESTOQUE} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <Inputs label="Desconto:" type="number" name="DESCONTO" id="discount" value={product.DESCONTO} onChange={handleChange} className="form-control" required />
          </div>
        </div>
      </div>
      <div className="submit-product">
        <input type="submit" value="Cadastrar produto" />
      </div>
      <ToastContainer />
    </form>
  );
};

export default ProductRegistration;
