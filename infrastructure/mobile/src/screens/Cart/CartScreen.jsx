import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { userService, orderService2 } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { colors, spacing } from '../../theme';
import Button from '../../components/common/Button';
import Toast from 'react-native-toast-message';
import { productService } from '../../services/api';
import SecureStore from '../../services/secureStore';
import { storage } from '../../services/storage';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const CartScreen = () => {
  const { cartItems, setCartItems, removeFromCart, updateCartItem } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) {
      Toast.show({
        type: 'info',
        text1: 'Login necessário',
        text2: 'Por favor, faça login para continuar',
      });
      setTimeout(() => {
        navigation.navigate('Auth', { screen: 'Login' });
      }, 2000);
      return;
    }
    fetchUserData();
    fetchProductDetails();
  }, [user, cartItems]);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const response = await userService.getProfile(decodedToken.CODPES);
        const userData = response.data;
        const mappedAddresses = (userData.ENDERECOS || []).map((address) => ({
          ...address,
          LOGRADOURO: address.RUA || address.LOGRADOURO || '',
          UF: address.UF || '',
        }));
        setAddresses(mappedAddresses);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar dados',
        text2: 'Tente mais tarde',
      });
    }
  };

  const fetchProductDetails = async () => {
    if (cartItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const productDetailsPromises = cartItems.map((item) =>
        productService.getProduct(item.CODPROD)
      );
      const responses = await Promise.all(productDetailsPromises);

      const fetchedProducts = responses.map((response, index) => ({
        ...response.data,
        quantity: cartItems[index].quantity,
        size: cartItems[index].size,
      }));

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching product details:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar produtos',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const calculatedTotal = products.reduce((sum, product) => {
      const price = Number(product.VALOR) || 0;
      const discount = Number(product.DESCONTO) || 0;
      const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
      return sum + discountedPrice * (product.quantity || 1);
    }, 0);
    setTotal(calculatedTotal);
  };

  const handleRemoveProduct = async (productId, size) => {
    try {
      await removeFromCart(productId, size);
      Toast.show({
        type: 'success',
        text1: 'Produto removido do carrinho',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao remover produto',
      });
    }
  };

  const handleIncreaseQuantity = async (productId, size) => {
    const product = products.find(p => p.CODPROD === productId);
    if (product && product.quantity < (product.ESTOQUE || 999)) {
      const newQuantity = product.quantity + 1;
      await updateCartItem(productId, size, newQuantity);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Quantidade máxima atingida',
      });
    }
  };

  const handleDecreaseQuantity = async (productId, size) => {
    const product = products.find(p => p.CODPROD === productId);
    if (product && product.quantity > 1) {
      const newQuantity = product.quantity - 1;
      await updateCartItem(productId, size, newQuantity);
    }
  };

  const handleOrderSubmit = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: 'error',
        text1: 'Selecione um endereço',
        text2: 'Por favor, selecione um endereço antes de fechar o pedido',
      });
      return;
    }

    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Carrinho vazio',
        text2: 'Adicione produtos antes de fechar o pedido',
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erro de autenticação',
        });
        return;
      }

      const decodedToken = jwtDecode(token);
      const orderData = {
        CODEND: +selectedAddress,
        CODPES: decodedToken.CODPES,
        DESCONTO: 0,
        FRETE: 0,
        ITENS: cartItems
          .map((item) => {
            const quantity = Number(item.quantity ?? item.QUANTIDADE ?? item.QTD ?? item.qtd ?? 1);
            const tamanho = item.size || item.TAMANHO || null;
            return {
              CODPROD: item.CODPROD,
              QTD: Number.isNaN(quantity) ? 0 : quantity,
              ...(tamanho && { TAMANHO: tamanho }),
            };
          })
          .filter((item) => item.CODPROD && item.QTD > 0),
      };

      await orderService2.createOrder(orderData);
      await storage.removeItem('cart');
      setCartItems([]);

      Toast.show({
        type: 'success',
        text1: 'Pedido enviado com sucesso!',
      });

      setTimeout(() => {
        navigation.navigate('Account', { screen: 'History' });
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao enviar pedido';
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar pedido',
        text2: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
        <Text style={styles.loadingText}>Redirecionando para login...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cart-outline" size={64} color={colors.gray400} />
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        <Button
          variant="primary"
          onPress={() => navigation.navigate('Products', { screen: 'ProductsList' })}
          style={styles.shopButton}
        >
          Continuar Comprando
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xl }}
      >
      <View style={styles.content}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {products.map((product) => {
            const price = Number(product.VALOR) || 0;
            const discount = Number(product.DESCONTO) || 0;
            const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
            const itemTotal = discountedPrice * (product.quantity || 1);

            return (
              <View key={`${product.CODPROD}-${product.size || 'default'}`} style={styles.cartItem}>
                <Image source={{ uri: product.IMAGEM }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {product.PRODUTO}
                  </Text>
                  {product.size && (
                    <Text style={styles.itemSize}>Tamanho: {product.size}</Text>
                  )}
                  <Text style={styles.itemPrice}>{formatPrice(discountedPrice)}</Text>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecreaseQuantity(product.CODPROD, product.size)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="remove" size={16} color={colors.gray900} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{product.quantity || 1}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncreaseQuantity(product.CODPROD, product.size)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={16} color={colors.gray900} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <Text style={styles.itemTotal}>{formatPrice(itemTotal)}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveProduct(product.CODPROD, product.size)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.red600} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Address Selection */}
        {addresses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione o endereço de entrega</Text>
            {addresses.map((address) => (
              <TouchableOpacity
                key={address.CODEND}
                style={[
                  styles.addressCard,
                  selectedAddress === address.CODEND.toString() && styles.addressCardSelected,
                ]}
                onPress={() => setSelectedAddress(address.CODEND.toString())}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={selectedAddress === address.CODEND.toString() ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selectedAddress === address.CODEND.toString() ? colors.black : colors.gray400}
                />
                <View style={styles.addressInfo}>
                  <Text style={styles.addressText}>
                    {address.LOGRADOURO}, {address.NUMERO}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.BAIRRO}, {address.CIDADE} - {address.UF}
                  </Text>
                  <Text style={styles.addressText}>CEP: {address.CEP}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Button
              variant="outline"
              onPress={() => navigation.navigate('Account', { screen: 'Address' })}
              style={styles.addAddressButton}
            >
              Adicionar Novo Endereço
            </Button>
          </View>
        )}

        {/* Total and Checkout */}
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
          <Button
            variant="primary"
            size="large"
            onPress={handleOrderSubmit}
            loading={submitting}
            disabled={submitting || !selectedAddress}
            style={styles.checkoutButton}
          >
            {submitting ? 'Processando...' : 'Finalizar Pedido'}
          </Button>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
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
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray600,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  shopButton: {
    marginTop: spacing.md,
  },
  content: {
    padding: isSmallScreen ? spacing.md : spacing.lg,
  },
  itemsContainer: {
    marginBottom: spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: isSmallScreen ? spacing.sm : spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: isSmallScreen ? 60 : 80,
    height: isSmallScreen ? 60 : 80,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  itemInfo: {
    flex: 1,
    marginLeft: isSmallScreen ? spacing.sm : spacing.md,
  },
  itemName: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '500',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  itemSize: {
    fontSize: isSmallScreen ? 11 : 12,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 4,
    padding: isSmallScreen ? 4 : spacing.xs,
    minWidth: isSmallScreen ? 28 : 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: colors.gray900,
    minWidth: isSmallScreen ? 24 : 30,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: spacing.xs,
  },
  itemTotal: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isSmallScreen ? spacing.sm : spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    marginBottom: spacing.sm,
    gap: isSmallScreen ? spacing.sm : spacing.md,
  },
  addressCardSelected: {
    borderColor: colors.black,
    backgroundColor: colors.gray50,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: colors.gray700,
    marginBottom: spacing.xs,
    lineHeight: isSmallScreen ? 16 : 20,
  },
  addAddressButton: {
    marginTop: spacing.sm,
  },
  totalContainer: {
    backgroundColor: colors.gray50,
    padding: isSmallScreen ? spacing.md : spacing.lg,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: colors.gray900,
  },
  totalValue: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: '700',
    color: colors.gray900,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
});

export default CartScreen;

