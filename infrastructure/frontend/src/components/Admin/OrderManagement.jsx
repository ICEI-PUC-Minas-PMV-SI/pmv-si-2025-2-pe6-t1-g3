import React, { useState, useMemo } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { FiShoppingCart, FiEye, FiRefreshCw } from 'react-icons/fi';
import { orderService } from '../../services/api';

const OrderManagement = ({ orders, onOrdersChange }) => {
  const [filters, setFilters] = useState({
    orderId: '',
    status: '',
    orderDate: '',
    exactValue: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'PENDENTE', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMADO', label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
    { value: 'EM_PREPARACAO', label: 'Em Preparação', color: 'bg-purple-100 text-purple-800' },
    { value: 'ENVIADO', label: 'Enviado', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'ENTREGUE', label: 'Entregue', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ];

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj?.label || status;
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const orderIdMatch = filters.orderId
        ? String(order.CODPED ?? '').includes(filters.orderId.trim())
        : true;

      const statusMatch = filters.status
        ? (order.STATUS || 'PENDENTE').toUpperCase() === filters.status
        : true;

      const orderDateRaw = order.DATAINC || order.DATA || order.createdAt;
      const orderDate = orderDateRaw ? new Date(orderDateRaw) : null;

      const dateMatch = filters.orderDate && orderDate
        ? orderDate.toISOString().split('T')[0] === filters.orderDate
        : true;

      const totalValue = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0) || 0;

      const exactValueMatch = filters.exactValue !== ''
        ? totalValue === Number(filters.exactValue)
        : true;

      return orderIdMatch && statusMatch && dateMatch && exactValueMatch;
    });
  }, [orders, filters]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));

  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      orderId: '',
      status: '',
      orderDate: '',
      exactValue: ''
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await orderService.updateOrder({ CODPED: orderId, STATUS: newStatus });
      onOrdersChange?.();
      setSelectedOrder(null);
    } catch (error) {
      alert('Erro ao atualizar status do pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Pedidos</h3>
              <p className="text-sm text-gray-600">Total de {filteredOrders.length} pedidos</p>
            </div>
            <div className="mt-4 lg:mt-0 space-x-2">
              <Button variant="outline" onClick={onOrdersChange}>
                <FiRefreshCw className="mr-2" size={14} />
                Atualizar
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Pedido</label>
              <input
                type="text"
                value={filters.orderId}
                onChange={(e) => handleFilterChange('orderId', e.target.value)}
                placeholder="Buscar por número"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data do pedido</label>
              <input
                type="date"
                value={filters.orderDate}
                onChange={(e) => handleFilterChange('orderDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor do pedido</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.exactValue}
                onChange={(e) => handleFilterChange('exactValue', e.target.value)}
                placeholder="Ex: 1299.99"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        {currentOrders.length === 0 ? (
          <div className="text-center py-10">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou aguarde novos pedidos</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => {
                    const totalValue = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0) || 0;
                    const itemsCount = order.ITENSPEDIDO?.length || 0;
                    const clientName = order.PESSOA ? `${order.PESSOA.NOME} ${order.PESSOA.SOBRENOME}` : '-';
                    const currentStatus = order.STATUS || 'PENDENTE';

                    return (
                      <tr key={order.CODPED} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.CODPED}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.DATAINC || order.DATA)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div>
                            <div className="font-medium text-gray-900">{clientName}</div>
                            {order.PESSOA?.TELEFONE && (
                              <div className="text-xs text-gray-500">{order.PESSOA.TELEFONE}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(totalValue)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {itemsCount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
                            {getStatusLabel(currentStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <FiEye size={14} className="mr-1" />
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Exibindo {currentOrders.length} de {filteredOrders.length} pedidos
              </p>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pedido #{selectedOrder.CODPED}</h2>
                  <p className="text-sm text-gray-500">Data: {formatDate(selectedOrder.DATAINC)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedOrder.PESSOA ? `${selectedOrder.PESSOA.NOME} ${selectedOrder.PESSOA.SOBRENOME}` : '-'}
                    </p>
                    {selectedOrder.PESSOA?.CPF && (
                      <p className="text-sm text-gray-600">CPF: {selectedOrder.PESSOA.CPF}</p>
                    )}
                    {selectedOrder.PESSOA?.TELEFONE && (
                      <p className="text-sm text-gray-600">Tel: {selectedOrder.PESSOA.TELEFONE}</p>
                    )}
                  </div>
                </div>

                {selectedOrder.ENDERECO && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Endereço de Entrega</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {selectedOrder.ENDERECO.RUA}, {selectedOrder.ENDERECO.NUMERO}
                      </p>
                      {selectedOrder.ENDERECO.COMPLEMENTO && (
                        <p className="text-sm text-gray-600">{selectedOrder.ENDERECO.COMPLEMENTO}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {selectedOrder.ENDERECO.BAIRRO} - {selectedOrder.ENDERECO.CIDADE}
                      </p>
                      <p className="text-sm text-gray-600">CEP: {selectedOrder.ENDERECO.CEP}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Itens do Pedido</h3>
                  <div className="space-y-2">
                    {selectedOrder.ITENSPEDIDO?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <img
                            src={item.Produtos?.IMAGEM}
                            alt={item.Produtos?.PRODUTO}
                            className="w-12 h-12 rounded object-cover"
                            onError={(e) => e.target.src = '/api/placeholder/48/48'}
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{item.Produtos?.PRODUTO}</p>
                            <p className="text-xs text-gray-500">
                              Qtd: {item.QTD} {item.TAMANHO ? `| Tam: ${item.TAMANHO}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency((item.Produtos?.VALOR || 0) * (item.QTD || 0))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.SUBTOTAL || 0)}</span>
                    </div>
                    {selectedOrder.DESCONTO > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desconto</span>
                        <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.DESCONTO || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frete</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.FRETE || 0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.VALORTOTAL || 0)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Atualizar Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.slice(1).map((status) => (
                      <button
                        key={status.value}
                        onClick={() => handleStatusUpdate(selectedOrder.CODPED, status.value)}
                        disabled={updatingStatus || selectedOrder.STATUS === status.value}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedOrder.STATUS === status.value
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
