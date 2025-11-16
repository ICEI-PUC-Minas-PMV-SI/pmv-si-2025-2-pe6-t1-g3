import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteProducts } from '../../hooks/useInfiniteProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';
import { mapCategoryToBackend } from '../../utils/categoryMapper';
import Button from '../../components/common/Button';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categorySlug } = route.params || {};

  const backendCategory = useMemo(() => {
    if (!categorySlug) return null;
    const key = String(categorySlug).toLowerCase();
    return mapCategoryToBackend(key);
  }, [categorySlug]);

  const heading = useMemo(() => {
    if (!categorySlug) return '';
    const map = {
      eletronicos: 'Eletrônicos',
      fashion: 'Fashion',
      casa: 'Casa',
      esportes: 'Esportes',
    };
    return map[String(categorySlug).toLowerCase()] || 'Categoria';
  }, [categorySlug]);

  const { products, loading, loadingMore, error, hasMore, loadMore, allProductsCount } = useInfiniteProducts(
    backendCategory ? { CATEGORIA: backendCategory } : {}
  );

  if (!backendCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.gray400} />
          <Text style={styles.errorTitle}>Categoria não encontrada</Text>
          <Text style={styles.errorText}>
            A categoria solicitada não existe. Verifique o link ou explore nossas categorias.
          </Text>
          <Button
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Voltar para a Home
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{heading}</Text>
        <Text style={styles.subtitle}>
          Explore os melhores produtos de {heading.toLowerCase()}.
          {allProductsCount > 0 && ` ${allProductsCount} produto${allProductsCount !== 1 ? 's' : ''} disponível${allProductsCount !== 1 ? 'eis' : ''}`}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    marginTop: spacing.md,
  },
});

export default CategoryScreen;

