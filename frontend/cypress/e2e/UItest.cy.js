// For ui testing, you must:

// Write a test for the "happy path" of an admin that is described as:

// 1. Registers successfully
// 2. Creates a new listing successfully
// 3. Updates the thumbnail and title of the listing successfully
// 4. Publish a listing successfully
// 5. Unpublish a listing successfully
// 6. Make a booking successfully
// 7. Logs out of the application successfully
// 8. Logs back into the application successfully


// (If working in a pair) also required to write a test for another path through the program, describing the steps and the rationale behind this choice in TESTING.md

// (If working solo) include a short rationale of the testing you have undertaken within TESTING.md

describe('Admin Happy Path Test', () => {
  // it('Registers successfully.cy', () => {
  //   cy.visit('http://localhost:3000/register')
  //   cy.get('#register-email').type('testing@gmail.com');
  //   cy.get('#register-name').type('tester');
  //   cy.get('#register-password').type('testing');
  //   cy.get('#register-password-confirm').type('testing');
    
  //   cy.get('button').contains('Register').click();

  //   cy.url().should('include', '/'); 
  // })
  // it('Creates a new listing successfully.cy', () => {
  //     cy.visit('http://localhost:3000/login')
  //     cy.get('#login-email').type('testing@gmail.com');
  //     cy.get('#login-password').type('testing');
  //     cy.get('button').contains('Login').click();
  //     cy.url().should('include', '/');

  //     cy.contains('button', 'My Hosted Listings').click();
  //     cy.url().should('include', '/my-hosted-listings');

  //     cy.contains('button', 'Create My Listing').click();
  //     cy.contains('Create New Listing').should('be.visible');

  //     // modal inputs check ...
  //     cy.get('#title').should('be.visible');
  //     cy.get('#street').should('be.visible');
  //     // make inputs
  //     cy.get('#title').type('Test Hotel 1');
  //     cy.get('#street').type('test 1 street');
  //     cy.get('#city').type('test 1 city');
  //     cy.get('#state').type('test 1 state');
  //     cy.get('#postCode').type('1111');
  //     cy.get('#country-select-demo').click();
  //     cy.contains('li', 'Australia').click();
  //     cy.get('#price').type('100');
  //     cy.get('#propertyType').click();
  //     cy.contains('Apartment').click();
  //     cy.get('#numberOfBathrooms').clear().type('2'); 
  //     cy.get('#numberOfBathrooms').should('have.value', '2');
  //     const initialRoomNum = 0;
  //     cy.get('#increase-singleRoom').click();
  //     cy.get('#singleRoom').should('contain', `${initialRoomNum + 1}`);
  //     cy.get('#increase-twinRoom').click();
  //     cy.get('#twinRoom').should('contain', `${initialRoomNum + 1}`);
  //     cy.get('#increase-familyRoom').click();
  //     cy.get('#familyRoom').should('contain', `${initialRoomNum + 1}`);
  //     cy.get('#increase-quadRoom').click();
  //     cy.get('#quadRoom').should('contain', `${initialRoomNum + 1}`);
  //     cy.get('#numberOfBeds').should('have.value', '10');
  //     cy.get('#tags-outlined').click();
  //     cy.contains('Free WI-FI').click();
  //     cy.get('#tags-outlined').parent().should('contain', 'Free WI-FI');
  //     cy.get('#houseRules').clear().type('This is test house rules'); 
      
  //     cy.contains('button', 'Create Listing').click();
  //     cy.contains('Test Hotel 1').should('be.visible');
  //     cy.contains('Apartment').should('be.visible');
  //     cy.contains('10 bed').should('be.visible');
  //     cy.contains('2 bathroom').should('be.visible');
  //     cy.contains('test 1 city').should('be.visible');
  //     cy.contains('Australia').should('be.visible');
  //     cy.contains('$100 / night').should('be.visible');
  //   })

    it('Updates the thumbnail and title of the listing successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');

      cy.get('button[aria-label="Edit Listing"]').click();
      cy.url().should('include', '/edit-listing/');

      // cy.get('button[aria-label="upload picture"]').click();
      cy.fixture('exampleImage.jpg', 'base64').then(fileContent => {
        // 以程序的方式设置文件输入
        cy.get('#icon-button-file').attachFile({
          fileContent,
          fileName: 'exampleImage.jpg',
          mimeType: 'image/jpeg',
          encoding: 'base64'
        });
      });
    })
})
