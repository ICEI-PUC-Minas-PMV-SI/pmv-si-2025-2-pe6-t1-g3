import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { colors, spacing } from '../../theme';
import Button from '../../components/common/Button';

const DashboardScreen = () => {
  const { products, loading, error, refetch } = useProducts();
  const navigation = useNavigation();

  const categories = [
    {
      name: 'Eletrônicos',
      slug: 'eletronicos',
      description: 'Tecnologia de ponta para seu dia a dia',
      icon: '🔌',
      color: colors.blue50 || '#EFF6FF',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Roupas e acessórios para todos os estilos',
      icon: '👕',
      color: colors.pink50 || '#FDF2F8',
    },
    {
      name: 'Casa',
      slug: 'casa',
      description: 'Tudo para deixar sua casa mais bonita',
      icon: '🏠',
      color: colors.green50 || '#F0FDF4',
    },
    {
      name: 'Esportes',
      slug: 'esportes',
      description: 'Equipamentos para sua vida ativa',
      icon: '⚽',
      color: colors.orange50 || '#FFF7ED',
    },
  ];

  const features = [
    {
      icon: 'bag-outline',
      title: 'Entrega Grátis',
      description: 'Em compras acima de R$ 99',
    },
    {
      icon: 'star-outline',
      title: 'Qualidade Garantida',
      description: 'Produtos selecionados',
    },
    {
      icon: 'trending-up-outline',
      title: 'Melhores Preços',
      description: 'Ofertas imperdíveis',
    },
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate('Category', { categorySlug: category.slug || category.name });
  };

  const handleViewProducts = () => {
    navigation.navigate('Products', { screen: 'ProductsList' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Descubra produtos{'\n'}
            <Text style={styles.heroTitleLine2}>que combinam com você</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Uma seleção cuidadosa de produtos para todas as suas necessidades
          </Text>
          <Button
            variant="primary"
            size="medium"
            onPress={handleViewProducts}
            style={styles.heroButton}
          >
            Ver produtos
          </Button>
        </View>
      </View>

      {/* Categories */}
      <View style={[styles.section, styles.categoriesSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Categorias</Text>
          <Text style={styles.sectionTitle}>Explore por categoria</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={styles.categoryAction}>
                <Text style={styles.categoryActionText}>Explorar</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.gray900} style={styles.categoryActionIcon} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={[styles.section, styles.featuresSection]}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Ionicons name={feature.icon} size={24} color={colors.gray900} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Products */}
      <View style={[styles.section, styles.productsSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
          <Text style={styles.sectionSubtitle}>
            Descubra nossa seleção especial de produtos
          </Text>
        </View>

        <ProductGrid products={products} loading={loading} error={error} refetch={refetch} variant="dashboard" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heroSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  heroContent: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.gray900,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  heroTitleLine2: {
    display: 'block',
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  section: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    position: 'relative',
    zIndex: 0,
    overflow: 'hidden',
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.gray900,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.gray600,
    marginTop: spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  categoryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  categoryActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray900,
  },
  categoryActionIcon: {
    marginLeft: spacing.xs,
  },
  featuresSection: {
    backgroundColor: colors.gray50,
    marginBottom: 0,
    zIndex: 0,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '31%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray900,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: colors.gray600,
    textAlign: 'center',
  },
  categoriesSection: {
    zIndex: 0,
  },
  productsSection: {
    marginTop: 0,
    zIndex: 0,
  },
});

export default DashboardScreen;

