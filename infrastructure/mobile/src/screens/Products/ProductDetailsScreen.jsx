import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProduct } from '../../hooks/useProducts';
import { productService } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { colors, spacing } from '../../theme';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';
import { storage } from '../../services/storage';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { product, loading, error } = useProduct(productId);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product) {
      loadFavorite();
    }
  }, [product]);

  const loadFavorite = async () => {
    try {
      const favoritesStr = await storage.getItem('favorites');
      const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
      setIsFavorite(favorites.some(item => item.CODPROD === product.CODPROD));
    } catch (error) {
      console.error('Error loading favorite:', error);
    }
  };

  const hasProductSizes = () => {
    return product?.TAMANHOS && product.TAMANHOS !== null;
  };

  const getSizes = () => {
    if (!hasProductSizes()) {
      return [];
    }
    try {
      return JSON.parse(product.TAMANHOS);
    } catch (error) {
      console.error('Error parsing sizes:', error);
      return [];
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(product?.ESTOQUE || 1, prev + delta)));
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
        });
      } else {
        favorites.push(product);
        await storage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
        Toast.show({
          type: 'success',
          text1: 'Adicionado aos favoritos',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = async () => {
    if (hasProductSizes() && !selectedSize) {
      Alert.alert('Atenção', 'Por favor, selecione um tamanho');
      return;
    }

    const cartItem = {
      CODPROD: product.CODPROD,
      PRODUTO: product.PRODUTO,
      VALOR: product.VALOR,
      IMAGEM: product.IMAGEM,
      quantity: quantity
    };

    if (hasProductSizes() && selectedSize) {
      cartItem.size = selectedSize;
    }

    try {
      await addToCart(cartItem);
      Toast.show({
        type: 'success',
        text1: 'Produto adicionado ao carrinho',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar produto',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Produto não encontrado'}</Text>
        <Button
          variant="primary"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Voltar
        </Button>
      </View>
    );
  }

  const price = Number(product.VALOR) || 0;
  const discount = Number(product.DESCONTO) || 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price - (price * discount / 100) : price;
  const sizes = getSizes();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.IMAGEM }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.red500 : colors.gray400}
          />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.PRODUTO}</Text>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
          {hasDiscount && (
            <Text style={styles.oldPrice}>{formatPrice(product.VALOR)}</Text>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {product.DESCRICAO && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.DESCRICAO}</Text>
          </View>
        )}

        {/* Sizes */}
        {hasProductSizes() && sizes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tamanho</Text>
            <View style={styles.sizesContainer}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantidade</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={20} color={colors.gray900} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
              disabled={quantity >= (product.ESTOQUE || 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={colors.gray900} />
            </TouchableOpacity>
          </View>
          {product.ESTOQUE !== undefined && (
            <Text style={styles.stockText}>
              Estoque: {product.ESTOQUE} unidades
            </Text>
          )}
        </View>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="large"
          onPress={handleAddToCart}
          disabled={product.ESTOQUE === 0}
          style={styles.addToCartButton}
        >
          {product.ESTOQUE === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
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
  errorText: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.gray900,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  backButton: {
    marginTop: spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.gray50,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    padding: spacing.lg,
  },
  productName: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.gray900,
  },
  oldPrice: {
    fontSize: 18,
    color: colors.gray400,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.black,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: colors.gray600,
    lineHeight: 24,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  sizeButtonSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
  },
  sizeTextSelected: {
    color: colors.white,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: spacing.sm,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    minWidth: 40,
    textAlign: 'center',
  },
  stockText: {
    fontSize: 12,
    color: colors.gray500,
  },
  addToCartButton: {
    marginTop: spacing.md,
  },
});

export default ProductDetailsScreen;

