import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Inputs from "./fragments/Inputs";
import axios from "axios";
import "../css/register.css";

const Register = () => {
  // Using navigate to redirect users with expired token
  const navigate = useNavigate();
  // Using useState for setting a message in a lot of uses cases (login succeded, login error, email already registered....)
  const [message, setMessage] = useState(null);
  // Showing that everything in registering worked fine
  const [isSuccess, setIsSuccess] = useState(false);

  // Our route to register users, hitting nestJS
  const REGISTER_URL = "http://localhost:3000/registro"


  // getting the JWT Token from localstorage, checking if a valid user is trying to access /register again. Same for /login
  const retrievetoken = localStorage.getItem("token");

  // Checking if the token isnt expired, if not, redirect to the home page (user is already logged in)
  useEffect(() => {
    if (retrievetoken) {
      try {
        const decodedToken = JSON.parse(atob(retrievetoken.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() < expirationTime) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [retrievetoken, navigate]);

  // Creating some inputs to receive and manipulate data, it will also used to send to the localhost
  const [formData, setFormData] = useState({
    NOME: "",
    SOBRENOME: "",
    EMAIL: "",
    CPF: "",
    TELEFONE: "",
    SENHA: "",
  });

  // The function of this function (lol) is to receive every change in the form's input values and set in to the formData by setFormData
  const handleChange = (e) => {
    // Get the name and the value of the input
    const { name, value } = e.target;
    // set into the formData by comparing its name and allocating the value
    setFormData({ ...formData, [name]: value });
  };

  // Function triggered when hitting submit form button, responsible for posting, using axios, if success, redirect to the /login screen
  // if it came back with 409, the email exist, so its not possible to overwrite. Else, its a unknown error
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(REGISTER_URL, formData);
      console.log("localhost URL:", REGISTER_URL);
      // if the response of post is valid (200). if not, show errors
      if ((res.status = 200)) {
        setIsSuccess(true);
        setMessage("Cadastrado com sucesso!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.log("localhost URL:", REGISTER_URL);
      // showing email already exists error, or another type of error
      if ((error.response.status = 409)) {
        setMessage("Email já cadastrado.");
      } else {
        console.log("Erro ao se cadastrar:", error);
      }
    }
  };

  return (
    <div className="container-register">
      <div className="container-register-form">
        <form className="form-register" onSubmit={handleSubmit}>
          {message && <p className={isSuccess ? "status-success" : "status-error"}>{message}</p>}
          <h1>Registre-se aqui!</h1>
          <div className="inputs-register">
            <div className="column">
              <div className="textfield-register">
                <Inputs label="Nome:" type="text" name="NOME" id="nome" placeholder="Seu nome" onChange={handleChange} required />
                <Inputs label="Sobrenome:" type="text" name="SOBRENOME" id="sobrenome" placeholder="Seu sobrenome" onChange={handleChange} required />
                <Inputs label="CPF:" type="text" name="CPF" id="cpf" placeholder="Seu CPF" onChange={handleChange} required />
                <Inputs label="Telefone:" type="TELEFONE" name="TELEFONE" id="telefone" placeholder="(XX) 9 1234-5678" onChange={handleChange} required />
              </div>
            </div>
            <div className="column">
              <div className="textfield-register">
                <Inputs label="Seu email: " type="text" name="EMAIL" id="email" placeholder="Seu e-mail" onChange={handleChange} required />
                <Inputs label="Senha: " type="password" name="SENHA" id="senha" placeholder="Sua senha" onChange={handleChange} required />
                <Inputs type="password" label="Confirme sua senha:" name="confSenha" id="confSenha" placeholder="Sua senha novamente" required />
              </div>
              <div className="submit-register">
                <input type="submit" id="submit-register" value="Registrar" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
