import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    CODPES: "",
    NOME: "",
    SOBRENOME: "",
    CPF: "",
    TELEFONE: "",
    EMAIL: "",
  });

  const [userPassword, setUserPassword] = useState({
    EMAIL: "",
    SENHA: "",
    CONFIRMAR_SENHA: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSetPassword = (e) => {
    const { name, value } = e.target;
    setUserPassword({ ...userPassword, [name]: value });
  };

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

  const updateData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        toast.success("Dados atualizados com sucesso!", {
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (userPassword.SENHA !== userPassword.CONFIRMAR_SENHA) {
      setPasswordError("As senhas não coincidem. Por favor, verifique.");
      return;
    } else {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const passwordData = { ...userPassword };
          delete passwordData.CONFIRMAR_SENHA;
          const res = await axios.patch("http://localhost:3000/alterar/senha", passwordData);
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
          setUserPassword({ ...userPassword, SENHA: "", CONFIRMAR_SENHA: "" });
        } catch (error) {
          console.error("Erro ao atualizar a senha:", error);
          toast.error("Erro ao atualizar senha!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Information Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Informações Pessoais
              </h2>
              <p className="text-gray-600">
                Atualize seus dados pessoais e informações de contato
              </p>
            </div>

            <form onSubmit={updateData} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  value={userData.EMAIL}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  O e-mail não pode ser alterado
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="NOME"
                    value={userData.NOME}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    name="SOBRENOME"
                    value={userData.SOBRENOME}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  name="CPF"
                  value={userData.CPF}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="TELEFONE"
                  value={userData.TELEFONE}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="(11) 9 9999-9999"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Alterar Senha
              </h2>
              <p className="text-gray-600">
                Mantenha sua conta segura com uma senha forte
              </p>
            </div>

            <form onSubmit={updatePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="SENHA"
                  value={userPassword.SENHA}
                  onChange={handleSetPassword}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Digite sua nova senha"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="CONFIRMAR_SENHA"
                  value={userPassword.CONFIRMAR_SENHA}
                  onChange={handleSetPassword}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="Confirme sua nova senha"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">{passwordError}</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Dicas para uma senha segura:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use pelo menos 8 caracteres</li>
                      <li>Combine letras, números e símbolos</li>
                      <li>Evite informações pessoais</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </button>
            </form>
          </div>
        </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
