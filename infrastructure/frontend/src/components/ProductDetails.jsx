import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import Sustentavel from "../assets/sustentabilidade.jpg";
import { PiShoppingCartFill } from "react-icons/pi";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../css/ProductDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  // Products
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  // Loading
  const [loading, setLoading] = useState(true);

  // Products
  const [selectedSize, setSelectedSize] = useState("");
  const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Validations
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Pop Ups
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editableProduct, setEditableProduct] = useState({});

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set css to spinner loading
  // // // // // // // // // // // // // // // // // // // // // // // //
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: black;
  `;

  const spinnerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Check if user is admin to display more buttons
  // // // // // // // // // // // // // // // // // // // // // // // //

  const storedToken = localStorage.getItem("token");
  useEffect(() => {
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() > expirationTime) {
          localStorage.removeItem("token");
          setToken(null);
        }
        setIsAdmin(decodedToken.PERMISSAO === "ADMINISTRADOR");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [storedToken]);

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Fetch products from localhost
  // // // // // // // // // // // // // // // // // // // // // // // //

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (productId) {
          const response = await axios.get(`http://localhost:3000/produto/buscar?CODPROD=${parseInt(productId, 10)}`);
          setProduct(response.data);
        } else {
          throw new Error("ID do produto não fornecido");
        }
      } catch (error) {
        console.error("Erro ao buscar os detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set size of the product
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set messagem when hovering cart button
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleMouseOverCart = () => {
    setShowAddToCartMessage(true);
  };

  const handleMouseOutCart = () => {
    setShowAddToCartMessage(false);
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set and remove edit product pop-up
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleEditClick = () => {
    setEditableProduct({ ...product, CODPROD: parseInt(productId, 10) });
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Quantity
  // // // // // // // // // // // // // // // // // // // // // // // //

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // update product image in pop-up (conversion png - base64)
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableProduct((prevProduct) => ({
          ...prevProduct,
          IMAGEM: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Add to cart function
  // // // // // // // // // // // // // // // // // // // // // // // //

  const addToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor, selecione um tamanho antes de adicionar ao carrinho.", {
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
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productWithSize = { ...product, size: selectedSize };

    const existingProductIndex = cart.findIndex((item) => item.CODPROD === productWithSize.CODPROD && item.size === productWithSize.size);

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...productWithSize, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Produto adicionado ao carrinho!", {
      position: "bottom-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Buy product function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleBuy = async () => {};

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Edit product function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(
        `http://localhost:3000/produto/atualizar`,
        {
          ...editableProduct,
          CODPROD: parseInt(editableProduct.CODPROD, 10),
        },
        config
      );
      setProduct(response.data);
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Set and remove delete product pop-up
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleConfirmDeleteProduct = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDeleteProduct = () => {
    setShowDeleteConfirmation(false);
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Delete product function
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:3000/produto/deletar?CODPROD=${parseInt(productId, 10)}`, config);
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  };

  // Handle mouse move on image
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Loading stuff
  // // // // // // // // // // // // // // // // // // // // // // // //

  if (loading) {
    return (
      <div style={spinnerContainerStyle}>
        <ClipLoader color={"#000"} loading={loading} css={override} size={150} />
      </div>
    );
  }

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  return (
    <>
      <div className="product-details">
        <div className="image-product-side">
          <div className="cart-icon-container" onMouseOver={handleMouseOverCart} onMouseOut={handleMouseOutCart}>
            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" onClick={addToCart} />
            {showAddToCartMessage && <p className="add-to-cart-message">Adicionar ao carrinho</p>}
          </div>
          <img
            src={product.IMAGEM}
            alt={product.NOME}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            style={isZoomed ? { transform: "scale(1.2)", ...zoomStyle } : {}}
          />
        </div>
        <div className="description-products">
          <h1>{product.PRODUTO}</h1>
          <p>{product.DESCRICAO}</p>
          <p className="price">Preço: R${product.VALOR}</p>

          <div className="quantity-selection">
            <p> Quantidade: </p>
            <button onClick={decreaseQuantity} className="quantity-button">
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-button">
              +
            </button>
          </div>

          <div className="size-selection">
            <button onClick={() => handleSizeSelect("P")} className={selectedSize === "P" ? "selected" : ""}>
              P
            </button>
            <button onClick={() => handleSizeSelect("M")} className={selectedSize === "M" ? "selected" : ""}>
              M
            </button>
            <button onClick={() => handleSizeSelect("G")} className={selectedSize === "G" ? "selected" : ""}>
              G
            </button>
          </div>

          <form className="submit-producttt" onSubmit={handleBuy}>
            {isAdmin && (
              <>
                <button type="button" id="submit-edit-product" className="admin-buttons" onClick={handleEditClick}>
                  <FaPencilAlt className="inline mr-1" />
                  Atualizar
                </button>
                <button type="button" id="submit-delete-product" className="admin-buttons" onClick={handleConfirmDeleteProduct}>
                  <FaTrash className="inline mr-1" />
                  Excluir
                </button>
              </>
            )}
            <button type="submit" id="submit-buy-product" className="flex items-center">
              <PiShoppingCartFill className="inline mr-1" />
              Comprar
            </button>
          </form>
        </div>
      </div>
      <div className="sustentability">
        <div className="sustentability-image">
          <img src={Sustentavel} alt="" />
        </div>
        <div className="sustentability-text">
          <h1 className="sustentability-paragraph">Produto Sustentável</h1>
          <p>
            Estamos comprometidos em oferecer produtos que não apenas atendam às suas necessidades, mas também respeitem o meio ambiente. Este item foi cuidadosamente produzido com
            materiais sustentáveis e práticas eco-friendly. Ao escolher este produto, você está contribuindo para um futuro mais sustentável e ajudando a reduzir o impacto
            ambiental. Juntos, podemos fazer a diferença!
          </p>
        </div>
      </div>
      <ToastContainer />

      {/* // // // // // // // // // // // // // // // // // // // // // // // //
      // Set edit popup
       // // // // // // // // // // // // // // // // // // // // // // // // */}
      {showDeleteConfirmation && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirmar exclusão</h2>
            <p>Tem certeza de que deseja excluir este produto?</p>
            <div className="popup-buttons">
              <button onClick={handleCancelDeleteProduct}>Não</button>
              <button onClick={handleDeleteProduct}>Sim</button>
            </div>
          </div>
        </div>
      )}

      {/* // // // // // // // // // // // // // // // // // // // // // // // //
      // Set delete popup
     // // // // // // // // // // // // // // // // // // // // // // // // */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Editar Produto</h2>
            <label>
              Nome:
              <input type="text" name="PRODUTO" value={editableProduct.PRODUTO || ""} onChange={handleInputChange} />
            </label>
            <label>
              Descrição:
              <input type="text" name="DESCRICAO" value={editableProduct.DESCRICAO || ""} onChange={handleInputChange} />
            </label>
            <label>
              Preço:
              <input type="text" name="VALOR" value={editableProduct.VALOR || ""} onChange={handleInputChange} />
            </label>
            <label>
              Estoque:
              <input type="text" name="ESTOQUE" value={editableProduct.ESTOQUE || ""} onChange={handleInputChange} />
            </label>
            <label>
              Imagem URL:
              <input type="file" name="IMAGEM" accept="image/*" onChange={handleImageChange} />
            </label>
            <div className="popup-buttons">
              <button onClick={handlePopupClose}>Cancelar</button>
              <button onClick={handleSaveChanges}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
