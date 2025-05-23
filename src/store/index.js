import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // User authentication state
    user: userReducer,
    // Task management state
    tasks: taskReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});