import React, { useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../contexts/AuthContext';
import { productService, orderService2 } from '../../services/api';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FiPlus, FiPackage, FiShoppingCart, FiTrendingUp, FiUsers } from 'react-icons/fi';
import ProductManagement from './ProductManagement';
import MetricsOverview from './MetricsOverview';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [ordersData, setOrdersData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    orderId: '',
    status: '',
    orderDate: '',
    exactValue: ''
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }
    loadMetrics();
  }, [user]);

  useEffect(() => {
    if (!ordersData.length) {
      setFilteredOrders([]);
      setCurrentPage(1);
      return;
    }

    const result = ordersData.filter((order) => {
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

      return (
        orderIdMatch &&
        statusMatch &&
        dateMatch &&
        exactValueMatch
      );
    });

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [ordersData, filters]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const decodedToken = jwtDecode(token);
      const codpes = decodedToken?.CODPES;

      if (!codpes) {
        throw new Error('Token inválido: CODPES não informado');
      }

      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getProducts(),
        orderService2.getOrdersByUser(codpes)
      ]);

      const products = productsResponse.data;
      const orders = ordersResponse.data;

      setOrdersData(Array.isArray(orders) ? orders : []);

      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0);
        return sum + (Number.isNaN(orderTotal) ? 0 : orderTotal);
      }, 0);

      setMetrics({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      orderId: '',
      status: '',
      orderDate: '',
      exactValue: ''
    });
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(
    1,
    Math.ceil((filteredOrders.length || ordersData.length) / ITEMS_PER_PAGE)
  );

  const currentOrders = useMemo(() => {
    const hasActiveFilters =
      filters.orderId ||
      filters.status ||
      filters.orderDate ||
      filters.exactValue;

    const source = hasActiveFilters ? filteredOrders : ordersData;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return source.slice(startIndex, endIndex);
  }, [currentPage, filteredOrders, ordersData, filters]);

  const availableStatuses = useMemo(() => {
    const statusSet = new Set(
      ordersData
        .map((order) => (order.STATUS || 'PENDENTE').toUpperCase())
        .filter(Boolean)
    );

    ['PENDENTE', 'CONFIRMADO', 'EM_PREPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'].forEach((status) => statusSet.add(status));

    return Array.from(statusSet.values());
  }, [ordersData]);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('pt-BR');
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FiTrendingUp },
    { id: 'products', label: 'Produtos', icon: FiPackage },
    { id: 'orders', label: 'Pedidos', icon: FiShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie produtos, pedidos e visualize métricas
          </p>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <MetricsOverview metrics={metrics} onRefresh={loadMetrics} />
            )}
            
            {activeTab === 'products' && (
              <ProductManagement onProductChange={loadMetrics} />
            )}
            
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <Card>
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Gerenciamento de Pedidos
                        </h3>
                        <p className="text-sm text-gray-600">
                          Acompanhe e filtre pedidos finalizados pelos clientes
                        </p>
                      </div>
                      <div className="mt-4 lg:mt-0 space-x-2">
                        <Button variant="outline" onClick={loadMetrics}>
                          Atualizar Lista
                        </Button>
                        <Button variant="outline" onClick={handleResetFilters}>
                          Limpar Filtros
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Pedido</label>
                        <input
                          type="text"
                          value={filters.orderId}
                          onChange={(event) => handleFilterChange('orderId', event.target.value)}
                          placeholder="Buscar por número"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filters.status}
                          onChange={(event) => handleFilterChange('status', event.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        >
                          <option value="">Todos os status</option>
                          {availableStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor exato do pedido (R$)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={filters.exactValue}
                          onChange={(event) => handleFilterChange('exactValue', event.target.value)}
                          placeholder="Ex: 1299.99"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do pedido</label>
                        <input
                          type="date"
                          value={filters.orderDate}
                          onChange={(event) => handleFilterChange('orderDate', event.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  {ordersData.length === 0 ? (
                    <div className="text-center py-10">
                      <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum pedido encontrado
                      </h3>
                      <p className="text-gray-500">
                        Assim que os clientes finalizarem compras, os pedidos aparecerão aqui.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => {
                              const totalValue = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0) || 0;
                              const itemsCount = order.ITENSPEDIDO?.length || order.ITENS?.length || 0;

                              return (
                                <tr key={order.CODPED} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.CODPED}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.DATAINC || order.DATA || order.createdAt)}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(totalValue)}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                      Concluído
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{itemsCount}</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.CODPES || '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Exibindo {currentOrders.length} de {filteredOrders.length || ordersData.length} pedidos
                        </p>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>

                          {Array.from({ length: totalPages }, (_, index) => index + 1)
                            .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;