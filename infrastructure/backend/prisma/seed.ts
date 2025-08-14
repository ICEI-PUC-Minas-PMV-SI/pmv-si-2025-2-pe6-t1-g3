import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  console.log('Criando categorias...');
  const categoriaMasculino = await prisma.categorias.upsert({
    where: { CODCAT: 1 },
    update: {},
    create: {
      CATEGORIA: 'MASCULINO'
    }
  });

  const categoriaFeminino = await prisma.categorias.upsert({
    where: { CODCAT: 2 },
    update: {},
    create: {
      CATEGORIA: 'FEMININO'
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

  console.log('Criando produtos...');
  
  const produtos = [
    // Produtos Masculinos
    {
      PRODUTO: 'Camiseta Básica Preta',
      DESCRICAO: 'Camiseta 100% algodão, corte regular, ideal para o dia a dia',
      IMAGEM: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      VALOR: 49.90,
      ESTOQUE: 25,
      CODCAT: categoriaMasculino.CODCAT
    },
    {
      PRODUTO: 'Polo Azul Marinho',
      DESCRICAO: 'Camisa polo em piquet, manga curta, acabamento de qualidade',
      IMAGEM: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
      VALOR: 89.90,
      ESTOQUE: 15,
      CODCAT: categoriaMasculino.CODCAT
    },
    {
      PRODUTO: 'Calça Jeans Slim',
      DESCRICAO: 'Calça jeans com elastano, corte slim fit, lavação escura',
      IMAGEM: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop',
      VALOR: 129.90,
      ESTOQUE: 20,
      CODCAT: categoriaMasculino.CODCAT
    },
    {
      PRODUTO: 'Tênis Casual Branco',
      DESCRICAO: 'Tênis casual em couro sintético, solado em borracha',
      IMAGEM: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      VALOR: 199.90,
      ESTOQUE: 12,
      CODCAT: categoriaMasculino.CODCAT
    },
    {
      PRODUTO: 'Moletom Cinza',
      DESCRICAO: 'Moletom com capuz, bolso canguru, algodão e poliéster',
      IMAGEM: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      VALOR: 79.90,
      ESTOQUE: 18,
      CODCAT: categoriaMasculino.CODCAT
    },

    // Produtos Femininos
    {
      PRODUTO: 'Blusa Floral Rosa',
      DESCRICAO: 'Blusa feminina em tecido leve, estampa floral delicada',
      IMAGEM: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
      VALOR: 69.90,
      ESTOQUE: 22,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Vestido Midi Azul',
      DESCRICAO: 'Vestido midi em viscose, corte evasê, ideal para ocasiões especiais',
      IMAGEM: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
      VALOR: 149.90,
      ESTOQUE: 10,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Saia Jeans Clara',
      DESCRICAO: 'Saia jeans com lavação clara, botões frontais, comprimento médio',
      IMAGEM: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=400&h=400&fit=crop',
      VALOR: 89.90,
      ESTOQUE: 16,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Sandália Rasteira Dourada',
      DESCRICAO: 'Sandália rasteira com acabamento dourado, confortável para o dia todo',
      IMAGEM: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      VALOR: 79.90,
      ESTOQUE: 14,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Cardigan Bege',
      DESCRICAO: 'Cardigan tricot em fio macio, botões de madeira, ideal para meia estação',
      IMAGEM: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      VALOR: 99.90,
      ESTOQUE: 13,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Tênis Feminino Rosa',
      DESCRICAO: 'Tênis esportivo feminino em tons de rosa, ideal para exercícios',
      IMAGEM: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      VALOR: 169.90,
      ESTOQUE: 11,
      CODCAT: categoriaFeminino.CODCAT
    },
    {
      PRODUTO: 'Jaqueta Jeans Feminina',
      DESCRICAO: 'Jaqueta jeans com lavação média, corte ajustado, versátil',
      IMAGEM: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop',
      VALOR: 119.90,
      ESTOQUE: 9,
      CODCAT: categoriaFeminino.CODCAT
    }
  ];

  for (const produto of produtos) {
    await prisma.produtos.upsert({
      where: { PRODUTO: produto.PRODUTO },
      update: {},
      create: produto
    });
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
  await prisma.itensPedido.createMany({
    data: [
      {
        CODPED: pedido1.CODPED,
        CODPROD: 1, // Camiseta Básica Preta
        QTD: 2,
        TAMANHO: 'M'
      },
      {
        CODPED: pedido1.CODPED,
        CODPROD: 6, // Blusa Floral Rosa
        QTD: 1,
        TAMANHO: 'P'
      }
    ]
  });

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
  await prisma.itensPedido.createMany({
    data: [
      {
        CODPED: pedido2.CODPED,
        CODPROD: 4, // Tênis Casual Branco
        QTD: 1,
        TAMANHO: '42'
      }
    ]
  });

  console.log('2 pedidos de exemplo criados');

  console.log('Seed concluído com sucesso!');
  console.log('Dados criados:');
  console.log('Admin: admin@store.com / Admin123');
  console.log('Cliente: cliente@teste.com / Cliente123');
  console.log(`${produtos.length} produtos em 2 categorias`);
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