import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Points to your App.js
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Loads App.js so your routes actually work */}
  </React.StrictMode>
);