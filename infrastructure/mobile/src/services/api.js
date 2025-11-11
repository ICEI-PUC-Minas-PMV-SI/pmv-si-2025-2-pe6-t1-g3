import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../utils/env';

const API_BASE_URL = ENV.API_URL();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token from SecureStore
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from SecureStore:', error);
  }
  return config;
});

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync('token');
        // Navigation will be handled by the component using the error
      } catch (err) {
        console.error('Error removing token:', err);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  loginWithGoogle: (payload) => api.post('/auth/google', payload),
  register: (userData) => api.post('/auth/registro', userData),
};

export const productService = {
  getProducts: (params = {}) => api.get('/produto/listar', { params }),
  getProduct: (id) => api.get(`/produto/buscar`, { params: { CODPROD: id } }),
  createProduct: (product) => api.post('/produto/cadastrar', product),
  updateProduct: (product) => api.put('/produto/atualizar', product),
  deleteProduct: (id) => api.delete('/produto/remover', { params: { CODPROD: id } }),
};

export const orderService = {
  getOrders: () => api.get('/pedido/listar'),
  createOrder: (order) => api.post('/pedido/cadastrar', order),
  getOrderById: (id) => api.get(`/pedido/buscar`, { params: { CODPED: id } }),
  updateOrder: (order) => api.patch('/pedido/atualizar', order),
};

export const userService = {
  getProfile: (codpes) => api.get('/pessoa/buscar', { params: { CODPES: codpes } }),
  updateProfile: (data) => api.put('/pessoa/atualizar', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const addressService = {
  updateAddress: (data) => api.put('/endereco/atualizar/', data),
  createAddress: (data) => api.post('/endereco/cadastrar', data),
  deleteAddress: (codend) => api.delete('/endereco/deletar', { params: { CODEND: codend } }),
};

export const orderService2 = {
  getOrdersByUser: (codpes) => api.get('/pedido/listar', { params: { CODPES: codpes } }),
  createOrder: (order) => api.post('/pedido/cadastrar', order),
  getOrderById: (id) => api.get(`/pedido/buscar`, { params: { CODPED: id } }),
};

export const reviewService = {
  getReviews: (productId) => api.get('/avaliacao/listar', { params: { CODPROD: productId } }),
  createReview: (review) => api.post('/avaliacao/criar', review),
  checkPurchase: (productId) => api.get('/avaliacao/verificar-compra', { params: { CODPROD: productId } }),
};

export const externalService = {
  getCep: async (cep) => {
    const viacepUrl = ENV.VIACEP_API_URL();
    const response = await axios.get(`${viacepUrl}/${cep.replace(/[^0-9]/g, '')}/json/`);
    return response;
  },
};

export default api;

