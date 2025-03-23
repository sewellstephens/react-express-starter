import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { PostHogProvider } from "posthog-js/react";
import cookies from './components/libs/getCookie.js'

const options = {
  api_host: 'https://us.i.posthog.com',
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
