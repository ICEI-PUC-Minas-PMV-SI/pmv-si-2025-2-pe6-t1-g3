# Business Context - Plataforma de E-commerce ZabbixStore

## Descrição
A ZabbixStore é uma plataforma de e-commerce web e mobile que conecta fornecedores (pequenos e médios empreendedores) com compradores, oferecendo um ambiente digital seguro, escalável e com recursos de análise de vendas.

## Requisitos
- **Funcional**: 
  - Cadastro de fornecedores e compradores
  - Gestão de produtos e estoque
  - Sistema de carrinho e pedidos
  - Dashboard de métricas para fornecedores
  - Sistema de busca e filtros
  - Histórico de compras
  - Avaliações de produtos e vendedores

- **Não Funcional**: 
  - Responsividade para dispositivos móveis
  - Autenticação segura
  - Compatibilidade com navegadores modernos
  - Conformidade com leis de proteção ao consumidor
  - Manutenibilidade e documentação
  - Performance (máximo 3s de resposta)

## Regras de Negócio
1. Cada comprador pode ter apenas uma conta por endereço de e-mail
2. Cada fornecedor pode ter apenas uma conta com perfil administrador e até duas contas de usuário associadas
3. Produtos devem ter controle de estoque para evitar vendas de itens esgotados
4. Pedidos devem incluir informações de endereço de entrega e método de pagamento
5. Avaliações só podem ser feitas após a compra ser realizada
6. Dashboard de métricas disponível apenas para fornecedores

## Fluxo de Usuário
1. **Cadastro**: Usuário se registra como fornecedor ou comprador
2. **Login**: Autenticação com email e senha
3. **Fornecedor**: Cadastra produtos, gerencia estoque, visualiza métricas
4. **Comprador**: Busca produtos, adiciona ao carrinho, finaliza compra
5. **Avaliação**: Comprador avalia produtos após recebimento

## Validações
- CPF único por pessoa
- Email único por conta
- Estoque disponível para compra
- Endereço válido para entrega
- Dados obrigatórios preenchidos

## Exceções
- Produto sem estoque não pode ser adicionado ao carrinho
- Usuário não autenticado não pode acessar funcionalidades restritas
- Pedido sem endereço de entrega não pode ser finalizado

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
