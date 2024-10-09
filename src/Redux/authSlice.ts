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
  'auth/loginUser',
  async ({ email, phone, loginType }: { email: string; phone: string; loginType: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login', {
        form_mode: 'login',
        login_type: loginType,
        email_id: email,
        phone: phone,
      });
      return response.data;
    } catch (error: any) {
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
