import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { orderService } from '../../services/api';
import { colors, spacing } from '../../theme';
import PropTypes from 'prop-types';

const OrderManagementScreen = ({ orders, onOrdersChange }) => {
  const [filters, setFilters] = useState({
    orderId: '',
    status: '',
    orderDate: '',
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos os status', variant: 'default' },
    { value: 'PENDENTE', label: 'Pendente', variant: 'warning' },
    { value: 'CONFIRMADO', label: 'Confirmado', variant: 'info' },
    { value: 'EM_PREPARACAO', label: 'Em Preparação', variant: 'purple' },
    { value: 'ENVIADO', label: 'Enviado', variant: 'info' },
    { value: 'ENTREGUE', label: 'Entregue', variant: 'success' },
    { value: 'CANCELADO', label: 'Cancelado', variant: 'error' },
  ];

  const getStatusVariant = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    return statusObj?.variant || 'default';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find((s) => s.value === status);
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

      const dateMatch =
        filters.orderDate && orderDate
          ? orderDate.toISOString().split('T')[0] === filters.orderDate
          : true;

      return orderIdMatch && statusMatch && dateMatch;
    });
  }, [orders, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      orderId: '',
      status: '',
      orderDate: '',
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await orderService.updateOrder({ CODPED: orderId, STATUS: newStatus });
      Alert.alert('Sucesso', 'Status do pedido atualizado com sucesso!');
      onOrdersChange?.();
      setSelectedOrder(null);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar status do pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
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
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.filtersCard}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>
                Total de {filteredOrders.length} pedidos
              </Text>
              <Button variant="outline" size="small" onPress={handleResetFilters}>
                Limpar Filtros
              </Button>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Número do Pedido"
              value={filters.orderId}
              onChangeText={(value) => handleFilterChange('orderId', value)}
              keyboardType="numeric"
            />

            <View style={styles.filterRow}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Status</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => handleFilterChange('status', '')}
                  >
                    <Text style={styles.pickerText}>
                      {filters.status
                        ? getStatusLabel(filters.status)
                        : 'Todos os status'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>

          {filteredOrders.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Ionicons name="cart-outline" size={48} color={colors.gray400} />
              <Text style={styles.emptyTitle}>Nenhum pedido encontrado</Text>
              <Text style={styles.emptyText}>
                Tente ajustar os filtros ou aguarde novos pedidos
              </Text>
            </Card>
          ) : (
            <View style={styles.ordersList}>
              {filteredOrders.map((order) => {
                const totalValue = Number(order.VALORTOTAL ?? order.SUBTOTAL ?? 0) || 0;
                const itemsCount = order.ITENSPEDIDO?.length || 0;
                const clientName = order.PESSOA
                  ? `${order.PESSOA.NOME} ${order.PESSOA.SOBRENOME}`
                  : '-';
                const currentStatus = order.STATUS || 'PENDENTE';

                return (
                  <Card key={order.CODPED} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>#{order.CODPED}</Text>
                      <Badge variant={getStatusVariant(currentStatus)}>
                        {getStatusLabel(currentStatus)}
                      </Badge>
                    </View>

                    <View style={styles.orderInfo}>
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={16} color={colors.gray600} />
                        <Text style={styles.infoText}>
                          {formatDate(order.DATAINC || order.DATA)}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={16} color={colors.gray600} />
                        <Text style={styles.infoText}>{clientName}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="cube-outline" size={16} color={colors.gray600} />
                        <Text style={styles.infoText}>{itemsCount} itens</Text>
                      </View>
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderTotal}>{formatCurrency(totalValue)}</Text>
                      <Button
                        variant="outline"
                        size="small"
                        onPress={() => setSelectedOrder(order)}
                      >
                        <Ionicons name="eye-outline" size={14} color={colors.black} />
                        <Text style={styles.detailsButtonText}> Detalhes</Text>
                      </Button>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {selectedOrder && (
        <Modal
          visible={!!selectedOrder}
          animationType="slide"
          onRequestClose={() => setSelectedOrder(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Pedido #{selectedOrder.CODPED}</Text>
                <Text style={styles.modalSubtitle}>
                  Data: {formatDate(selectedOrder.DATAINC)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Ionicons name="close" size={24} color={colors.gray700} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Card style={styles.detailCard}>
                <Text style={styles.detailTitle}>Cliente</Text>
                <Text style={styles.detailText}>
                  {selectedOrder.PESSOA
                    ? `${selectedOrder.PESSOA.NOME} ${selectedOrder.PESSOA.SOBRENOME}`
                    : '-'}
                </Text>
                {selectedOrder.PESSOA?.CPF && (
                  <Text style={styles.detailTextSmall}>CPF: {selectedOrder.PESSOA.CPF}</Text>
                )}
                {selectedOrder.PESSOA?.TELEFONE && (
                  <Text style={styles.detailTextSmall}>
                    Tel: {selectedOrder.PESSOA.TELEFONE}
                  </Text>
                )}
              </Card>

              {selectedOrder.ENDERECO && (
                <Card style={styles.detailCard}>
                  <Text style={styles.detailTitle}>Endereço de Entrega</Text>
                  <Text style={styles.detailText}>
                    {selectedOrder.ENDERECO.RUA}, {selectedOrder.ENDERECO.NUMERO}
                  </Text>
                  {selectedOrder.ENDERECO.COMPLEMENTO && (
                    <Text style={styles.detailTextSmall}>
                      {selectedOrder.ENDERECO.COMPLEMENTO}
                    </Text>
                  )}
                  <Text style={styles.detailTextSmall}>
                    {selectedOrder.ENDERECO.BAIRRO} - {selectedOrder.ENDERECO.CIDADE}
                  </Text>
                  <Text style={styles.detailTextSmall}>CEP: {selectedOrder.ENDERECO.CEP}</Text>
                </Card>
              )}

              <Card style={styles.detailCard}>
                <Text style={styles.detailTitle}>Itens do Pedido</Text>
                <View style={styles.itemsList}>
                  {selectedOrder.ITENSPEDIDO?.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                      <Image
                        source={{ uri: item.Produtos?.IMAGEM }}
                        style={styles.itemImage}
                      />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.Produtos?.PRODUTO}</Text>
                        <Text style={styles.itemMeta}>
                          Qtd: {item.QTD}
                          {item.TAMANHO ? ` | Tam: ${item.TAMANHO}` : ''}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        {formatCurrency((item.Produtos?.VALOR || 0) * (item.QTD || 0))}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>

              <Card style={styles.detailCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(selectedOrder.SUBTOTAL || 0)}
                  </Text>
                </View>
                {selectedOrder.DESCONTO > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Desconto</Text>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      -{formatCurrency(selectedOrder.DESCONTO || 0)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Frete</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(selectedOrder.FRETE || 0)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(selectedOrder.VALORTOTAL || 0)}
                  </Text>
                </View>
              </Card>

              <Card style={styles.detailCard}>
                <Text style={styles.detailTitle}>Atualizar Status</Text>
                <View style={styles.statusButtons}>
                  {statusOptions.slice(1).map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusButton,
                        selectedOrder.STATUS === status.value && styles.statusButtonActive,
                      ]}
                      onPress={() =>
                        handleStatusUpdate(selectedOrder.CODPED, status.value)
                      }
                      disabled={updatingStatus || selectedOrder.STATUS === status.value}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          selectedOrder.STATUS === status.value &&
                            styles.statusButtonTextActive,
                        ]}
                      >
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

OrderManagementScreen.propTypes = {
  orders: PropTypes.array.isRequired,
  onOrdersChange: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    padding: spacing.md,
  },
  filtersCard: {
    marginBottom: spacing.md,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  input: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  picker: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  pickerButton: {
    padding: spacing.sm,
  },
  pickerText: {
    fontSize: 14,
    color: colors.gray900,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
  },
  ordersList: {
    gap: spacing.sm,
  },
  orderCard: {
    marginBottom: spacing.xs,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  orderInfo: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray600,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.sm,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
  },
  detailsButtonText: {
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  detailCard: {
    marginBottom: spacing.md,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray900,
    marginBottom: 2,
  },
  detailTextSmall: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: 2,
  },
  itemsList: {
    gap: spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: 8,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.gray500,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statusButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  statusButtonActive: {
    backgroundColor: colors.black,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray700,
  },
  statusButtonTextActive: {
    color: colors.white,
  },
});

export default OrderManagementScreen;
