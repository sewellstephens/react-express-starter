//handle uncaught error
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe("Login", () => {
  it("should visit login page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(1000);
    cy.wait(1000);
    cy.url().should("include", "/login");
  });

  it("should login", () => {
    cy.visit("http://localhost:3000/login");
    cy.wait(1000);
    cy.get("input[name='email']").type("test@krastie.ai");
    cy.get("input[name='password']").type("TestUser1515!");
    cy.get("button[type='submit']").click();
    cy.wait(4000);
    cy.url().should("include", "/dashboard");
});
  it("should visit dashboard", () => {
    cy.visit("http://localhost:3000/login");
    cy.wait(1000);
    cy.get("input[name='email']").type("test@krastie.ai");
    cy.get("input[name='password']").type("TestUser1515!");
    cy.get("button[type='submit']").click();
    cy.wait(4000);
    cy.url().should("include", "/dashboard");
    cy.visit("http://localhost:3000/login");
    cy.wait(1000);
    cy.wait(4000);
    cy.url().should("include", "/dashboard");
  });
  it("should logout", () => {
    cy.visit("http://localhost:3000/login");
    cy.wait(1000);
    cy.get("input[name='email']").type("test@krastie.ai");
    cy.get("input[name='password']").type("TestUser1515!");
    cy.get("button[type='submit']").click();
    cy.wait(4000);
    cy.url().should("include", "/dashboard");
    cy.visit("http://localhost:3000/logout");
    cy.wait(1000);
    cy.wait(4000);
    cy.url().should("include", "/login");
  });
});