// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // Previne que o Cypress falhe em erros não capturados
  // Retorna false para prevenir que o teste falhe
  return false;
});

// Configurações de viewport para diferentes dispositivos
Cypress.Commands.add('setViewport', (device) => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    large: { width: 1920, height: 1080 }
  };
  
  const viewport = viewports[device] || viewports.desktop;
  cy.viewport(viewport.width, viewport.height);
});

// Comando para login
Cypress.Commands.add('login', (email = 'teste@email.com', password = 'senha123') => {
  cy.visit('/login');
  cy.get('[data-testid="input-EMAIL"]').type(email);
  cy.get('[data-testid="input-SENHA"]').type(password);
  cy.get('[data-testid="submit-button"]').click();
  cy.url().should('not.include', '/login');
});

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/');
});

// Comando para adicionar produto ao carrinho
Cypress.Commands.add('addToCart', (productId = 1) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="add-to-cart-button"]').click();
  cy.get('[data-testid="cart-count"]').should('contain', '1');
});

// Comando para navegar para carrinho
Cypress.Commands.add('goToCart', () => {
  cy.get('[data-testid="cart-link"]').click();
  cy.url().should('include', '/cart');
});

// Comando para adicionar aos favoritos
Cypress.Commands.add('addToFavorites', (productId = 1) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="favorite-button"]').click();
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

// Comando para verificar acessibilidade básica
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Comando para interceptar requisições da API
Cypress.Commands.add('mockApi', () => {
  cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getProducts');
  cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' }).as('login');
  cy.intercept('GET', '/api/user/profile', { fixture: 'user.json' }).as('getProfile');
});

// Comando para limpar dados de teste
Cypress.Commands.add('cleanup', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Configurações de retry
Cypress.on('fail', (error, runnable) => {
  // Log do erro para debug
  console.error('Test failed:', error.message);
  throw error;
});

// Configurações de screenshot
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  overwrite: true
});
