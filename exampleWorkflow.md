name: Cypress testing
on: push
jobs:
  cypress-run:
    runs-on: ubuntu-24.04
    env:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      MONGODB_URI: ${{ secrets.MONGODB_URI }}
      JWT_KEY: ${{ secrets.JWT_KEY }}
      DOMAIN: 'localhost'
      PORT: '4090'
      FRONTEND_URL: 'http://localhost:3000'
      BACKEND_URL: 'http://localhost:4090'
      REACT_APP_API: 'http://localhost:4090'
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      GOOGLE_GEMINI_API_KEY: ${{ secrets.GOOGLE_GEMINI_API_KEY }}
      TESTOMATIO_API_KEY: ${{ secrets.TESTOMATIO }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install dependencies 1
        run: npm i --legacy-peer-deps
      - name: Install dependencies 2
        run: npm run packages:install
      - name: Start application
        run: npm run dev & sleep 20
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          browser: chrome
          spec: cypress/e2e/auth-tests/login.cy.js
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          browser: chrome
          spec: cypress/e2e/auth-tests/onboarding.cy.js