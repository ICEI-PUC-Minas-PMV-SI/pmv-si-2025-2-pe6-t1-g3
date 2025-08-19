import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Address = () => {
  // // // // // // // // // // // // // // // // // // // // // // // //
  // Address
  // // // // // // // // // // // // // // // // // // // // // // // //
  const [addressInfo, setAddressInfo] = useState({
    CODPES: "",
    CODEND: "",
    CEP: "",
    RUA: "",
    BAIRRO: "",
    CIDADE: "",
    COMPLEMENTO: "",
    NUMERO: "",
    DESCRICAO: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [editedAddress, setEditedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cep, setCEP] = useState("");
  const [invalidCep, setInvalidCep] = useState(false);

  const isValidCEP = (cep) => {
    return cep.length === 9;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isValidCEP(cep)) {
        fetchCEP();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [cep]);

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Fetch CEP data based on viacep API
  // // // // // // // // // // // // // // // // // // // // // // // //
  const fetchCEP = async () => {
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep.replace(/[^0-9]/g, "")}/json/`);
      const data = res.data;

      setAddressInfo((prevInfo) => ({
        ...prevInfo,
        CEP: data.cep || "",
        RUA: data.logradouro || "",
        BAIRRO: data.bairro || "",
        CIDADE: data.localidade || "",
      }));

      setInvalidCep(!data.cep);
    } catch (error) {
      toast.error("Erro ao buscar CEP. Tente mais tarde!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // getting data from inputs and setting
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
    }
    setCEP(value);
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Fetch user data
  // // // // // // // // // // // // // // // // // // // // // // // //
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:3000/pessoa/buscar?CODPES=${decodedToken.CODPES}`, config);
        const user = response.data;

        setAddressInfo({
          CODPES: user.CODPES,
        });
        setAddresses(user.ENDERECOS);
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

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Submit user data function
  // // // // // // // // // // // // // // // // // // // // // // // //

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        if (editedAddress) {
          const updateData = { ...addressInfo };
          delete updateData.CODPES;
          await axios.patch("http://localhost:3000/endereco/atualizar/", updateData, config);
          setAddresses((prevAddresses) => 
            prevAddresses.map((address) => 
              address.CODEND === editedAddress.CODEND 
                ? { ...address, ...updateData } 
                : address
            )
          );
          toast.success("Endereço atualizado com sucesso!");
          setEditedAddress(null);
        } else {
          const res = await axios.post("http://localhost:3000/endereco/cadastrar", addressInfo, config);
          setAddresses([...addresses, { ...addressInfo, CODEND: res.data.CODEND }]);
          toast.success("Endereço adicionado com sucesso!");
        }
        
        // Reset form
        setAddressInfo({
          CODPES: addressInfo.CODPES,
          CODEND: "",
          CEP: "",
          RUA: "",
          BAIRRO: "",
          CIDADE: "",
          COMPLEMENTO: "",
          NUMERO: "",
          DESCRICAO: "",
        });
        setCEP("");
        setShowForm(false);
        
      } catch (error) {
        if (error.response?.status === 409) {
          toast.error("Descrição de endereço já utilizada!");
        } else if (error.response?.status === 406) {
          toast.error("Máximo de endereços cadastrados (3)!");
        } else {
          toast.error("Erro ao salvar endereço. Tente mais tarde!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // //
  // Delete user address function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleDelete = async (codend) => {
    const newAddresses = addresses.filter((address) => address.CODEND !== codend);
    setAddresses(newAddresses);
    const token = localStorage.getItem("token");
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        await axios.delete(`http://localhost:3000/endereco/deletar?CODEND=${codend}`, config);
        toast.success("Endereço deletado com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        toast.error("Errro ao deletar endereço. Tente novamente!", {
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
  // Edit user address function
  // // // // // // // // // // // // // // // // // // // // // // // //
  const handleEdit = (address) => {
    setEditedAddress(address);
    setShowForm(true);
    setAddressInfo((prevAddressInfo) => ({
      ...prevAddressInfo,
      CODPES: prevAddressInfo.CODPES,
      CODEND: address.CODEND,
      CEP: address.CEP,
      RUA: address.RUA,
      BAIRRO: address.BAIRRO,
      CIDADE: address.CIDADE,
      COMPLEMENTO: address.COMPLEMENTO,
      NUMERO: address.NUMERO,
      DESCRICAO: address.DESCRICAO,
    }));
    setCEP(address.CEP);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meus Endereços</h2>
          <p className="text-gray-600">Gerencie seus endereços de entrega</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Adicionar Endereço</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editedAddress ? 'Editar Endereço' : 'Novo Endereço'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={cep}
                  onChange={handleChange}
                  maxLength={9}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                />
                {invalidCep && (
                  <p className="mt-1 text-sm text-red-600">CEP inválido. Verifique o formato.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  value={addressInfo.DESCRICAO}
                  onChange={(e) => setAddressInfo({ ...addressInfo, DESCRICAO: e.target.value })}
                  placeholder="Casa, Trabalho, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rua
              </label>
              <input
                type="text"
                value={addressInfo.RUA}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="number"
                  value={addressInfo.NUMERO}
                  onChange={(e) => setAddressInfo({ ...addressInfo, NUMERO: e.target.value })}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={addressInfo.BAIRRO}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={addressInfo.CIDADE}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                value={addressInfo.COMPLEMENTO}
                onChange={(e) => setAddressInfo({ ...addressInfo, COMPLEMENTO: e.target.value })}
                placeholder="Apto 201, Bloco A, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Salvando...' : editedAddress ? 'Atualizar' : 'Adicionar'}
              </button>
              
              {editedAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedAddress(null);
                    setAddressInfo({
                      CODPES: addressInfo.CODPES,
                      CODEND: "",
                      CEP: "",
                      RUA: "",
                      BAIRRO: "",
                      CIDADE: "",
                      COMPLEMENTO: "",
                      NUMERO: "",
                      DESCRICAO: "",
                    });
                    setCEP("");
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum endereço cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo endereço de entrega.</p>
          </div>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{address.DESCRICAO}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {address.CEP}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {address.RUA}, {address.NUMERO}
                    {address.COMPLEMENTO && `, ${address.COMPLEMENTO}`}
                  </p>
                  <p className="text-gray-600">
                    {address.BAIRRO}, {address.CIDADE}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(address.CODEND)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
};
export default Address;
