/**
 * Application constants
 */

export const CATEGORIES = [
  {
    name: 'Eletrônicos',
    slug: 'eletronicos',
    description: 'Tecnologia de ponta para seu dia a dia',
    icon: '🔌',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Roupas e acessórios para todos os estilos',
    icon: '👕',
  },
  {
    name: 'Casa',
    slug: 'casa',
    description: 'Tudo para deixar sua casa mais bonita',
    icon: '🏠',
  },
  {
    name: 'Esportes',
    slug: 'esportes',
    description: 'Equipamentos para sua vida ativa',
    icon: '⚽',
  },
];

export const ORDER_STATUS = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_PREPARACAO: 'Em Preparação',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
};

export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  // Home
  DASHBOARD: 'Dashboard',
  // Products
  PRODUCTS: 'ProductsList',
  PRODUCT_DETAILS: 'ProductDetails',
  SEARCH_RESULTS: 'SearchResults',
  // Cart
  CART: 'Cart',
  // Account
  ACCOUNT: 'AccountMain',
  PROFILE: 'Profile',
  ADDRESS: 'Address',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  ADMIN_DASHBOARD: 'AdminDashboard',
};

export default {
  CATEGORIES,
  ORDER_STATUS,
  SCREEN_NAMES,
};

