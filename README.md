# Welcome to React Express Starter!!!

This is a starter project for React and Express and includes Stripe integration, authentication, and more.

Uses Caddy server for Railway deployment for client, and PM2 (Keeps server alive) for Railway deployment for server.

## Getting Started

Getting started is easy, just follow the instructions below.

### Clone the repo

```bash
git clone https://github.com/anchorpenewersoft/react-express-starter.git
```

### Installation

- **Install dependencies:**  
  ```bash
  npm install
  ```

- **Add environment variables in the server `.env` file as listed:**
  - `MONGO_URI` - MongoDB URI
  - `JWT_SECRET` - JWT Secret
  - `STRIPE_SECRET_KEY` - Stripe Secret Key
  - `STRIPE_WEBHOOK_SECRET` - Stripe Webhook Secret
  - `STRIPE_PUB_KEY` - Stripe Publishable Key
  - `STRIPE_PRODUCT_PRO` - Stripe Product ID for Pro Plan
  - `STRIPE_PRODUCT_STARTUP` - Stripe Product ID for Startup Plan
  - `BACKEND_URL` - Backend URL
  - `FRONTEND_URL` - Frontend URL
  - `GOOGLE_CLIENT_ID` - Google OAuth Client ID
  - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
  - `PORT` - Port
  - `NODE_ENV` - Node Environment
  - `DOMAIN` - Domain
  - `PLUNK_API_KEY` - Plunk API Key

- **Add environment variables in the client `.env` file as listed:**
  - `REACT_APP_API` - API URL
  - `REACT_APP_PRO_MONTHLY` - Pro Monthly Plan
  - `REACT_APP_STARTUP_MONTHLY` - Startup Monthly Plan
  - `REACT_APP_PRO_YEARLY` - Pro Yearly Plan
  - `REACT_APP_STARTUP_YEARLY` - Startup Yearly Plan

- **Run the whole app:**  
  ```bash
  npm run dev
  ```

- **Signup for an account and start using the app!**

## Publish Your App

To publish your app, you will need a Railway account. You can sign up for a free account at [Railway](https://railway.app).

1. Once you have an account, you will need to create two Railway projects. One for the server and one for the client.
2. Make sure to set the environment variables in the Railway dashboard and set the root directory to the server and client folders respectively.
3. You will also need to set the domain in the Railway dashboard to the domain you want to use for your app. For example, if you want to use `app.example.com`, you will need to set the domain to `app.example.com` in the Railway dashboard and Railway environment variable for server.
4. We recommend using `app.example.com` as the domain for your app, and `api.example.com` as the domain for your API.
5. Once you have created the projects and set the environment variables, you can deploy your app. Once deployed, you will be able to access your app at the domain you set.

## Run Tests

To run tests, you can use the following command:

```bash
npm run cypress:run
```

As an bonus, we have included a few tests for you to run and a github action template to run the tests (exampleWorkflow.md). Also make sure `Wait for CI` is enabled in the Railway settings before deploying.

## Using with Testomat.io

We have included a testomat.io reporter in the project. To use it, you will need to sign up for a paid account at [Testomat.io](https://testomat.io/).

1. Once you have signed up for an account, you will need to create a new project.
2. You will need to create a new API key.
3. You will need to add the API key to the project root .env file as `TESTOMATIO_API_KEY`.

## Setting up Google OAuth

To set up Google OAuth, you will need to create a project in the Google Cloud Console. You can sign up for a free account at [Google Cloud Console](https://console.cloud.google.com/).

1. Once you have created a project, you will need to create OAuth credentials.
2. You will need to create an OAuth client ID and secret.
3. You will need to create an OAuth redirect URI.
4. You will need to create an OAuth client ID and secret.

## Setting up Plunk (No longer recommended)

## Setting up Nodemailer for transactional emails (coming soon)

## Notes

- This project is built with React, Express, MongoDB, and Stripe.
- The project includes authentication, authorization, and more.
- The project includes a dashboard with a sidebar and a main content area.
- The project includes a login page, signup page, and forgot password page.
- The project includes a pricing page with a pro and startup plan.
- The project includes a checkout page with a pro and startup plan.
- The project includes a Google OAuth integration.
- The project includes a Stripe integration.
- The project includes a Plunk integration.
- The project includes a Testomat.io integration.


## FAQ

- **How do I deploy the app?**
  - See the [Publish Your App](#publish-your-app) section for instructions.

- **Does it come with landing pages?**
  - No, this is a starter app, you will need to build your own landing pages which you can easily do with Framer or Webflow. Assuming you have a domain, you can easily point your domain to the starter app with an app. (ex: app.example.com) subdomain.

- **Does it come with a dashboard?**
  - Sort of, the dashboard has a sidebar and main content area (main content is currently just a placeholder with instructions). You can easily customize the sidebar and main content area to your liking.

- **Does it come with a pricing page?**
  - Yes, the pricing page has a pro and startup plan. You can easily customize the pricing page to your liking.

- **Does it come with a checkout page?**
  - Depends on what you mean by checkout page. The starter app links to Stripe for checkout, so you will need to set up Stripe to use a checkout page.

- **Does it come with a Google OAuth integration?**
  - Yes, the starter app includes a Google OAuth integration. You can easily customize the Google OAuth integration to your liking.

- **Does it come with a Stripe integration?**
  - Yes, the starter app includes a Stripe integration. You can easily customize the Stripe integration to your liking.

- **What is used for testing?**
  - The starter app uses Cypress for testing. You can also optionally use [Testomat.io](https://testomat.io/) for testing.



## Licensing

This starter app is licensed under [MIT License](LICENSE). You can freely use this starter app for your own projects, just note that we are not responsible for any issues that may arise from using this starter app and updates may not be made often.

