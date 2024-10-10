import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../Axios/axios';
import { UserType } from '../types/loginTypes';
import { RootState } from './store';

// Define the state interface
interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  redirectUrl: string | null;
  token: string | null;
  user: UserType | null;
}


// Define initial state
const initialState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  error: null,
  otpSent: false,
  redirectUrl: null,
  token: null,
  user: null,
};

// Define the login async thunk with types
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ identifier, identifierType, password }: { identifier: string; identifierType: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', {
        identifierType: identifierType,
        identifier: identifier,
        password: password,
      });
      console.log("response: " + JSON.stringify(response.data))

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
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status === 'success') {
          state.isLoggedIn = true;
          state.token = action.payload.token;
          state.user = {
            id: action.payload.data.user.id,
            firstName: action.payload.data.user.firstName,
            lastName: action.payload.data.user.lastName,
            email: action.payload.data.user.email,
            phone: action.payload.data.user.phone,
          };
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

export const selectUser = (state: RootState) => state.auth.user;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
