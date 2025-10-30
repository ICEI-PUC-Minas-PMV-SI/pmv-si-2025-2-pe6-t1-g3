describe('ZabbixStore E2E Tests', () => {
  beforeEach(() => {
    cy.cleanup();
    cy.mockApi();
  });

  describe('Navegação Principal', () => {
    it('deve navegar pela página inicial', () => {
      cy.visit('/');
      cy.get('h1').should('contain', 'Descubra o melhor');
      cy.get('[data-testid="product-grid"]').should('be.visible');
    });

    it('deve navegar para página sobre', () => {
      cy.visit('/');
      cy.get('a[href="/aboutus"]').click();
      cy.url().should('include', '/aboutus');
      cy.get('h1').should('contain', 'Sobre a Zabbix');
    });

    it('deve navegar para página de produtos', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]').first().click();
      cy.url().should('include', '/product/');
    });
  });

  describe('Autenticação', () => {
    it('deve fazer login com sucesso', () => {
      cy.login('teste@email.com', 'senha123');
      cy.url().should('not.include', '/login');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });

    it('deve fazer logout com sucesso', () => {
      cy.login();
      cy.logout();
      cy.url().should('include', '/');
    });

    it('deve cadastrar novo usuário', () => {
      cy.visit('/register');
      cy.get('[data-testid="input-NOME"]').type('João Silva');
      cy.get('[data-testid="input-EMAIL"]').type('joao@teste.com');
      cy.get('[data-testid="input-SENHA"]').type('senha123');
      cy.get('[data-testid="submit-button"]').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Carrinho de Compras', () => {
    it('deve adicionar produto ao carrinho', () => {
      cy.login();
      cy.addToCart(1);
      cy.goToCart();
      cy.get('[data-testid="cart-item"]').should('have.length.at.least', 1);
    });

    it('deve remover produto do carrinho', () => {
      cy.login();
      cy.addToCart(1);
      cy.goToCart();
      cy.get('[data-testid="remove-item"]').first().click();
      cy.get('[data-testid="empty-cart"]').should('be.visible');
    });

    it('deve atualizar quantidade no carrinho', () => {
      cy.login();
      cy.addToCart(1);
      cy.goToCart();
      cy.get('[data-testid="increase-quantity"]').click();
      cy.get('[data-testid="item-quantity"]').should('contain', '2');
    });
  });

  describe('Favoritos', () => {
    it('deve adicionar produto aos favoritos', () => {
      cy.login();
      cy.visit('/product/1');
      cy.get('[data-testid="favorite-button"]').click();
      cy.visit('/favorites');
      cy.get('[data-testid="favorite-item"]').should('have.length.at.least', 1);
    });

    it('deve remover produto dos favoritos', () => {
      cy.login();
      cy.addToFavorites(1);
      cy.visit('/favorites');
      cy.get('[data-testid="remove-favorite"]').first().click();
      cy.get('[data-testid="empty-favorites"]').should('be.visible');
    });
  });

  describe('Pesquisa', () => {
    it('deve pesquisar produtos', () => {
      cy.visit('/');
      cy.searchProduct('smartphone');
      cy.get('[data-testid="search-results"]').should('be.visible');
    });

    it('deve filtrar produtos por categoria', () => {
      cy.visit('/');
      cy.get('[data-testid="category-filter"]').click();
      cy.get('[data-testid="product-grid"]').should('be.visible');
    });
  });

  describe('Responsividade', () => {
    it('deve funcionar em mobile', () => {
      cy.setViewport('mobile');
      cy.visit('/');
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
    });

    it('deve funcionar em tablet', () => {
      cy.setViewport('tablet');
      cy.visit('/');
      cy.get('[data-testid="product-grid"]').should('be.visible');
    });

    it('deve funcionar em desktop', () => {
      cy.setViewport('desktop');
      cy.visit('/');
      cy.get('[data-testid="desktop-menu"]').should('be.visible');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ser navegável por teclado', () => {
      cy.visit('/');
      cy.tab();
      cy.focused().should('be.visible');
    });

    it('deve ter contraste adequado', () => {
      cy.visit('/');
      cy.checkA11y();
    });
  });
});
