import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { colors, spacing } from '../../theme';
import PropTypes from 'prop-types';

const MetricsOverviewScreen = ({ metrics, products, onRefresh }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const lowStockProducts = useMemo(() => {
    return products?.filter((p) => p.ESTOQUE < 10) || [];
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products?.filter((p) => p.ESTOQUE === 0) || [];
  }, [products]);

  const topSellingProducts = useMemo(() => {
    const productSales = {};

    metrics.recentOrders?.forEach((order) => {
      order.ITENSPEDIDO?.forEach((item) => {
        const prodId = item.CODPROD;
        if (!productSales[prodId]) {
          productSales[prodId] = {
            product: item.Produtos,
            quantity: 0,
            revenue: 0,
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
      icon: 'cash-outline',
      color: colors.success,
      bgColor: '#D1FAE5',
      formatter: formatCurrency,
    },
    {
      title: 'Total de Pedidos',
      value: metrics.totalOrders,
      icon: 'cart-outline',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      title: 'Total de Produtos',
      value: metrics.totalProducts,
      icon: 'cube-outline',
      color: '#A855F7',
      bgColor: '#E9D5FF',
    },
    {
      title: 'Ticket Médio',
      value: averageOrderValue,
      icon: 'trending-up-outline',
      color: '#F59E0B',
      bgColor: '#FFEDD5',
      formatter: formatCurrency,
    },
    {
      title: 'Produtos em Falta',
      value: outOfStockProducts.length,
      icon: 'alert-circle-outline',
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
    {
      title: 'Estoque Baixo',
      value: lowStockProducts.length,
      icon: 'warning-outline',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.metricsGrid}>
          {metricCards.map((metric, index) => (
            <Card key={index} style={styles.metricCard}>
              <View style={styles.metricContent}>
                <View style={styles.metricText}>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <Text style={styles.metricValue}>
                    {metric.formatter ? metric.formatter(metric.value) : metric.value}
                  </Text>
                </View>
                <View style={[styles.metricIcon, { backgroundColor: metric.bgColor }]}>
                  <Ionicons name={metric.icon} size={24} color={metric.color} />
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Produtos Mais Vendidos</Text>
          {topSellingProducts.length > 0 ? (
            <View style={styles.productList}>
              {topSellingProducts.map((item, index) => (
                <View key={index} style={styles.productItem}>
                  <Image
                    source={{ uri: item.product?.IMAGEM }}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.product?.PRODUTO}
                    </Text>
                    <Text style={styles.productQuantity}>
                      {item.quantity} unidades vendidas
                    </Text>
                  </View>
                  <Text style={styles.productRevenue}>
                    {formatCurrency(item.revenue)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Nenhuma venda registrada</Text>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas de Estoque</Text>
          {outOfStockProducts.length > 0 && (
            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Ionicons name="alert-circle-outline" size={20} color="#991B1B" />
                <Text style={styles.alertTitle}>
                  Produtos Esgotados ({outOfStockProducts.length})
                </Text>
              </View>
              {outOfStockProducts.slice(0, 5).map((product) => (
                <Text key={product.CODPROD} style={styles.alertText}>
                  • {product.PRODUTO}
                </Text>
              ))}
            </View>
          )}
          {lowStockProducts.length > 0 && (
            <View style={[styles.alertCard, { backgroundColor: '#FEF3C7', borderColor: '#FDE047' }]}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning-outline" size={20} color="#92400E" />
                <Text style={[styles.alertTitle, { color: '#92400E' }]}>
                  Estoque Baixo ({lowStockProducts.length})
                </Text>
              </View>
              {lowStockProducts.slice(0, 5).map((product) => (
                <View key={product.CODPROD} style={styles.alertRow}>
                  <Text style={[styles.alertText, { color: '#92400E' }]}>
                    • {product.PRODUTO}
                  </Text>
                  <Text style={[styles.alertText, { color: '#92400E', fontWeight: '600' }]}>
                    {product.ESTOQUE} un.
                  </Text>
                </View>
              ))}
            </View>
          )}
          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
            <Text style={styles.emptyText}>Todos os produtos com estoque adequado</Text>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Pedidos Recentes</Text>
          {metrics.recentOrders?.length > 0 ? (
            <View style={styles.orderList}>
              {metrics.recentOrders.map((order) => (
                <View key={order.CODPED} style={styles.orderItem}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>#{order.CODPED}</Text>
                    <Text style={styles.orderValue}>
                      {formatCurrency(order.VALORTOTAL || 0)}
                    </Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderDate}>
                      {formatDate(order.DATAINC)}
                    </Text>
                    <Text style={styles.orderClient}>
                      {order.PESSOA ? `${order.PESSOA.NOME} ${order.PESSOA.SOBRENOME}` : '-'}
                    </Text>
                    <Text style={styles.orderItems}>
                      {order.ITENSPEDIDO?.length || 0} itens
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

MetricsOverviewScreen.propTypes = {
  metrics: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    padding: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
  },
  metricContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricText: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
  },
  metricIcon: {
    padding: spacing.sm,
    borderRadius: 8,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  productList: {
    gap: spacing.sm,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
    color: colors.gray500,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginLeft: spacing.xs,
  },
  alertText: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  orderList: {
    gap: spacing.sm,
  },
  orderItem: {
    padding: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
  },
  orderDetails: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray600,
  },
  orderClient: {
    fontSize: 12,
    color: colors.gray600,
  },
  orderItems: {
    fontSize: 12,
    color: colors.gray600,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});

export default MetricsOverviewScreen;
