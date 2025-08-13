import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Inputs from "./fragments/Inputs";
import "../css/Profile.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  // // // // // // // // // // // // // // // // // // // // // // // //
  // Person field
  // // // // // // // // // // // // // // // // // // // // // // // //
  const [userData, setUserData] = useState({
    CODPES: "",
    NOME: "",
    SOBRENOME: "",
    CPF: "",
    TELEFONE: "",
    EMAIL: "",
  });

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Password
  // // // // // // // // // // // // // // // // // // // // // // // //
  const [userPassword, setUserPassword] = useState({
    EMAIL: "",
    SENHA: "",
    CONFIRMAR_SENHA: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // // // // // // // // // // // // // // // // // // // // // // // //
  // getting data from inputs and setting
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSetPassword = (e) => {
    const { name, value } = e.target;
    setUserPassword({ ...userPassword, [name]: value });
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Fetch user data
  // // // // // // // // // // // // // // // // // // // // // // // //
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          setUserPassword({
            ...userPassword,
            EMAIL: decodedToken.EMAIL,
          });

          const response = await axios.get(`http://localhost:3000/pessoa/buscar?CODPES=${decodedToken.CODPES}`, config);
          const user = response.data;
          setUserData({
            CODPES: user.CODPES,
            NOME: user.NOME,
            SOBRENOME: user.SOBRENOME,
            CPF: user.CPF,
            TELEFONE: user.TELEFONE,
            EMAIL: user.USUARIO.EMAIL,
          });
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário:", error);
        }
      }
    };

    fetchData();
  }, []);

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Update user data function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const updateData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await axios.post("http://localhost:3000/pessoa/atualizar", userData, config);
        console.log("Dados atualizados com sucesso:", res);
        toast.success("Senha atualizada com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error("Erro ao atualizar. Tente mais tarde!", {
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

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Update password function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const updatePassword = async (e) => {
    if (userPassword.SENHA !== userPassword.CONFIRMAR_SENHA) {
      setPasswordError("As senhas não coincidem. Por favor, verifique.");
      e.preventDefault();
      return;
    } else {
      const token = localStorage.getItem("token");
      e.preventDefault();
      if (token) {
        try {
          delete userPassword.CONFIRMAR_SENHA;
          const res = await axios.patch("http://localhost:3000/alterar/senha", userPassword);
          toast.success("Senha atualizada com sucesso!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setPasswordError("");
        } catch (error) {
          console.error("Erro ao atualizar a senha:", error);
        }
      }
    }
  };

  return (
    <div className="profile-container">
      <form id="form-profile" onSubmit={updateData}>
        <Inputs label="E-mail:" type="email" name="EMAIL" value={userData.EMAIL} readOnly className="css-addr-block" />
        <Inputs label="Telefone:" type="text" name="TELEFONE" defaultValue={userData.TELEFONE} onChange={handleChange} className="css-addr" placeholder="(XX) 9 XXXX-XXXX" />
        <Inputs label="Nome:" type="text" name="NOME" defaultValue={userData.NOME} onChange={handleChange} className="css-addr" />
        <Inputs label="Sobrenome:" type="text" name="SOBRENOME" value={userData.SOBRENOME} onChange={handleChange} id="sobrenome-profile" className="css-addr" />
        <Inputs label="CPF:" type="text" name="CPF" defaultValue={userData.CPF} onChange={handleChange} className="css-addr" />
        <div className="input-profile">
          <input type="submit" value="Alterar dados" />
        </div>
      </form>
      <form id="form-password-profile" onSubmit={updatePassword}>
        <h1>Deseja trocar sua senha?</h1>
        <Inputs label="Nova senha:" type="password" name="SENHA" id="senha-profile" onChange={handleSetPassword} required />
        <Inputs label="Confirme sua nova senha:" type="password" name="CONFIRMAR_SENHA" id="senha2-profile" onChange={handleSetPassword} required />
        {passwordError && <p style={{ color: "red", fontWeight: "bold" }}>{passwordError}</p>}
        <div className="input-profile-password">
          <input type="submit" value="Cadastrar nova senha" />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;
