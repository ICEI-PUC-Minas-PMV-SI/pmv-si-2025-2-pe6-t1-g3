import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../css/History.css";
import "react-toastify/dist/ReactToastify.css";

const History = () => {
  const [pedidos, setPedidos] = useState([]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:3000/pedido/listar?CODPES=${decodedToken.CODPES}`, config);
        const userPedidos = response.data;

        setPedidos(userPedidos);
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
  }, []);

  return (
    <div className="history">
      <div className="pedidos-list">
        {pedidos.map((pedido) => (
          <div key={pedido.CODPED} className="pedido">
            <h3>Pedido #{pedido.CODPED}</h3>
            <p>Data: {new Date(pedido.DATAINC).toLocaleString()}</p>
            <p className="endereco">
              Endereço de entrega: {pedido.ENDERECO.DESCRICAO}, {pedido.ENDERECO.RUA}, {pedido.ENDERECO.NUMERO} - {pedido.ENDERECO.BAIRRO}, {pedido.ENDERECO.CIDADE}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
