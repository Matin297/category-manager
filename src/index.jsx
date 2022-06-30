import React from 'react';
import ReactDOM from 'react-dom/client';

import CategoryProvider from './store/category-context'

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CategoryProvider><App /></CategoryProvider>
  </React.StrictMode>
);
