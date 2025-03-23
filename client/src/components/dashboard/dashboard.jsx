import MainNav from './navigation/mainNav'

export default function Dashboard() {



  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to React Express Starter!!!</h1>
        <p className="text-sm mt-4 text-gray-900">This is a starter project for React and Express and includes Stripe integration, authentication, and more.</p>
        <p className="text-sm mt-4 text-gray-900">Getting started is easy, just follow the instructions below.</p>
        <ul className="list-disc mt-4 ml-4 list-inside text-sm text-gray-900">
            <li>Install dependencies: <span className="font-bold">npm install</span></li>
            <li>Add env variables in the server .env file as listed:</li>
            <ul className="list-disc ml-4 list-inside text-sm text-gray-900">
                <li>MONGO_URI - MongoDB URI</li>
                <li>JWT_SECRET - JWT Secret</li>
                <li>STRIPE_SECRET_KEY - Stripe Secret Key</li>
                <li>STRIPE_WEBHOOK_SECRET - Stripe Webhook Secret</li>
                <li>STRIPE_PUB_KEY - Stripe Publishable Key</li>
                <li>STRIPE_PRODUCT_PRO - Stripe Product ID for Pro Plan</li>
                <li>STRIPE_PRODUCT_STARTUP - Stripe Product ID for Startup Plan</li>
                <li>BACKEND_URL - Backend URL</li>
                <li>FRONTEND_URL - Frontend URL</li>
                <li>GOOGLE_CLIENT_ID - Google OAuth Client ID</li>
                <li>GOOGLE_CLIENT_SECRET - Google OAuth Client Secret</li>
                <li>PORT - Port</li>
                <li>NODE_ENV - Node Environment</li>
                <li>DOMAIN - Domain</li>
            </ul>
            <li>Add env variables in the client .env file as listed:</li>
            <ul className="list-disc ml-4 list-inside text-sm text-gray-900">
                <li>REACT_APP_API - API URL</li>
                <li>REACT_APP_PRO_MONTHLY - Pro Monthly Plan</li>
                <li>REACT_APP_STARTUP_MONTHLY - Startup Monthly Plan</li>
                <li>REACT_APP_PRO_YEARLY - Pro Yearly Plan</li>
                <li>REACT_APP_STARTUP_YEARLY - Startup Yearly Plan</li>
            </ul>
            <li>Run the whole app: <span className="font-bold">npm run dev</span></li>
            <li>Signup for an account and start using the app!</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-4">Publish your app:</h3>
        <p className="text-sm text-gray-900 mt-4">To publish your app, you will need a Railway account. You can sign up for a free account at <a href="https://railway.app" className="text-blue-500">Railway</a>.</p>
        <p className="text-sm text-gray-900 mt-4">Once you have an account, you will need to create two Railway projects. One for the server and one for the client. Make sure to set the environment variables in the Railway dashboard and set the root directory to the server and client folders respectively.</p>
        <p className="text-sm text-gray-900 mt-4">You will also need to set the domain in the Railway dashboard to the domain you want to use for your app. For example, if you want to use app.example.com, you will need to set the domain to app.example.com in the Railway dashboard and Railway environment variable for server.</p>
        <p className="text-sm text-gray-900 mt-4">We recommend using app.example.com as the domain for your app, and api.example.com as the domain for your API.</p>
        <p className="text-sm text-gray-900 mt-4">Once you have created the projects and set the environment variables, you can deploy your app. Once deployed, you will be able to access your app at the domain you set.</p>
      </div>
    </div>
  )
}