import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Load the user's saved theme from localStorage (defaults to 'light')
const savedTheme = localStorage.getItem("theme") || "light";

// Set the HTML document's theme attribute for CSS theming
document.documentElement.setAttribute("data-theme", savedTheme);

// Boot the React application and mount it to the #app element
ReactDOM.createRoot(document.getElementById('app')).render(

  // Enable React StrictMode for highlighting potential issues during development
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
