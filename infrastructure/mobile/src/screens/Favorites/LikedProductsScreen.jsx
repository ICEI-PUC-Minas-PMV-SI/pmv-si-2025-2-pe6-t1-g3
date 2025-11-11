import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../services/storage';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';
import Toast from 'react-native-toast-message';

const LikedProductsScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoritesStr = await storage.getItem('favorites');
      const favoritesList = favoritesStr ? JSON.parse(favoritesStr) : [];
      setFavorites(favoritesList);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar favoritos',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Favoritos</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
          </Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={colors.gray400} />
            <Text style={styles.emptyText}>Nenhum produto favoritado</Text>
            <Text style={styles.emptySubtext}>
              Adicione produtos aos favoritos para encontrá-los facilmente
            </Text>
          </View>
        ) : (
          <ProductGrid products={favorites} loading={false} error={null} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
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
  },
});

export default LikedProductsScreen;

