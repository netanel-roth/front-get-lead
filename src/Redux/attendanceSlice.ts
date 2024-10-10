import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../Axios/axios'; 
import { AttendanceType } from '../types/updateAttendanceTypes';

// Define the state interface
interface AttendanceState {
  attendances: AttendanceType[]; 
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: AttendanceState = {
  attendances: [],
  isLoading: false,
  error: null,
};

// Fetch attendance records for a specific user
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${userId}/attendances`);  
      console.log("attendances: "+JSON.stringify(response.data))
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add new attendance record
export const addAttendance = createAsyncThunk(
  'attendance/addAttendance',
  async (newAttendance: AttendanceType, { rejectWithValue }) => {
    try {
      console.log("new attendance: "+JSON.stringify(newAttendance));
      const response = await axios.post('/attendance/add', newAttendance); 
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the attendance slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.attendances = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.isLoading = false;
        state.attendances = action.payload; 
      })
      .addCase(fetchAttendance.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(addAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAttendance.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.attendances.push(action.payload); 
      })
      .addCase(addAttendance.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});


export const { clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
