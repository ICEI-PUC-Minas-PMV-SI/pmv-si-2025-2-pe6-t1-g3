import React from "react";
import ErroSVG from "../assets/404.svg";
import "../css/Error404.css";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="img_container-error">
      <img className="img-error" src={ErroSVG} alt="Erro 404" />
      <p className="p-error">
        Você achou uma página que não existe. <br /> Deseja voltar para a{" "}
        <Link to="/">
          <a className="principal-screen" href="/dashboard">
            tela principal ?
          </a>
        </Link>
      </p>
    </div>
  );
};

export default Error404;
