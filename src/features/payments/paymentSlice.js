import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/paymentService';

const initialState = {
  payments: [],
  payment: null,
  loading: false,
  error: null,
};

// Get all payments
export const getPayments = createAsyncThunk(
  'payments/getPayments',
  async (params, thunkAPI) => {
    try {
      return await paymentService.getPayments(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single payment
export const getPayment = createAsyncThunk(
  'payments/getPayment',
  async (id, thunkAPI) => {
    try {
      return await paymentService.getPayment(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create payment
export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.createPayment(paymentData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update payment
export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, paymentData }, thunkAPI) => {
    try {
      return await paymentService.updatePayment(id, paymentData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete payment
export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id, thunkAPI) => {
    try {
      return await paymentService.deletePayment(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data.payments;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPayment.fulfilled, (state, action) => {
        state.payment = action.payload.data.payment;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload.data.payment);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.payments = state.payments.map(payment =>
          payment._id === action.payload.data.payment._id
            ? action.payload.data.payment
            : payment
        );
        state.payment = action.payload.data.payment;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(payment =>
          payment._id !== action.meta.arg
        );
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
