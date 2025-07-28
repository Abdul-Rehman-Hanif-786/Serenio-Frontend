import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Replace this with your actual public Stripe key
const stripePromise = loadStripe('pk_test_YourPublicKeyHere');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);
