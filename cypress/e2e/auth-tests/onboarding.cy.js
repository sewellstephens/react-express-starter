//handle uncaught error
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});


describe("Onboarding", () => {
  it("should visit onboarding page", () => {
    cy.visit("http://localhost:3000/login");
    cy.wait(1000);
    cy.get("input[name='email']").type("test@krastie.ai");
    cy.get("input[name='password']").type("TestUser1515!");
    cy.get("button[type='submit']").click();
    cy.wait(4000);
    cy.url().should("include", "/dashboard");
    cy.visit("http://localhost:3000/dashboard?test=onboarding");
    cy.wait(10000);
    cy.get("input[name='size']").type("1");
    cy.get('select[name="role"]').select('Founder');
    cy.get('select[name="source"]').select('Social media');
    cy.get("button[type='submit']").click();
    cy.wait(4000);
    cy.get("#welcome2").should("be.visible");
    cy.get("input[name='org']").type("TestOrg");
    cy.get("button[type='submit']").click();
    cy.wait(4000);
  });
});