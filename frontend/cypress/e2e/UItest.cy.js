describe('Admin Happy Path Test', () => {
  it('Registers successfully.cy', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('#register-email').type('testing@gmail.com');
    cy.get('#register-name').type('tester');
    cy.get('#register-password').type('testing');
    cy.get('#register-password-confirm').type('testing');
    
    cy.get('button').contains('Register').click();

    cy.url().should('include', '/'); 
  })
})
