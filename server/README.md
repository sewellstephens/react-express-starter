# Krastie AI API server

This is the server for Krastie AI API. It is a RESTful API that is used to interact with the Krastie AI APP.

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm run dev
```

### Run the server with PM2 (used for production environment to keep the server running)

```bash
npm start
```

### Things to note

- The server is running on port 4090
- The server is using the `jwt` to authenticate the user
- The server is using the `bcryptjs` to hash the password
- The server is using the `mongoose` to interact with the database
- Environment variables are required. See below


```bash
DOMAIN=localhost
FRONTEND_URL=https://localhost:3000
BACKEND_URL=https://localhost:4090
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://localhost:4090/users/googleCallback
JWT_KEY=
MONGODB_URI=
OPENAI_API_KEY=
ML_KEY=
PORT=4090
STRIPE_PRODUCT_PRO=
STRIPE_PRODUCT_STARTUP=
STRIPE_PUB_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PM2_PUBLIC_KEY=
PM2_SECRET_KEY=
CSRF_KEY=
HUMANIZER_API_KEY=
WEBFLOW_CLIENT_ID=
WEBFLOW_CLIENT_SECRET=
WEBFLOW_REDIRECT_URL=
NODE_ENV=development
PLUNK_API_KEY=
```


