import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';

const SearchResultsScreen = () => {
  const route = useRoute();
  const { query, category } = route.params || {};
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const newFilters = {};
    if (category) {
      newFilters.categoria = category;
    }
    if (searchQuery) {
      newFilters.search = searchQuery;
    }
    setFilters(newFilters);
  }, [category, searchQuery]);

  const { products, loading, error } = useProducts(filters);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.gray500} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.gray400}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
        {category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
      </View>

      <View style={styles.resultsContainer}>
        {loading && products.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>Buscando produtos...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="search-outline" size={48} color={colors.gray400} />
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtext}>
              Tente buscar com outros termos
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsCount}>
              {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </Text>
            <ProductGrid products={products} loading={loading} error={error} />
          </>
        )}
      </View>
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
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.gray900,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'uppercase',
  },
  resultsContainer: {
    flex: 1,
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray600,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.red600,
    textAlign: 'center',
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
  },
  resultsCount: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: spacing.md,
  },
});

export default SearchResultsScreen;

