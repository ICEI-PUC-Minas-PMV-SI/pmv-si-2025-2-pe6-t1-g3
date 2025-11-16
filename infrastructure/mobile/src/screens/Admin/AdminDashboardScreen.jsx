import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboardScreen = () => {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="lock-closed-outline" size={64} color={colors.gray400} />
        <Text style={styles.errorText}>Acesso negado</Text>
        <Text style={styles.errorSubtext}>
          Você não tem permissão para acessar esta área
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Painel Administrativo</Text>
          <Text style={styles.subtitle}>
            Gerencie produtos, pedidos e usuários
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={colors.info} />
          <Text style={styles.infoText}>
            O painel administrativo completo está disponível na versão web.
            Esta versão mobile está em desenvolvimento.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="cube-outline" size={32} color={colors.black} />
            <Text style={styles.featureTitle}>Gerenciar Produtos</Text>
            <Text style={styles.featureDescription}>
              Adicione, edite e remova produtos do catálogo
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="receipt-outline" size={32} color={colors.black} />
            <Text style={styles.featureTitle}>Gerenciar Pedidos</Text>
            <Text style={styles.featureDescription}>
              Acompanhe e atualize o status dos pedidos
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="people-outline" size={32} color={colors.black} />
            <Text style={styles.featureTitle}>Gerenciar Usuários</Text>
            <Text style={styles.featureDescription}>
              Visualize e gerencie contas de usuários
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.info + '20',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
  },
  featuresContainer: {
    gap: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;

