import React from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { FiPackage, FiShoppingCart, FiDollarSign, FiRefreshCw } from 'react-icons/fi';

const MetricsOverview = ({ metrics, onRefresh }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const metricCards = [
    {
      title: 'Total de Produtos',
      value: metrics.totalProducts,
      icon: FiPackage,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      formatter: (value) => value
    },
    {
      title: 'Total de Pedidos',
      value: metrics.totalOrders,
      icon: FiShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      formatter: (value) => value
    },
    {
      title: 'Receita Total',
      value: metrics.totalRevenue,
      icon: FiDollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      formatter: (value) => formatCurrency(value || 0)
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Métricas Gerais</h2>
        <Button
          variant="outline"
          size="small"
          onClick={onRefresh}
          className="flex items-center"
        >
          <FiRefreshCw className="mr-2" size={16} />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.bgColor} mr-4`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.formatter ? metric.formatter(metric.value) : metric.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pedidos Recentes
          </h3>
          <p className="text-gray-600">
            Últimos 5 pedidos realizados
          </p>
        </div>

        {metrics.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.VALORTOTAL || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Concluído
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MetricsOverview;