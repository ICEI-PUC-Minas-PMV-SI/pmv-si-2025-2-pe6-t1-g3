import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { colors, spacing } from '../../theme';
import { storage } from '../../services/storage';
import Toast from 'react-native-toast-message';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const favoritesStr = await storage.getItem('favorites');
        const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
        setIsFavorite(favorites.some(item => item.CODPROD === product.CODPROD));
      } catch (error) {
        console.error('Error loading favorite:', error);
      }
    };
    loadFavorite();
  }, [product.CODPROD]);

  const price = Number(product.VALOR) || 0;
  const discount = Number(product.DESCONTO) || 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price - (price * discount / 100) : price;

  const categoryLabel = {
    'FASHION': 'Fashion',
    'ELETRÔNICOS': 'Eletrônicos',
    'CASA': 'Casa',
    'ESPORTES': 'Esportes'
  }[product.CATEGORIAS?.CATEGORIA] || '';

  const hasProductSizes = product.TAMANHOS && product.TAMANHOS !== null;

  const handleQuickAdd = async () => {
    if (hasProductSizes) {
      navigation.navigate('ProductDetails', { productId: product.CODPROD });
      return;
    }

    try {
      await addToCart({
        CODPROD: product.CODPROD,
        PRODUTO: product.PRODUTO,
        VALOR: product.VALOR,
        IMAGEM: product.IMAGEM,
        quantity: 1
      });

      Toast.show({
        type: 'success',
        text1: 'Produto adicionado ao carrinho',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar produto',
        position: 'bottom',
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const favoritesStr = await storage.getItem('favorites');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      
      if (isFavorite) {
        const updated = favorites.filter(item => item.CODPROD !== product.CODPROD);
        await storage.setItem('favorites', JSON.stringify(updated));
        setIsFavorite(false);
        Toast.show({
          type: 'info',
          text1: 'Removido dos favoritos',
          position: 'bottom',
        });
      } else {
        favorites.push(product);
        await storage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
        Toast.show({
          type: 'success',
          text1: 'Adicionado aos favoritos',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePress = () => {
    navigation.navigate('ProductDetails', { productId: product.CODPROD });
  };

  if (imageError) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.IMAGEM }}
            style={styles.image}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />

          {/* Category Badge */}
          {categoryLabel && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryLabel}</Text>
            </View>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleQuickAdd}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={16} color={colors.gray900} />
              <Text style={styles.addButtonText}>
                {hasProductSizes ? 'Ver opções' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? colors.red500 : colors.gray900}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.PRODUTO}
          </Text>

          <View style={styles.footer}>
            {/* Rating */}
            {product.TOTAL_AVALIACOES > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color={colors.warning} />
                <Text style={styles.ratingText}>
                  ({product.TOTAL_AVALIACOES})
                </Text>
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
              {hasDiscount && (
                <Text style={styles.oldPrice}>
                  {formatPrice(product.VALOR)}
                </Text>
              )}
            </View>

            {/* Stock status */}
            {product.ESTOQUE !== undefined && product.ESTOQUE === 0 && (
              <Text style={styles.outOfStock}>Fora de estoque</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.sm,
    maxWidth: '48%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.gray100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray900,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  actionButtons: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 4,
    gap: spacing.xs,
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray900,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: spacing.md,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray900,
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  footer: {
    marginTop: 'auto',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    color: colors.gray500,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
  },
  oldPrice: {
    fontSize: 12,
    color: colors.gray400,
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: 10,
    color: colors.red600,
    marginTop: spacing.xs,
  },
});

export default ProductCard;

