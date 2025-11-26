import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3000';

export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'joao.silva@teste.com' && body.password === 'senha123456') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          CODPES: 1,
          name: 'João Silva',
          email: 'joao.silva@teste.com',
          role: 'CLIENT',
        },
      });
    }
    return HttpResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/registro`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: Date.now(),
        CODPES: Date.now(),
        name: body.name,
        email: body.email,
        role: body.role || 'CLIENT',
      },
    });
  }),

  // Product handlers
  http.get(`${API_URL}/produto/listar`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          CODPROD: 1,
          name: 'Smartphone XYZ Pro',
          price: 1299.99,
          stock: 25,
          category: 'Eletrônicos',
        },
        {
          id: 2,
          CODPROD: 2,
          name: 'Tablet ABC',
          price: 599.99,
          stock: 10,
          category: 'Eletrônicos',
        },
      ],
      total: 2,
    });
  }),

  http.get(`${API_URL}/produto/buscar`, ({ request }) => {
    const url = new URL(request.url);
    const codprod = url.searchParams.get('CODPROD');
    if (codprod === '1') {
      return HttpResponse.json({
        id: 1,
        CODPROD: 1,
        name: 'Smartphone XYZ Pro',
        description: 'Smartphone com tela de 6.1 polegadas',
        price: 1299.99,
        stock: 25,
        category: 'Eletrônicos',
        images: ['https://example.com/product1.jpg'],
      });
    }
    return HttpResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    );
  }),

  // Order handlers
  http.get(`${API_URL}/pedido/listar`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          CODPED: 1,
          status: 'pending',
          total: 2014.98,
          createdAt: '2024-01-15T10:30:00Z',
        },
      ],
    });
  }),

  http.post(`${API_URL}/pedido/cadastrar`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: Date.now(),
      CODPED: Date.now(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }),

  // User handlers
  http.get(`${API_URL}/pessoa/buscar`, ({ request }) => {
    const url = new URL(request.url);
    const codpes = url.searchParams.get('CODPES');
    return HttpResponse.json({
      id: parseInt(codpes),
      CODPES: parseInt(codpes),
      name: 'João Silva',
      email: 'joao.silva@teste.com',
      phone: '(11) 99999-9999',
    });
  }),

  http.put(`${API_URL}/pessoa/atualizar`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),

  // Address handlers
  http.get(`${API_URL}/endereco/listar`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          CODEND: 1,
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          isDefault: true,
        },
      ],
    });
  }),

  http.post(`${API_URL}/endereco/cadastrar`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: Date.now(),
      CODEND: Date.now(),
      ...body,
    });
  }),

  // ViaCEP handler
  http.get('https://viacep.com.br/ws/:cep/json/', ({ params }) => {
    const { cep } = params;
    return HttpResponse.json({
      cep: cep.replace(/(\d{5})(\d{3})/, '$1-$2'),
      logradouro: 'Rua das Flores',
      complemento: '',
      bairro: 'Centro',
      localidade: 'São Paulo',
      uf: 'SP',
      erro: false,
    });
  }),
];

