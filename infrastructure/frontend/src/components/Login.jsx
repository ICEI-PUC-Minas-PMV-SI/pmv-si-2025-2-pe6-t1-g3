import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";
import Inputs from "./fragments/Inputs";

const Login = () => {
  const navigate = useNavigate();
  // Route to check if user has an account on website
  const url_login = "http://localhost:3000/login";
  // Messages to validate and display errors or success
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Checking if the token isnt expired, if not, redirect to the home page (user is already logged in)
  const retrievetoken = localStorage.getItem("token");
  useEffect(() => {
    const retrievetoken = localStorage.getItem("token");
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
  const [loginData, setLoginData] = useState({
    EMAIL: "",
    SENHA: "",
  });

  // function to send the inputs data and check if exists in database (201, 204, 200)
  // if not, 404 error = username or password incorrect, or else
  const handleValidateLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url_login, loginData);
      if (res.status === 201 || res.status === 204 || res.status === 200) {
        setIsSuccess(true);
        // Saving the token into localstorage that came from localhost
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setMessage("Usuário ou senha incorretos.");
      } else {
        console.error("Erro ao fazer login:", error);
      }
    }
  };

  // The function of this function (lol) is to receive every change in the form's input values and set in to the loginData by setLoginData
  const handleChange = (e) => {
    // Get the name and the value of the input
    const { name, value } = e.target;
    // set into the formData by comparing its name and allocating the value
    setLoginData({ ...loginData, [name]: value });
  };

  return (
    <div className="container-register">
      <div className="container-register-form">
        <form className="form-register-login" onSubmit={handleValidateLogin}>
          {message && <p className={isSuccess ? "status-success" : "status-error"}>{message}</p>}
          <h1>Faça login aqui!</h1>
          <div className="inputs-register">
            <div className="textfield-register">
              <Inputs label="Email:" type="text" name="EMAIL" id="email" placeholder="Seu e-mail" onChange={handleChange} required />
              <Inputs label="Senha:" type="password" name="SENHA" id="senha" placeholder="Sua senha" onChange={handleChange} required />
            </div>
          </div>
          <div className="submit-login">
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
