import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  getProfile: () => api.get('/pessoa/buscar'),
  updateProfile: (data) => api.put('/pessoa/atualizar', data),
};

export default api;