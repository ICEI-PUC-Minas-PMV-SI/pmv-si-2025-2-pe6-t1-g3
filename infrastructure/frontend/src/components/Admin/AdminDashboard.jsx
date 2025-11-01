import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { productService, orderService } from '../../services/api';
import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import { FiPackage, FiShoppingCart, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import ProductManagement from './ProductManagement';
import MetricsOverview from './MetricsOverview';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editProduct, setEditProduct] = useState(null);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }
    loadData();
  }, [user]);

  useEffect(() => {
    // Verifica se há estado de navegação para abrir o formulário de edição
    if (location.state?.editProduct && location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setEditProduct(location.state.editProduct);
      // Limpa o estado da navegação para evitar que abra novamente
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    // Limpa o produto de edição quando mudar de aba para evitar que abra novamente
    if (activeTab !== 'products') {
      setEditProduct(null);
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders()
      ]);

      const productsData = productsResponse.data;
      const ordersData = ordersResponse.data;

      setProducts(productsData);
      setOrders(ordersData);

      const totalRevenue = ordersData.reduce((sum, order) => {
        const orderTotal = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0);
        return sum + (Number.isNaN(orderTotal) ? 0 : orderTotal);
      }, 0);

      setMetrics({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        recentOrders: ordersData.slice(0, 10)
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
    { id: 'overview', label: 'Dashboard', icon: FiTrendingUp },
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
            Gerencie sua loja de forma eficiente
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
              <MetricsOverview
                metrics={metrics}
                products={products}
                onRefresh={loadData}
              />
            )}

            {activeTab === 'products' && (
              <ProductManagement 
                onProductChange={loadData}
                initialProductToEdit={editProduct}
              />
            )}

            {activeTab === 'orders' && (
              <OrderManagement
                orders={orders}
                onOrdersChange={loadData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
