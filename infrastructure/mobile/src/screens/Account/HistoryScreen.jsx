import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { orderService2 } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { colors, spacing } from '../../theme';
import Toast from 'react-native-toast-message';
import SecureStore from '../../services/secureStore';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const response = await orderService2.getOrdersByUser(decodedToken.CODPES);
        const userPedidos = response.data;
        setPedidos(userPedidos || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar pedidos',
        text2: 'Tente mais tarde',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status = 'Pendente') => {
    const statusConfig = {
      'Pendente': { color: colors.warning, bg: '#FFF7ED' },
      'Confirmado': { color: colors.info, bg: '#EFF6FF' },
      'Em Preparação': { color: colors.info, bg: '#EFF6FF' },
      'Processando': { color: colors.warning, bg: '#FFF7ED' },
      'Enviado': { color: colors.info, bg: '#EFF6FF' },
      'Entregue': { color: colors.success, bg: '#F0FDF4' },
      'Cancelado': { color: colors.error, bg: '#FEF2F2' },
    };
    
    return statusConfig[status] || statusConfig['Pendente'];
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Pedidos</Text>
          <Text style={styles.subtitle}>Acompanhe o histórico dos seus pedidos</Text>
        </View>

        {pedidos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={colors.gray400} />
            <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptySubtext}>Você ainda não fez nenhum pedido.</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Products', { screen: 'ProductsList' })}
              activeOpacity={0.7}
            >
              <Text style={styles.shopButtonText}>Começar a Comprar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {pedidos.map((pedido) => {
              const statusConfig = getStatusBadge(pedido.STATUS);
              const total = Number(pedido.VALORTOTAL || pedido.VALOR_TOTAL) || 0;
              const orderDate = pedido.DATAINC || pedido.DATA_PEDIDO || pedido.DATA;
              
              const orderItems = pedido.ITENSPEDIDO || pedido.ITENS || [];

              return (
                <View key={pedido.CODPED} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>Pedido #{pedido.CODPED}</Text>
                      <Text style={styles.orderDate}>{formatDate(orderDate)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                      <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {pedido.STATUS || 'Pendente'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderItems}>
                    {orderItems.length > 0 ? (
                      orderItems.map((item, index) => {
                        const product = item.Produtos || item.PRODUTO || item.produto || {};
                        const productName = product.PRODUTO || product.produto || 'Produto';
                        const quantity = item.QTD || item.QUANTIDADE || item.quantidade || item.qtd || 1;

                        return (
                          <View key={index} style={styles.orderItem}>
                            <Text style={styles.itemName}>
                              {productName} x{quantity}
                            </Text>
                            {item.TAMANHO && (
                              <Text style={styles.itemSize}>Tamanho: {item.TAMANHO}</Text>
                            )}
                          </View>
                        );
                      })
                    ) : (
                      <Text style={styles.noItems}>Nenhum item encontrado</Text>
                    )}
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
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
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.gray600,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  shopButton: {
    backgroundColor: colors.black,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  shopButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  ordersContainer: {
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: 12,
    color: colors.gray600,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  orderItem: {
    marginBottom: spacing.sm,
  },
  itemName: {
    fontSize: 14,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  itemSize: {
    fontSize: 12,
    color: colors.gray500,
  },
  noItems: {
    fontSize: 14,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
  },
});

export default HistoryScreen;

