import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productService } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { colors, spacing } from '../../theme';
import PropTypes from 'prop-types';

const ProductManagementScreen = ({ onProductChange, initialProductToEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    PRODUTO: '',
    DESCRICAO: '',
    IMAGEM: '',
    VALOR: '',
    ESTOQUE: '',
    DESCONTO: '',
    CODCAT: '2',
    TAMANHOS: [],
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');

  const categories = [
    { id: '1', name: 'ELETRÔNICOS', label: 'Eletrônicos' },
    { id: '2', name: 'FASHION', label: 'Fashion' },
    { id: '3', name: 'CASA', label: 'Casa' },
    { id: '4', name: 'ESPORTES', label: 'Esportes' },
  ];

  const clothingSizes = ['P', 'M', 'G', 'GG'];
  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (initialProductToEdit) {
      let sizes = [];
      if (initialProductToEdit.TAMANHOS) {
        try {
          sizes = JSON.parse(initialProductToEdit.TAMANHOS);
        } catch (e) {
          sizes = [];
        }
      }

      setEditingProduct(initialProductToEdit);
      setFormData({
        PRODUTO: initialProductToEdit.PRODUTO,
        DESCRICAO: initialProductToEdit.DESCRICAO,
        IMAGEM: initialProductToEdit.IMAGEM || '',
        VALOR: initialProductToEdit.VALOR.toString(),
        ESTOQUE: initialProductToEdit.ESTOQUE.toString(),
        DESCONTO: initialProductToEdit.DESCONTO?.toString() || '',
        CODCAT: initialProductToEdit.CODCAT?.toString() || '2',
        TAMANHOS: sizes,
      });
      setShowForm(true);
    }
  }, [initialProductToEdit]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        product.PRODUTO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.DESCRICAO.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === '' || product.CODCAT?.toString() === filterCategory;

      const matchesStock =
        filterStock === '' ||
        (filterStock === 'in_stock' && product.ESTOQUE > 10) ||
        (filterStock === 'low_stock' && product.ESTOQUE > 0 && product.ESTOQUE <= 10) ||
        (filterStock === 'out_of_stock' && product.ESTOQUE === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return filtered;
  }, [products, searchTerm, filterCategory, filterStock]);

  const productStats = useMemo(() => {
    return {
      total: products.length,
      inStock: products.filter((p) => p.ESTOQUE > 10).length,
      lowStock: products.filter((p) => p.ESTOQUE > 0 && p.ESTOQUE <= 10).length,
      outOfStock: products.filter((p) => p.ESTOQUE === 0).length,
      totalValue: products.reduce((sum, p) => sum + p.VALOR * p.ESTOQUE, 0),
    };
  }, [products]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      TAMANHOS: prev.TAMANHOS.includes(size)
        ? prev.TAMANHOS.filter((s) => s !== size)
        : [...prev.TAMANHOS, size],
    }));
  };

  const getAvailableSizes = () => {
    const productName = formData.PRODUTO.toLowerCase();
    if (
      productName.includes('tênis') ||
      productName.includes('tenis') ||
      productName.includes('sapato') ||
      productName.includes('sandália')
    ) {
      return shoeSizes;
    }
    if (formData.CODCAT === '2') {
      return clothingSizes;
    }
    return [];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.PRODUTO) newErrors.PRODUTO = 'Nome do produto é obrigatório';
    if (!formData.DESCRICAO) newErrors.DESCRICAO = 'Descrição é obrigatória';
    if (!formData.VALOR) newErrors.VALOR = 'Preço é obrigatório';
    if (!formData.ESTOQUE) newErrors.ESTOQUE = 'Estoque é obrigatório';

    if (formData.VALOR && (isNaN(formData.VALOR) || parseFloat(formData.VALOR) <= 0)) {
      newErrors.VALOR = 'Preço deve ser um número positivo';
    }

    if (formData.ESTOQUE && (isNaN(formData.ESTOQUE) || parseInt(formData.ESTOQUE) < 0)) {
      newErrors.ESTOQUE = 'Estoque deve ser um número não negativo';
    }

    if (
      formData.DESCONTO &&
      (isNaN(formData.DESCONTO) ||
        parseFloat(formData.DESCONTO) < 0 ||
        parseFloat(formData.DESCONTO) > 100)
    ) {
      newErrors.DESCONTO = 'Desconto deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        VALOR: parseFloat(formData.VALOR),
        ESTOQUE: parseInt(formData.ESTOQUE),
        DESCONTO: formData.DESCONTO ? parseFloat(formData.DESCONTO) : 0,
        CODCAT: parseInt(formData.CODCAT),
        TAMANHOS: formData.TAMANHOS.length > 0 ? JSON.stringify(formData.TAMANHOS) : null,
      };

      if (editingProduct) {
        await productService.updateProduct({
          ...productData,
          CODPROD: editingProduct.CODPROD,
        });
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await productService.createProduct(productData);
        Alert.alert('Sucesso', 'Produto criado com sucesso!');
      }

      resetForm();
      loadProducts();
      onProductChange?.();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (product) => {
    let sizes = [];
    if (product.TAMANHOS) {
      try {
        sizes = JSON.parse(product.TAMANHOS);
      } catch (e) {
        sizes = [];
      }
    }

    setEditingProduct(product);
    setFormData({
      PRODUTO: product.PRODUTO,
      DESCRICAO: product.DESCRICAO,
      IMAGEM: product.IMAGEM || '',
      VALOR: product.VALOR.toString(),
      ESTOQUE: product.ESTOQUE.toString(),
      DESCONTO: product.DESCONTO?.toString() || '',
      CODCAT: product.CODCAT?.toString() || '2',
      TAMANHOS: sizes,
    });
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${product.PRODUTO}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(product.CODPROD);
              Alert.alert('Sucesso', 'Produto excluído com sucesso!');
              loadProducts();
              onProductChange?.();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      PRODUTO: '',
      DESCRICAO: '',
      IMAGEM: '',
      VALOR: '',
      ESTOQUE: '',
      DESCONTO: '',
      CODCAT: '2',
      TAMANHOS: [],
    });
    setEditingProduct(null);
    setShowForm(false);
    setErrors({});
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="error">Esgotado</Badge>;
    if (stock <= 10) return <Badge variant="warning">Estoque Baixo</Badge>;
    return <Badge variant="success">Disponível</Badge>;
  };

  const availableSizes = getAvailableSizes();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Total de Produtos</Text>
              <Text style={styles.statValue}>{productStats.total}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Em Estoque</Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {productStats.inStock}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Estoque Baixo</Text>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {productStats.lowStock}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statLabel}>Valor em Estoque</Text>
              <Text style={[styles.statValue, { color: '#A855F7' }]} numberOfLines={1}>
                {formatCurrency(productStats.totalValue)}
              </Text>
            </Card>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Gerenciar Produtos</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Ionicons name="add" size={20} color={colors.white} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.filtersCard}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <View style={styles.filtersRow}>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Categoria</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setFilterCategory('')}
                  >
                    <Text style={styles.pickerText}>
                      {filterCategory
                        ? categories.find((c) => c.id === filterCategory)?.label
                        : 'Todas'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.filterItem}>
                <Text style={styles.filterLabel}>Estoque</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setFilterStock('')}
                  >
                    <Text style={styles.pickerText}>
                      {filterStock === 'in_stock'
                        ? 'Disponível'
                        : filterStock === 'low_stock'
                        ? 'Baixo'
                        : filterStock === 'out_of_stock'
                        ? 'Esgotado'
                        : 'Todos'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>

          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length > 0 ? (
            <View style={styles.productList}>
              {filteredProducts.map((product) => {
                let sizes = [];
                if (product.TAMANHOS) {
                  try {
                    sizes = JSON.parse(product.TAMANHOS);
                  } catch (e) {
                    sizes = [];
                  }
                }

                return (
                  <Card key={product.CODPROD} style={styles.productCard}>
                    <View style={styles.productRow}>
                      <Image
                        source={{ uri: product.IMAGEM }}
                        style={styles.productImage}
                      />
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {product.PRODUTO}
                        </Text>
                        <Text style={styles.productCategory}>
                          {product.CATEGORIAS?.CATEGORIA || 'N/A'}
                        </Text>
                        <Text style={styles.productPrice}>
                          {formatCurrency(product.VALOR)}
                        </Text>
                        {product.DESCONTO > 0 && (
                          <Text style={styles.productDiscount}>{product.DESCONTO}% OFF</Text>
                        )}
                        <View style={styles.productMeta}>
                          <Text style={styles.productStock}>Estoque: {product.ESTOQUE}</Text>
                          {getStockBadge(product.ESTOQUE)}
                        </View>
                        {sizes.length > 0 && (
                          <Text style={styles.productSizes}>
                            Tamanhos: {sizes.join(', ')}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.productActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEdit(product)}
                      >
                        <Ionicons name="pencil" size={18} color={colors.gray700} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(product)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card style={styles.emptyCard}>
              <Ionicons name="cube-outline" size={48} color={colors.gray400} />
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptyText}>
                {searchTerm || filterCategory || filterStock
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando seu primeiro produto'}
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>

      <Modal visible={showForm} animationType="slide" onRequestClose={resetForm}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <Ionicons name="close" size={24} color={colors.gray700} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Input
              label="Nome do Produto"
              value={formData.PRODUTO}
              onChangeText={(value) => handleInputChange('PRODUTO', value)}
              error={errors.PRODUTO}
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryButtons}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      formData.CODCAT === cat.id && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleInputChange('CODCAT', cat.id)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        formData.CODCAT === cat.id && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              label="Descrição"
              value={formData.DESCRICAO}
              onChangeText={(value) => handleInputChange('DESCRICAO', value)}
              error={errors.DESCRICAO}
              multiline
              numberOfLines={3}
            />

            <Input
              label="URL da Imagem"
              value={formData.IMAGEM}
              onChangeText={(value) => handleInputChange('IMAGEM', value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />

            <Input
              label="Preço"
              value={formData.VALOR}
              onChangeText={(value) => handleInputChange('VALOR', value)}
              error={errors.VALOR}
              keyboardType="numeric"
            />

            <Input
              label="Estoque"
              value={formData.ESTOQUE}
              onChangeText={(value) => handleInputChange('ESTOQUE', value)}
              error={errors.ESTOQUE}
              keyboardType="numeric"
            />

            <Input
              label="Desconto (%)"
              value={formData.DESCONTO}
              onChangeText={(value) => handleInputChange('DESCONTO', value)}
              error={errors.DESCONTO}
              keyboardType="numeric"
              placeholder="0"
            />

            {availableSizes.length > 0 && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tamanhos Disponíveis</Text>
                <View style={styles.sizesContainer}>
                  {availableSizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        formData.TAMANHOS.includes(size) && styles.sizeButtonActive,
                      ]}
                      onPress={() => handleSizeToggle(size)}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          formData.TAMANHOS.includes(size) && styles.sizeButtonTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {formData.TAMANHOS.length > 0 && (
                  <Text style={styles.sizesSelected}>
                    Selecionados: {formData.TAMANHOS.join(', ')}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <Button onPress={handleSubmit} style={styles.submitButton}>
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
              <Button variant="outline" onPress={resetForm}>
                Cancelar
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

ProductManagementScreen.propTypes = {
  onProductChange: PropTypes.func,
  initialProductToEdit: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  content: {
    padding: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray900,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  filtersCard: {
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  filtersRow: {
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
  productList: {
    gap: spacing.sm,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productRow: {
    flexDirection: 'row',
    flex: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: colors.gray500,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 2,
  },
  productDiscount: {
    fontSize: 12,
    color: colors.success,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  productStock: {
    fontSize: 12,
    color: colors.gray600,
  },
  productSizes: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  productActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  categoryButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.gray700,
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  sizeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  sizeButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  sizeButtonText: {
    fontSize: 14,
    color: colors.gray700,
  },
  sizeButtonTextActive: {
    color: colors.white,
  },
  sizesSelected: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  modalActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginBottom: spacing.xs,
  },
});

export default ProductManagementScreen;
