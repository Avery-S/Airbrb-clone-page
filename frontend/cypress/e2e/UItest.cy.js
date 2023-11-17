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
import 'cypress-file-upload';

describe('Admin Happy Path Test', () => {
  it('Registers successfully.cy and logout', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('#register-email').type('testing1@gmail.com');
    cy.get('#register-name').type('tester1');
    cy.get('#register-password').type('testing');
    cy.get('#register-password-confirm').type('testing');

    cy.get('button').contains('Register').click();

    cy.url().should('include', '/');

    cy.get('.MuiAvatar-root').click();

    cy.contains('.MuiMenuItem-root', 'Logout').click();
    cy.contains('You have successfully logout out!').should('be.visible');
  })

  it('Creates a new listing successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');

      cy.contains('button', 'Create My Listing').click();
      cy.contains('Create New Listing').should('be.visible');

      // modal inputs check ...
      cy.get('#title').should('be.visible');
      cy.get('#title').type('Test Hotel 3');
      cy.get('#street').should('be.visible');
      // make inputs
      cy.get('#street').type('test 2 street');
      cy.get('#city').type('test 2 city');
      cy.get('#state').type('test 2 state');
      cy.get('#postCode').type('2222');
      cy.get('#country-select-demo').click();
      cy.contains('li', 'Australia').click();
      cy.get('#price').type('100');
      cy.get('#propertyType').click();
      cy.contains('Apartment').click();
      cy.get('#numberOfBathrooms').clear().type('2'); 
      cy.get('#numberOfBathrooms').should('have.value', '2');
      const initialRoomNum = 0;
      cy.get('#increase-singleRoom').click();
      cy.get('#singleRoom').should('contain', `${initialRoomNum + 1}`);
      cy.get('#increase-twinRoom').click();
      cy.get('#twinRoom').should('contain', `${initialRoomNum + 1}`);
      cy.get('#increase-familyRoom').click();
      cy.get('#familyRoom').should('contain', `${initialRoomNum + 1}`);
      cy.get('#increase-quadRoom').click();
      cy.get('#quadRoom').should('contain', `${initialRoomNum + 1}`);
      cy.get('#numberOfBeds').should('have.value', '10');
      cy.get('#tags-outlined').click();
      cy.contains('Free WI-FI').click();
      cy.get('#tags-outlined').parent().should('contain', 'Free WI-FI');
      cy.get('#houseRules').clear().type('This is test house rules'); 
      
      cy.contains('button', 'Create Listing').click();
      cy.contains('Test Hotel 3').should('be.visible');
      cy.contains('Apartment').should('be.visible');
      cy.contains('10 bed').should('be.visible');
      cy.contains('2 bathroom').should('be.visible');
      cy.contains('test 2 city').should('be.visible');
      cy.contains('Australia').should('be.visible');
      cy.contains('$100 / night').should('be.visible');
    })

    it('Updates the thumbnail and title of the listing successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');

      cy.get('button[aria-label="Edit Listing"]').click();
      cy.url().should('include', '/edit-listing/');

      // cy.get('button[aria-label="upload picture"]').click();
      cy.fixture('hotel.jpeg', 'base64').then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: 'hotel.jpeg',
          mimeType: 'image/jpeg',
          encoding: 'base64'
        });
      });
      cy.get('#title').clear().type('Test Hotel 4');
      cy.contains('button', 'Update Listing').click();

      cy.url().should('include', '/my-hosted-listings');
      cy.contains('Test Hotel 4').should('be.visible');
      cy.get('.MuiCardMedia-img').should('have.attr', 'src').and('include', 'data:image/jpeg;base64');
    })

    it('Updates the thumbnail and title of the listing successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');
      cy.get('button[aria-label="If published"]').click();
      cy.contains('Set Availabilities').should('be.visible');

      cy.contains('label', 'Start date picker').parent().find('input').clear().type('11/20/2023');
      cy.contains('label', 'End date picker').parent().find('input').clear().type('11/30/2023');
      // check date
      cy.contains('label', 'Start date picker').parent().find('input').should('have.value', '11/20/2023');
      cy.contains('label', 'End date picker').parent().find('input').should('have.value', '11/30/2023');
      cy.get('button').contains('Set').click();
      const expectedDateRange = '20/11/2023-30/11/2023';
      cy.contains('.MuiChip-root', expectedDateRange).should('be.visible');
      //publish
      cy.get('button').contains('Publish').click();
      //button and card shadow turn green
      cy.get('#published-btn').should('have.css', 'color', 'rgb(56, 142, 60)');
      cy.get('.MuiCard-root').should('have.css', 'box-shadow', 'rgba(0, 128, 0, 0.5) 5px 5px 5px 0px');
      // find it in all listings
      cy.contains('button', 'All Listings').click();
      cy.contains('Test Hotel 4').should('be.visible');
      cy.contains('Apartment').should('be.visible');
      cy.contains('10 bed').should('be.visible');
      cy.contains('2 bathroom').should('be.visible');
      cy.contains('test 2 city').should('be.visible');
      cy.contains('Australia').should('be.visible');
      cy.contains('$100 / night').should('be.visible');
    });

    it('Unpublish a listing successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');
      cy.get('button[aria-label="If published"]').click();
      cy.contains('button','Unpublish').should('be.visible');
      cy.get('button').contains('Unpublish').click();
      cy.contains('Set Availabilities').should('be.visible');
      cy.contains('button','Cancel').should('be.visible');
      cy.get('button').contains('Cancel').click();
      cy.get('#published-btn').should('have.css', 'color', 'rgba(0, 0, 0, 0.54)');
      cy.get('.MuiCard-root').should('have.css', 'box-shadow', 'rgb(128, 128, 128) 1px 1px 1px 0px');
    });

  

  it('Logs out of the application successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      cy.get('.MuiAvatar-root').click();

      cy.contains('.MuiMenuItem-root', 'Logout').click();
      cy.contains('You have successfully logout out!').should('be.visible');
});

  it('Logs back into the application successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');
      // logout
      cy.get('.MuiAvatar-root').click();
      cy.contains('.MuiMenuItem-root', 'Logout').click();
      cy.contains('You have successfully logout out!').should('be.visible');
      cy.get('button.btn-close[aria-label="Close alert"]').click();
      // login
      cy.get('.MuiAvatar-root').click();
      cy.contains('.MuiMenuItem-root', 'Login').click();
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');
  });

  it('Make a booking successfully.cy', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('#login-email').type('testing1@gmail.com');
      cy.get('#login-password').type('testing');
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/');

      //publsh
      cy.contains('button', 'My Hosted Listings').click();
      cy.url().should('include', '/my-hosted-listings');
      cy.get('button[aria-label="If published"]').click();
      cy.contains('Set Availabilities').should('be.visible');
      cy.contains('label', 'Start date picker').parent().find('input').clear().type('11/20/2023');
      cy.contains('label', 'End date picker').parent().find('input').clear().type('11/30/2023');
      // check date
      cy.contains('label', 'Start date picker').parent().find('input').should('have.value', '11/20/2023');
      cy.contains('label', 'End date picker').parent().find('input').should('have.value', '11/30/2023');
      cy.get('button').contains('Set').click();
      const expectedDateRange = '20/11/2023-30/11/2023';
      cy.contains('.MuiChip-root', expectedDateRange).should('be.visible');
      cy.get('button').contains('Publish').click();
      //button and card shadow turn green
      cy.get('#published-btn').should('have.css', 'color', 'rgb(56, 142, 60)');
      cy.get('.MuiCard-root').should('have.css', 'box-shadow', 'rgba(0, 128, 0, 0.5) 5px 5px 5px 0px');
      cy.contains('button', 'All Listings').click();
      //logout and register a new account
      // logout
      cy.get('.MuiAvatar-root').click();
      cy.contains('.MuiMenuItem-root', 'Logout').click();
      cy.contains('You have successfully logout out!').should('be.visible');
      cy.get('button.btn-close[aria-label="Close alert"]').click();
      //register a new account
      cy.get('.MuiAvatar-root').click();
      cy.contains('.MuiMenuItem-root', 'Register').click();
      cy.get('#register-email').type('customer1@gmail.com');
      cy.get('#register-name').type('customer1');
      cy.get('#register-password').type('customer');
      cy.get('#register-password-confirm').type('customer');
      cy.get('button').contains('Register').click();
      cy.url().should('include', '/'); 
      // 自己试用账号登陆
      // cy.get('.MuiAvatar-root').click();
      // cy.contains('.MuiMenuItem-root', 'Login').click();
      // cy.get('#login-email').type('999@999.com');
      // cy.get('#login-password').type('999');
      // cy.get('button').contains('Login').click();
      // cy.url().should('include', '/');

      // all Listings and find the card and click
      cy.contains('button', 'All Listings').click();
      cy.contains('Test Hotel 4').should('be.visible');
      cy.contains('Test Hotel 4').click();
      cy.contains('button','Book').should('be.visible');
      cy.contains('button','Book').click();
      cy.get('[data-testid="CalendarIcon"]').first().click();
      cy.get('button[type="button"][role="gridcell"][data-timestamp="1700658000000"]').click({ force: true });
      cy.get('[data-testid="CalendarIcon"]').eq(1).click();
      cy.get('button[type="button"][role="gridcell"][data-timestamp="1701176400000"]').click({ force: true });
      cy.contains('Set Booking').click();
      cy.contains('button', 'Confirm Book').click();
      cy.contains('Booking request submitted successfully!').should('be.visible');
      cy.contains('Booked Date: 23/11/2023 - 29/11/2023').should('be.visible');
      cy.contains('Pending').should('be.visible');
    });
})
