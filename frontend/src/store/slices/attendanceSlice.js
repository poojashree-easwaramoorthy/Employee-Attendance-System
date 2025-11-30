// src/store/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

// Use the API_BASE_URL from config instead of hardcoded localhost
const API_URL = `${API_BASE_URL}/api`;

// Async thunks
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/attendance/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/attendance/checkout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async (filters, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/attendance/my-history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async (filters, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/attendance/my-summary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

// Manager thunks
export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async (filters, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/attendance/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Network error' });
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayStatus: null,
    myHistory: [],
    mySummary: null,
    allAttendance: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.todayStatus = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Check-in failed';
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.todayStatus = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Check-out failed';
      })
      // Get Today Status
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      .addCase(getTodayStatus.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get today status';
      })
      // Get My History
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      .addCase(getMyHistory.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get history';
      })
      // Get My Summary
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.mySummary = action.payload;
      })
      .addCase(getMySummary.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get summary';
      })
      // Get All Attendance (Manager)
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to get all attendance';
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;