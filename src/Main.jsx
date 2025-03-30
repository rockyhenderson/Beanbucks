import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// index.js or main.jsx (whichever boots up your app)
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
