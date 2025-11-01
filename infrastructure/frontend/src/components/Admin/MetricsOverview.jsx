import React, { useMemo } from 'react';
import Card from '../UI/Card';
import { FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertCircle, FiUsers } from 'react-icons/fi';

const MetricsOverview = ({ metrics, products, onRefresh }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const lowStockProducts = useMemo(() => {
    return products?.filter(p => p.ESTOQUE < 10) || [];
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products?.filter(p => p.ESTOQUE === 0) || [];
  }, [products]);

  const topSellingProducts = useMemo(() => {
    const productSales = {};

    metrics.recentOrders?.forEach(order => {
      order.ITENSPEDIDO?.forEach(item => {
        const prodId = item.CODPROD;
        if (!productSales[prodId]) {
          productSales[prodId] = {
            product: item.Produtos,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[prodId].quantity += item.QTD || 0;
        productSales[prodId].revenue += (item.Produtos?.VALOR || 0) * (item.QTD || 0);
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [metrics.recentOrders]);

  const averageOrderValue = useMemo(() => {
    if (!metrics.totalOrders || metrics.totalOrders === 0) return 0;
    return metrics.totalRevenue / metrics.totalOrders;
  }, [metrics]);

  const metricCards = [
    {
      title: 'Receita Total',
      value: metrics.totalRevenue,
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      formatter: formatCurrency
    },
    {
      title: 'Total de Pedidos',
      value: metrics.totalOrders,
      icon: FiShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Produtos',
      value: metrics.totalProducts,
      icon: FiPackage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ticket Médio',
      value: averageOrderValue,
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      formatter: formatCurrency
    },
    {
      title: 'Produtos em Falta',
      value: outOfStockProducts.length,
      icon: FiAlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Estoque Baixo',
      value: lowStockProducts.length,
      icon: FiAlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.formatter ? metric.formatter(metric.value) : metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
          </div>
          {topSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {topSellingProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-1">
                    <img
                      src={item.product?.IMAGEM}
                      alt={item.product?.PRODUTO}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => e.target.src = '/api/placeholder/48/48'}
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.product?.PRODUTO}</p>
                      <p className="text-xs text-gray-500">{item.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma venda registrada</p>
          )}
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Estoque</h3>
          </div>
          <div className="space-y-3">
            {outOfStockProducts.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiAlertCircle className="text-red-600 mr-2" />
                  <h4 className="text-sm font-semibold text-red-900">Produtos Esgotados ({outOfStockProducts.length})</h4>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {outOfStockProducts.slice(0, 5).map(product => (
                    <p key={product.CODPROD} className="text-xs text-red-700">{product.PRODUTO}</p>
                  ))}
                </div>
              </div>
            )}
            {lowStockProducts.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiAlertCircle className="text-yellow-600 mr-2" />
                  <h4 className="text-sm font-semibold text-yellow-900">Estoque Baixo ({lowStockProducts.length})</h4>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.CODPROD} className="flex justify-between text-xs text-yellow-700">
                      <span>{product.PRODUTO}</span>
                      <span className="font-semibold">{product.ESTOQUE} un.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">Todos os produtos com estoque adequado</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
        </div>
        {metrics.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itens</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.recentOrders.map((order) => (
                  <tr key={order.CODPED} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.CODPED}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.DATAINC)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.PESSOA ? `${order.PESSOA.NOME} ${order.PESSOA.SOBRENOME}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(order.VALORTOTAL || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.ITENSPEDIDO?.length || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum pedido encontrado</p>
        )}
      </Card>
    </div>
  );
};

export default MetricsOverview;
