import { http, HttpResponse } from 'msw';

// Dados de teste mockados
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@teste.com",
    password: "senha123456",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    role: "CLIENT",
    addresses: [
      {
        id: 1,
        street: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        isDefault: true
      }
    ]
  },
  {
    id: 2,
    name: "TechStore Ltda",
    email: "contato@techstore.com",
    password: "senha123456",
    phone: "(11) 88888-8888",
    cnpj: "12.345.678/0001-90",
    businessName: "TechStore Tecnologia",
    role: "SUPPLIER"
  },
  {
    id: 3,
    name: "Admin Sistema",
    email: "admin@zabbixstore.com",
    password: "admin123456",
    role: "ADMIN",
    permissions: ["ALL"]
  }
];

const mockProducts = [
  {
    id: 1,
    name: "Smartphone XYZ Pro",
    description: "Smartphone com tela de 6.1 polegadas, câmera tripla e processador de última geração",
    price: 1299.99,
    originalPrice: 1499.99,
    stock: 25,
    category: "Eletrônicos",
    subcategory: "Smartphones",
    images: [
      "https://example.com/product1-front.jpg",
      "https://example.com/product1-back.jpg",
      "https://example.com/product1-side.jpg"
    ],
    specifications: {
      "Tela": "6.1 polegadas",
      "Processador": "Snapdragon 888",
      "Memória": "8GB RAM",
      "Armazenamento": "128GB",
      "Câmera": "Tripla 48MP"
    },
    reviews: [
      {
        id: 1,
        user: "Maria Santos",
        rating: 5,
        comment: "Excelente produto, recomendo!",
        date: "2024-01-15"
      }
    ],
    isActive: true,
    supplierId: 2
  },
  {
    id: 2,
    name: "Tablet ABC",
    description: "Tablet com tela de 10 polegadas, ideal para trabalho e entretenimento",
    price: 599.99,
    originalPrice: 699.99,
    stock: 15,
    category: "Eletrônicos",
    subcategory: "Tablets",
    images: [
      "https://example.com/tablet1-front.jpg"
    ],
    specifications: {
      "Tela": "10 polegadas",
      "Processador": "Snapdragon 660",
      "Memória": "4GB RAM",
      "Armazenamento": "64GB"
    },
    reviews: [],
    isActive: true,
    supplierId: 2
  }
];

const mockCart = {
  id: 1,
  userId: 1,
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 999.99,
      name: "Smartphone XYZ"
    },
    {
      productId: 2,
      quantity: 1,
      price: 599.99,
      name: "Tablet ABC"
    }
  ],
  subtotal: 2599.97,
  shipping: 15.00,
  discount: 0,
  total: 2614.97,
  updatedAt: "2024-01-15T10:30:00Z"
};

// Handlers para diferentes endpoints
export const handlers = [
  // Autenticação
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      return HttpResponse.json({
        user: { ...user, password: undefined },
        token: 'mock-jwt-token'
      });
    }
    
    return HttpResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const userData = await request.json();
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      return HttpResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }
    
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'CLIENT'
    };
    
    mockUsers.push(newUser);
    
    return HttpResponse.json({
      user: { ...newUser, password: undefined },
      token: 'mock-jwt-token'
    }, { status: 201 });
  }),

  // Produtos
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === parseInt(params.id));
    
    if (!product) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(product);
  }),

  http.post('/api/products', async ({ request }) => {
    const productData = await request.json();
    const newProduct = {
      id: mockProducts.length + 1,
      ...productData,
      isActive: true
    };
    
    mockProducts.push(newProduct);
    
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const productData = await request.json();
    const productIndex = mockProducts.findIndex(p => p.id === parseInt(params.id));
    
    if (productIndex === -1) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
    
    return HttpResponse.json(mockProducts[productIndex]);
  }),

  http.delete('/api/products/:id', ({ params }) => {
    const productIndex = mockProducts.findIndex(p => p.id === parseInt(params.id));
    
    if (productIndex === -1) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    mockProducts.splice(productIndex, 1);
    
    return HttpResponse.json({ message: 'Produto removido com sucesso' });
  }),

  // Carrinho
  http.get('/api/cart', () => {
    return HttpResponse.json(mockCart);
  }),

  http.post('/api/cart/add', async ({ request }) => {
    const { productId, quantity } = await request.json();
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    const existingItem = mockCart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      mockCart.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name
      });
    }
    
    return HttpResponse.json(mockCart);
  }),

  http.put('/api/cart/update', async ({ request }) => {
    const { productId, quantity } = await request.json();
    const item = mockCart.items.find(item => item.productId === productId);
    
    if (!item) {
      return HttpResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      );
    }
    
    item.quantity = quantity;
    
    return HttpResponse.json(mockCart);
  }),

  http.delete('/api/cart/remove/:productId', ({ params }) => {
    const productId = parseInt(params.productId);
    const itemIndex = mockCart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return HttpResponse.json(
        { error: 'Item não encontrado no carrinho' },
        { status: 404 }
      );
    }
    
    mockCart.items.splice(itemIndex, 1);
    
    return HttpResponse.json(mockCart);
  }),

  // Favoritos
  http.get('/api/favorites', () => {
    return HttpResponse.json(mockProducts.slice(0, 2)); // Retorna primeiros 2 produtos como favoritos
  }),

  http.post('/api/favorites/:productId', ({ params }) => {
    const productId = parseInt(params.productId);
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ message: 'Produto adicionado aos favoritos' });
  }),

  http.delete('/api/favorites/:productId', ({ params }) => {
    const productId = parseInt(params.productId);
    
    return HttpResponse.json({ message: 'Produto removido dos favoritos' });
  }),

  // Usuário
  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUsers[0]);
  }),

  http.put('/api/user/profile', async ({ request }) => {
    const userData = await request.json();
    const updatedUser = { ...mockUsers[0], ...userData };
    
    return HttpResponse.json(updatedUser);
  }),

  // Pedidos
  http.get('/api/orders', () => {
    return HttpResponse.json([
      {
        id: 1,
        userId: 1,
        items: mockCart.items,
        total: mockCart.total,
        status: 'PENDENTE',
        createdAt: '2024-01-15T10:30:00Z'
      }
    ]);
  }),

  http.post('/api/orders', async ({ request }) => {
    const orderData = await request.json();
    const newOrder = {
      id: 1,
      ...orderData,
      status: 'PENDENTE',
      createdAt: new Date().toISOString()
    };
    
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // Busca
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query) {
      return HttpResponse.json([]);
    }
    
    const results = mockProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return HttpResponse.json(results);
  }),

  // Dashboard/Admin
  http.get('/api/admin/metrics', () => {
    return HttpResponse.json({
      totalRevenue: 50000,
      totalOrders: 150,
      totalProducts: 25,
      lowStockAlerts: 3
    });
  }),

  http.get('/api/admin/products', () => {
    return HttpResponse.json(mockProducts);
  })
];
