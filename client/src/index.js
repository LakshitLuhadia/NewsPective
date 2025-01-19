import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create a new <link> element
const link = document.createElement('link');

// Set the attributes for the <link> element
link.href = "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&family=Helvetica+Neue&display=swap";
link.rel = "stylesheet";

// Append the <link> element to the <head>
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
