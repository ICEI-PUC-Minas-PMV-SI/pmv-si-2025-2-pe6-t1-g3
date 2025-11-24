import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  console.log('Criando categorias...');
  const categoriaEletronicos = await prisma.categorias.upsert({
    where: { CODCAT: 1 },
    update: {},
    create: {
      CATEGORIA: 'ELETRÔNICOS'
    }
  });

  const categoriaFashion = await prisma.categorias.upsert({
    where: { CODCAT: 2 },
    update: {},
    create: {
      CATEGORIA: 'FASHION'
    }
  });

  const categoriaCasa = await prisma.categorias.upsert({
    where: { CODCAT: 3 },
    update: {},
    create: {
      CATEGORIA: 'CASA'
    }
  });

  const categoriaEsportes = await prisma.categorias.upsert({
    where: { CODCAT: 4 },
    update: {},
    create: {
      CATEGORIA: 'ESPORTES'
    }
  });

  console.log('Categorias criadas');

  console.log('Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('Admin123', 12);
  
  const adminUser = await prisma.login.upsert({
    where: { EMAIL: 'admin@store.com' },
    update: {},
    create: {
      EMAIL: 'admin@store.com',
      SENHA: hashedPassword,
      PERMISSAO: 'ADMIN'
    }
  });

  const adminProfile = await prisma.pessoa.upsert({
    where: { CODUSU: adminUser.CODUSU },
    update: {},
    create: {
      NOME: 'Administrador',
      SOBRENOME: 'Sistema',
      CPF: '00000000000',
      TELEFONE: '11999999999',
      CODUSU: adminUser.CODUSU
    }
  });

  console.log('Usuário admin criado:', adminUser.EMAIL);

  console.log('Criando usuário cliente...');
  const clientPassword = await bcrypt.hash('Cliente123', 12);
  
  const clientUser = await prisma.login.upsert({
    where: { EMAIL: 'cliente@teste.com' },
    update: {},
    create: {
      EMAIL: 'cliente@teste.com',
      SENHA: clientPassword,
      PERMISSAO: 'CLIENTE'
    }
  });

  const clientProfile = await prisma.pessoa.upsert({
    where: { CODUSU: clientUser.CODUSU },
    update: {},
    create: {
      NOME: 'João',
      SOBRENOME: 'Silva',
      CPF: '12345678901',
      TELEFONE: '11987654321',
      CODUSU: clientUser.CODUSU
    }
  });

  console.log('Usuário cliente criado:', clientUser.EMAIL);

  console.log('Criando usuário fornecedor...');
  const fornecedorPassword = await bcrypt.hash('Fornecedor123', 12);
  const fornecedorUser = await prisma.login.upsert({
    where: { EMAIL: 'fornecedor@teste.com' },
    update: {},
    create: {
      EMAIL: 'fornecedor@teste.com',
      SENHA: fornecedorPassword,
      PERMISSAO: 'FORNECEDOR'
    }
  });

  const fornecedorProfile = await prisma.pessoa.upsert({
    where: { CODUSU: fornecedorUser.CODUSU },
    update: {},
    create: {
      NOME: 'Fornecedor',
      SOBRENOME: 'Exemplo',
      CPF: '22233344455',
      TELEFONE: '11988887777',
      CODUSU: fornecedorUser.CODUSU
    }
  });

  console.log('Usuário fornecedor criado:', fornecedorUser.EMAIL);

  console.log('Criando produtos...');
  
  const produtos = [
    // ELETRÔNICOS
    {
      PRODUTO: 'Smartphone Samsung Galaxy A54',
      DESCRICAO: 'Smartphone com tela AMOLED 6.4", 128GB, câmera tripla 50MP, bateria 5000mAh',
      IMAGEM: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 1299.99,
      ESTOQUE: 25,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },
    {
      PRODUTO: 'Notebook Lenovo IdeaPad 3',
      DESCRICAO: 'Notebook Intel Core i5, 8GB RAM, 256GB SSD, tela 15.6" Full HD',
      IMAGEM: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 2499.99,
      ESTOQUE: 15,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },
    {
      PRODUTO: 'Fone de Ouvido JBL Tune 510BT',
      DESCRICAO: 'Fone Bluetooth sem fio, até 40h de bateria, som JBL Pure Bass',
      IMAGEM: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 199.99,
      ESTOQUE: 30,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },
    {
      PRODUTO: 'Smart TV LG 43" 4K UHD',
      DESCRICAO: 'Smart TV LED 43 polegadas, resolução 4K, WebOS, HDR10',
      IMAGEM: 'https://images.unsplash.com/photo-1552975084-6e027ba2d5ce?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 1899.99,
      ESTOQUE: 12,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },
    {
      PRODUTO: 'Tablet Apple iPad 10.9"',
      DESCRICAO: 'iPad 10ª geração, chip A14 Bionic, 64GB, Wi-Fi, tela Liquid Retina',
      IMAGEM: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 2199.99,
      ESTOQUE: 18,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },
    {
      PRODUTO: 'Smartwatch Apple Watch SE',
      DESCRICAO: 'Apple Watch SE 44mm, GPS, caixa de alumínio, pulseira esportiva',
      IMAGEM: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 1799.99,
      ESTOQUE: 20,
      CODCAT: categoriaEletronicos.CODCAT,
      CODUSU: fornecedorUser.CODUSU
    },

    // FASHION
    {
      PRODUTO: 'Camiseta Básica Premium',
      DESCRICAO: 'Camiseta 100% algodão orgânico, corte unissex, disponível em várias cores',
      IMAGEM: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 79.99,
      ESTOQUE: 50,
      CODCAT: categoriaFashion.CODCAT,
      TAMANHOS: JSON.stringify(['P', 'M', 'G', 'GG'])
    },
    {
      PRODUTO: 'Jaqueta Jeans Vintage',
      DESCRICAO: 'Jaqueta jeans com lavação vintage, corte oversized, unissex',
      IMAGEM: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 189.99,
      ESTOQUE: 25,
      CODCAT: categoriaFashion.CODCAT,
      TAMANHOS: JSON.stringify(['P', 'M', 'G', 'GG'])
    },
    {
      PRODUTO: 'Tênis Esportivo Nike Air',
      DESCRICAO: 'Tênis esportivo com tecnologia Air, ideal para corrida e caminhada',
      IMAGEM: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 399.99,
      ESTOQUE: 30,
      CODCAT: categoriaFashion.CODCAT,
      TAMANHOS: JSON.stringify(['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'])
    },
    {
      PRODUTO: 'Vestido Midi Floral',
      DESCRICAO: 'Vestido midi com estampa floral, tecido leve e fluido, ideal para verão',
      IMAGEM: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 149.99,
      ESTOQUE: 22,
      CODCAT: categoriaFashion.CODCAT,
      TAMANHOS: JSON.stringify(['P', 'M', 'G', 'GG'])
    },
    {
      PRODUTO: 'Moletom Oversize Cinza',
      DESCRICAO: 'Moletom com capuz, corte oversize, algodão e poliéster, unissex',
      IMAGEM: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 129.99,
      ESTOQUE: 35,
      CODCAT: categoriaFashion.CODCAT,
      TAMANHOS: JSON.stringify(['P', 'M', 'G', 'GG'])
    },

    // CASA
    {
      PRODUTO: 'Kit Panelas Antiaderente 5 Peças',
      DESCRICAO: 'Conjunto de panelas antiaderente com revestimento cerâmico, cabos ergonômicos',
      IMAGEM: 'https://images.unsplash.com/photo-1584269600519-112e9ac90624?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 299.99,
      ESTOQUE: 20,
      CODCAT: categoriaCasa.CODCAT
    },
    {
      PRODUTO: 'Aspirador de Pó Robô',
      DESCRICAO: 'Aspirador robô inteligente com mapeamento, controle por app, 120min autonomia',
      IMAGEM: 'https://images.unsplash.com/photo-1571551742402-4e82f6d16610?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 899.99,
      ESTOQUE: 15,
      CODCAT: categoriaCasa.CODCAT
    },
    {
      PRODUTO: 'Jogo de Cama Queen Percale',
      DESCRICAO: 'Jogo de cama 4 peças em percale 200 fios, macio e durável',
      IMAGEM: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 189.99,
      ESTOQUE: 25,
      CODCAT: categoriaCasa.CODCAT
    },
    {
      PRODUTO: 'Cafeteira Expresso Automática',
      DESCRICAO: 'Cafeteira expresso com moedor integrado, pressão 15 bar, sistema milk frother',
      IMAGEM: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 1299.99,
      ESTOQUE: 12,
      CODCAT: categoriaCasa.CODCAT
    },
    {
      PRODUTO: 'Luminária LED Smart',
      DESCRICAO: 'Luminária de mesa com controle RGB, dimmer, compatível com Alexa e Google',
      IMAGEM: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 159.99,
      ESTOQUE: 30,
      CODCAT: categoriaCasa.CODCAT
    },

    // ESPORTES
    {
      PRODUTO: 'Bicicleta Mountain Bike Aro 29',
      DESCRICAO: 'Mountain bike com quadro de alumínio, 21 marchas Shimano, freios a disco',
      IMAGEM: 'https://images.unsplash.com/photo-1544191696-15693072fab4?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 1899.99,
      ESTOQUE: 8,
      CODCAT: categoriaEsportes.CODCAT
    },
    {
      PRODUTO: 'Kit Halteres Reguláveis 20kg',
      DESCRICAO: 'Par de halteres com anilhas removíveis, peso variável de 2kg a 20kg cada',
      IMAGEM: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 399.99,
      ESTOQUE: 15,
      CODCAT: categoriaEsportes.CODCAT
    },
    {
      PRODUTO: 'Esteira Elétrica Dobrável',
      DESCRICAO: 'Esteira elétrica com 12 programas, velocidade até 16km/h, dobrável para economia de espaço',
      IMAGEM: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 2499.99,
      ESTOQUE: 6,
      CODCAT: categoriaEsportes.CODCAT
    },
    {
      PRODUTO: 'Bola de Futebol Oficial FIFA',
      DESCRICAO: 'Bola de futebol profissional, tamanho oficial, aprovada pela FIFA',
      IMAGEM: 'https://images.unsplash.com/photo-1614632537190-23e4b2e69c88?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 149.99,
      ESTOQUE: 40,
      CODCAT: categoriaEsportes.CODCAT
    },
    {
      PRODUTO: 'Tênis de Corrida Adidas Ultraboost',
      DESCRICAO: 'Tênis de corrida com tecnologia Boost, cabedal Primeknit, máximo conforto',
      IMAGEM: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 599.99,
      ESTOQUE: 25,
      CODCAT: categoriaEsportes.CODCAT,
      TAMANHOS: JSON.stringify(['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'])
    },
    {
      PRODUTO: 'Kit Yoga Completo',
      DESCRICAO: 'Kit com tapete de yoga antiderrapante, blocos, alça e bolsa para transporte',
      IMAGEM: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&w=400&h=400&fit=crop',
      VALOR: 189.99,
      ESTOQUE: 20,
      CODCAT: categoriaEsportes.CODCAT
    }
  ];

  const createdProducts: { CODPROD: number; PRODUTO: string }[] = [];
  for (const produto of produtos) {
    const created = await prisma.produtos.upsert({
      where: { PRODUTO: produto.PRODUTO },
      update: {},
      create: produto
    });
    createdProducts.push({ CODPROD: created.CODPROD, PRODUTO: created.PRODUTO });
  }

  console.log(`${produtos.length} produtos criados`);

  console.log('Criando endereço...');
  const endereco = await prisma.endereco.create({
    data: {
      CEP: '01234567',
      RUA: 'Rua das Flores',
      NUMERO: '123',
      BAIRRO: 'Centro',
      CIDADE: 'São Paulo',
      COMPLEMENTO: 'Apto 45',
      DESCRICAO: 'Residencial',
      CODPES: clientProfile.CODPES
    }
  });

  console.log('Endereço criado');

  console.log('Criando pedidos de exemplo...');
  
  const pedido1 = await prisma.pedido.create({
    data: {
      SUBTOTAL: 139.80,
      VALORTOTAL: 149.80,
      DESCONTO: 0,
      FRETE: 10.00,
      CODPES: clientProfile.CODPES,
      CODEND: endereco.CODEND,
      DATAINC: new Date('2025-01-10')
    }
  });

  // Itens do pedido 1
  // Seleciona produtos válidos criados acima para evitar IDs fixos inexistentes
  const productIdA = createdProducts[0]?.CODPROD;
  const productIdB = createdProducts[1]?.CODPROD ?? createdProducts[0]?.CODPROD;

  if (productIdA && productIdB) {
    await prisma.itensPedido.createMany({
      data: [
        {
          CODPED: pedido1.CODPED,
          CODPROD: productIdA,
          QTD: 2,
          TAMANHO: 'M'
        },
        {
          CODPED: pedido1.CODPED,
          CODPROD: productIdB,
          QTD: 1,
          TAMANHO: 'P'
        }
      ]
    });
  }

  const pedido2 = await prisma.pedido.create({
    data: {
      SUBTOTAL: 219.80,
      VALORTOTAL: 229.80,
      DESCONTO: 0,
      FRETE: 10.00,
      CODPES: clientProfile.CODPES,
      CODEND: endereco.CODEND,
      DATAINC: new Date('2025-01-12')
    }
  });

  // Itens do pedido 2
  const productIdC = createdProducts[2]?.CODPROD ?? createdProducts[0]?.CODPROD;
  if (productIdC) {
    await prisma.itensPedido.createMany({
      data: [
        {
          CODPED: pedido2.CODPED,
          CODPROD: productIdC,
          QTD: 1,
          TAMANHO: '42'
        }
      ]
    });
  }

  console.log('2 pedidos de exemplo criados');

  console.log('Seed concluído com sucesso!');
  console.log('Dados criados:');
  console.log('Admin: admin@store.com / Admin123');
  console.log('Cliente: cliente@teste.com / Cliente123');
  console.log('Fornecedor: fornecedor@teste.com / Fornecedor123');
  console.log(`${produtos.length} produtos em 4 categorias`);
  console.log('2 pedidos de exemplo');
  console.log('Acesse: http://localhost:5173');
  console.log('Admin: http://localhost:5173/admin');
}

main()
  .catch((e) => {
    console.error('Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });