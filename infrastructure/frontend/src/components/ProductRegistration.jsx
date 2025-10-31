import React, { useState, useRef } from "react";
import Inputs from "./fragments/Inputs";
import "../css/ProductRegistration.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { productService } from "../services/api";

const ProductRegistration = () => {
  const [product, setProduct] = useState({
    PRODUTO: "",
    DESCRICAO: "",
    VALOR: 0,
    ESTOQUE: 0,
    DESCONTO: 0,
    IMAGEM: "",
    CATEGORIA: "",
  });

  const fileInputRef = useRef(null);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

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
      const registerProduct = await productService.createProduct(product);
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
      const toastDuration = import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION || 3000;
      toast.success("Produto cadastrado com sucesso!", {
        position: "bottom-right",
        autoClose: parseInt(toastDuration),
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const toastDuration = import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION || 3000;
        toast.error("Erro 500: Erro ao cadastrar produto. Tente novamente mais tarde.", {
          position: "bottom-right",
          autoClose: parseInt(toastDuration),
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const toastDuration = import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION || 3000;
        toast.error("Erro ao cadastrar produto. Tente novamente.", {
          position: "bottom-right",
          autoClose: parseInt(toastDuration),
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
              <option value="MODA">Moda</option>
              <option value="ELETRONICOS">Eletrônicos</option>
              <option value="CASA">Casa</option>
              <option value="ESPORTES">Esportes</option>
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
