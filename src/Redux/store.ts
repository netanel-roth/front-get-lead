import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import attendanceReducer from './attendanceSlice';
import authReducer from './'

// Create and configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,  
    attendance:attendanceReducer,
    form:formReducer
  },
});

// Define the RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;