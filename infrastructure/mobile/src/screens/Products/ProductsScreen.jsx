import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteProducts } from '../../hooks/useInfiniteProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';

const ProductsScreen = () => {
  const { products, loading, loadingMore, error, hasMore, loadMore, allProductsCount } = useInfiniteProducts();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.title}>Todos os Produtos</Text>
        <Text style={styles.subtitle}>
          Explore nossa seleção completa de {allProductsCount > 0 ? `${allProductsCount} produtos` : 'produtos'}
        </Text>
      </View>

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onEndReached={hasMore ? loadMore : null}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    padding: spacing.lg,
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
});

export default ProductsScreen;

