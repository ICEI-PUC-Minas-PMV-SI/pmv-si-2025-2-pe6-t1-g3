import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteProducts } from '../../hooks/useInfiniteProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';
import { mapCategoryToBackend, mapBackendToCategoryName } from '../../utils/categoryMapper';
import Button from '../../components/common/Button';

const CategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categorySlug } = route.params || {};

  // Mapeia o slug da categoria para o valor do backend
  const backendCategory = useMemo(() => {
    if (!categorySlug) return null;
    const key = String(categorySlug).toLowerCase();
    return mapCategoryToBackend(key);
  }, [categorySlug]);

  // Nome da categoria para exibição
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{heading}</Text>
          <Text style={styles.subtitle}>
            Explore os melhores produtos de {heading.toLowerCase()}.
            {allProductsCount > 0 && ` ${allProductsCount} produto${allProductsCount !== 1 ? 's' : ''} disponível${allProductsCount !== 1 ? 'eis' : ''}`}
          </Text>
        </View>
      </View>

      {/* Products */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && products.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.black} />
            <Text style={styles.loadingText}>Carregando produtos...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.red600} />
            <Text style={styles.errorTitle}>Erro ao carregar produtos</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <ProductGrid products={products} loading={false} error={null} />
            
            {hasMore && (
              <View style={styles.loadMoreContainer}>
                <Button
                  variant="primary"
                  onPress={loadMore}
                  disabled={loadingMore}
                  style={styles.loadMoreButton}
                >
                  {loadingMore ? 'Carregando...' : 'Ver mais'}
                </Button>
              </View>
            )}
            
            {!hasMore && products.length > 0 && (
              <View style={styles.endContainer}>
                <Text style={styles.endText}>Todos os produtos foram carregados</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray600,
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
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
  loadMoreContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  loadMoreButton: {
    minWidth: 150,
  },
  endContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  endText: {
    fontSize: 14,
    color: colors.gray500,
  },
});

export default CategoryScreen;

