// Comandos customizados do Cypress

// Comando para login
Cypress.Commands.add('login', (email = 'teste@email.com', password = 'senha123') => {
  cy.visit('/login');
  cy.get('[data-testid="input-EMAIL"]').type(email);
  cy.get('[data-testid="input-SENHA"]').type(password);
  cy.get('[data-testid="submit-button"]').click();
  cy.url().should('not.include', '/login');
});

// Comando para adicionar produto ao carrinho
Cypress.Commands.add('addToCart', (productId = 1) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="add-to-cart-button"]').click();
  cy.get('[data-testid="cart-count"]').should('contain', '1');
});

// Comando para pesquisar produto
Cypress.Commands.add('searchProduct', (query) => {
  cy.get('[data-testid="search-input"]').type(query);
  cy.get('[data-testid="search-button"]').click();
});

// Comando para aguardar carregamento
Cypress.Commands.add('waitForLoad', () => {
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});
