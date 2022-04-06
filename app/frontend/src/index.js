import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { URL } from './config/Settings'

(async () => {
  const { key } = await fetch(`${URL}stripe-key`).then(r => r.json())
  const stripePromise = loadStripe(key);

  ReactDOM.render(
    <React.StrictMode>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </React.StrictMode>,
    document.getElementById('root')
  );
}) ()
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
