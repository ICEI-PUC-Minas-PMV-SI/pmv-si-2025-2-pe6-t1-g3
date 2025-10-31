import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { orderService2 } from "../services/api";

const History = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setLoading(true);
        const decodedToken = jwtDecode(token);
        const response = await orderService2.getOrdersByUser(decodedToken.CODPES);
        const userPedidos = response.data;

        setPedidos(userPedidos);
      } catch (error) {
        toast.error("Erro ao buscar pedidos. Tente mais tarde!", {
          autoClose: parseInt(import.meta.env.VITE_TOAST_AUTOCLOSE_DURATION) || 3000
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status = 'Processando') => {
    const statusColors = {
      'Processando': 'bg-yellow-100 text-yellow-800',
      'Enviado': 'bg-blue-100 text-blue-800',
      'Entregue': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || statusColors['Processando'];
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-2 text-gray-600">Carregando pedidos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
        <p className="text-gray-600">Acompanhe o histórico dos seus pedidos</p>
      </div>

      <div className="space-y-6">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pedido encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Você ainda não fez nenhum pedido.</p>
            <div className="mt-6">
              <a
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
              >
                Começar a Comprar
              </a>
            </div>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.CODPED} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{pedido.CODPED}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge('Processando')}`}>
                      Processando
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Feito em</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(pedido.DATAINC)}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Resumo do Pedido</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Subtotal:</dt>
                        <dd className="text-gray-900">{formatCurrency(pedido.SUBTOTAL || 0)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Desconto:</dt>
                        <dd className="text-gray-900">{formatCurrency(pedido.DESCONTO || 0)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Frete:</dt>
                        <dd className="text-gray-900">{formatCurrency(pedido.FRETE || 0)}</dd>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <dt className="font-medium text-gray-900">Total:</dt>
                        <dd className="font-medium text-gray-900">{formatCurrency(pedido.VALORTOTAL || 0)}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Endereço de Entrega</h4>
                    {pedido.ENDERECO ? (
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{pedido.ENDERECO.DESCRICAO}</p>
                        <p>{pedido.ENDERECO.RUA}, {pedido.ENDERECO.NUMERO}</p>
                        {pedido.ENDERECO.COMPLEMENTO && <p>{pedido.ENDERECO.COMPLEMENTO}</p>}
                        <p>{pedido.ENDERECO.BAIRRO}, {pedido.ENDERECO.CIDADE}</p>
                        <p>CEP: {pedido.ENDERECO.CEP}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Endereço não informado</p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {pedido.ITENSPEDIDO && pedido.ITENSPEDIDO.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {pedido.ITENSPEDIDO.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.Produtos?.IMAGEM ? (
                              <img 
                                src={item.Produtos.IMAGEM} 
                                alt={item.Produtos.PRODUTO}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">
                              {item.Produtos?.PRODUTO || 'Produto não encontrado'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.QTD}
                              {item.TAMANHO && ` | Tamanho: ${item.TAMANHO}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Rastrear Pedido
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">
                    Comprar Novamente
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
