// src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store.js';

// Import toastify styles & container
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          {/* ToastContainer here so it's accessible anywhere */}
          <ToastContainer 
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
