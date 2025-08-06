// src/redux/store.js or src/app/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../ReduxSlice/user/userSlice'
import formReducer from '../ReduxSlice/formData/formSlice';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web

// Combine all reducers (only one now, but scalable)
const rootReducer = combineReducers({
  user: userReducer,
  formData: formReducer
});

// Redux Persist config
const persistConfig = {
  key: 'root',       // Storage key in localStorage
  storage,           // Default = localStorage
  version: 1,        // Useful for migrations
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required by redux-persist
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);
