import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the state interface
interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  redirectUrl: string | null;
}

// Define initial state
const initialState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  error: null,
  otpSent: false,
  redirectUrl: null,
};

// Define the login async thunk with types
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ identifier, identifierType, password }: { identifier: string; identifierType: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("identifier: "+identifier+"idenifierType: "+identifierType+"password: "+password)
      const response = await axios.post('/auth/login', {
        identifierType: identifierType,
        identifier: identifier,
        password: password,
      });
      console.log("token: "+response.data.token)
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the slice with types
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.error = null;
      state.redirectUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducer
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status === 'success') {
          state.otpSent = true;
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
