// store.js
import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './emailSlice'; // Create emailSlice.js

export const store = configureStore({
  reducer: {
    email: emailReducer,
  },
});
