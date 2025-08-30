import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productService, orderService } from '../../services/api';
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

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }
    loadMetrics();
  }, [user]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders()
      ]);

      const products = productsResponse.data;
      const orders = ordersResponse.data;

      const totalRevenue = orders.reduce((sum, order) => sum + (order.VALORTOTAL || 0), 0);

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
                  <div className="text-center py-8">
                    <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Gerenciamento de Pedidos
                    </h3>
                    <p className="text-gray-500">
                      Funcionalidade em desenvolvimento
                    </p>
                  </div>
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