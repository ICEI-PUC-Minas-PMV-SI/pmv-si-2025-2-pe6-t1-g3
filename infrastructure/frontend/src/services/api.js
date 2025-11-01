import axios from 'axios';
import { ENV } from '../utils/env';

const API_BASE_URL = ENV.API_URL();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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
  deleteProduct: (id) => api.delete('/produto/remover', { data: { CODPROD: id } }),
};

export const orderService = {
  getOrders: () => api.get('/pedido/listar'),
  createOrder: (order) => api.post('/pedido/cadastrar', order),
  getOrderById: (id) => api.get(`/pedido/buscar`, { params: { CODPED: id } }),
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
    const response = await axios.get(`${viacepUrl}/${cep.replace(/[^0-9]/g, "")}/json/`);
    return response;
  },
};

export default api;
