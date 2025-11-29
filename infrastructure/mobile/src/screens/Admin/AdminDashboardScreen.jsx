import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { productService, orderService } from '../../services/api';
import { colors, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MetricsOverviewScreen from './MetricsOverviewScreen';
import ProductManagementScreen from './ProductManagementScreen';
import OrderManagementScreen from './OrderManagementScreen';

const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders(),
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
        recentOrders: ordersData.slice(0, 10),
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do painel administrativo');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed-outline" size={64} color={colors.gray400} />
        <Text style={styles.errorText}>Acesso negado</Text>
        <Text style={styles.errorSubtext}>
          Você não tem permissão para acessar esta área
        </Text>
      </View>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'stats-chart-outline' },
    { id: 'products', label: 'Produtos', icon: 'cube-outline' },
    { id: 'orders', label: 'Pedidos', icon: 'cart-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>Gerencie sua loja de forma eficiente</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? colors.black : colors.gray500}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
        </View>
      ) : (
        <>
          {activeTab === 'overview' && (
            <MetricsOverviewScreen
              metrics={metrics}
              products={products}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'products' && (
            <ProductManagementScreen onProductChange={loadData} />
          )}

          {activeTab === 'orders' && (
            <OrderManagementScreen
              orders={orders}
              onOrdersChange={loadData}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.gray50,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.black,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray500,
  },
  tabLabelActive: {
    color: colors.black,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboardScreen;
