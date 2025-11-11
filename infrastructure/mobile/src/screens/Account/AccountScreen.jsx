import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing } from '../../theme';
import Toast from 'react-native-toast-message';

const AccountScreen = () => {
  const navigation = useNavigation();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isLoading && !user) {
      Toast.show({
        type: 'info',
        text1: 'Login necessário',
        text2: 'Por favor, faça login para acessar sua conta',
      });
      setTimeout(() => {
        navigation.navigate('Auth', { screen: 'Login' });
      }, 2000);
    }
  }, [user, isLoading, navigation]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.black} />
        <Text style={styles.loadingText}>Redirecionando para login...</Text>
      </View>
    );
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Minha Conta',
      icon: 'person-outline',
      screen: 'Profile',
    },
    {
      id: 'address',
      label: 'Endereços',
      icon: 'location-outline',
      screen: 'Address',
    },
    {
      id: 'history',
      label: 'Meus Pedidos',
      icon: 'receipt-outline',
      screen: 'History',
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: 'heart-outline',
      screen: 'Favorites',
    },
  ];

  if (user?.isAdmin) {
    tabs.push({
      id: 'admin',
      label: 'Admin',
      icon: 'settings-outline',
      screen: 'AdminDashboard',
    });
  }

  const handleTabPress = (tab) => {
    setActiveTab(tab.id);
    navigation.navigate(tab.screen);
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Conta</Text>
        <Text style={styles.subtitle}>
          Gerencie suas informações, endereços e pedidos
        </Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? colors.black : colors.gray500}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.userInfo}>
        <View style={styles.userCard}>
          <View style={styles.userIcon}>
            <Ionicons name="person" size={32} color={colors.gray600} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {user?.name} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.red600} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
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
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.gray600,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    padding: spacing.lg,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: spacing.xs,
  },
  tabActive: {
    borderBottomColor: colors.black,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray500,
  },
  tabTextActive: {
    color: colors.black,
  },
  userInfo: {
    padding: spacing.lg,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray600,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    margin: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.red200,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.red600,
  },
});

export default AccountScreen;

