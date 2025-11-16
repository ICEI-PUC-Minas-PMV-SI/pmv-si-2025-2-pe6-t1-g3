import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/Home/DashboardScreen';
import ProductsScreen from '../screens/Products/ProductsScreen';
import CartScreen from '../screens/Cart/CartScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import ProductDetailsScreen from '../screens/Products/ProductDetailsScreen';
import SearchResultsScreen from '../screens/Products/SearchResultsScreen';
import CategoryScreen from '../screens/Products/CategoryScreen';
import ProfileScreen from '../screens/Account/ProfileScreen';
import AddressScreen from '../screens/Account/AddressScreen';
import HistoryScreen from '../screens/Account/HistoryScreen';
import LikedProductsScreen from '../screens/Favorites/LikedProductsScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Detalhes do Produto' }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: 'Categoria' }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Resultados da Busca' }}
      />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductsList"
        component={ProductsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Detalhes do Produto' }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ title: 'Categoria' }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Resultados da Busca' }}
      />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{ title: 'Endereços' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico de Pedidos' }}
      />
      <Stack.Screen
        name="Favorites"
        component={LikedProductsScreen}
        options={{ title: 'Favoritos' }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Painel Administrativo' }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

