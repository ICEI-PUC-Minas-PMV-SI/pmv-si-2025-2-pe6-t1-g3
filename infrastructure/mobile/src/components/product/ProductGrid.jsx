import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from './ProductCard';
import { colors, spacing } from '../../theme';
import Button from '../common/Button';

const ProductGrid = ({ products, loading, error, onEndReached, onEndReachedThreshold = 0.5, refetch, variant }) => {
  if (loading && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.red600} />
        <Text style={styles.errorTitle}>Erro ao carregar produtos</Text>
        <Text style={styles.errorText}>{error}</Text>
        {refetch && (
          <Button
            variant="primary"
            onPress={refetch}
            style={styles.retryButton}
          >
            Tentar novamente
          </Button>
        )}
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cube-outline" size={48} color={colors.gray400} />
        <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        {refetch && (
          <Button
            variant="outline"
            onPress={refetch}
            style={styles.retryButton}
          >
            Recarregar
          </Button>
        )}
      </View>
    );
  }

  // If inside ScrollView, render directly instead of using FlatList
  if (onEndReached === undefined) {
    const isDashboard = variant === 'dashboard';
    return (
      <View style={[styles.gridContainer, isDashboard && styles.gridContainerDashboard]}>
        {products.map((product, index) => (
          <View
            key={product.CODPROD.toString()}
            style={[
              styles.productWrapper,
              isDashboard && styles.productWrapperDashboard,
              !isDashboard && (index % 2 === 0 ? styles.productLeft : styles.productRight),
            ]}
          >
            <ProductCard product={product} variant={variant} />
          </View>
        ))}
        {loading && products.length > 0 && (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.black} />
          </View>
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} variant={variant} />}
      keyExtractor={(item) => item.CODPROD.toString()}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={
        loading && products.length > 0 ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.black} />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.red600,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  gridContainerDashboard: {
    padding: spacing.md,
  },
  productWrapper: {
    width: '48%',
    marginBottom: spacing.sm,
  },
  productWrapperDashboard: {
    width: '100%',
    marginBottom: spacing.md,
  },
  productLeft: {
    marginRight: '2%',
  },
  productRight: {
    marginLeft: '2%',
  },
  list: {
    padding: spacing.sm,
  },
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
});

export default ProductGrid;

