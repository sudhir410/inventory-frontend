import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerService from '../../services/customerService';

const initialState = {
  customers: [],
  customer: null,
  customerSales: [],
  customerPayments: [],
  salesStats: null,
  paymentStats: null,
  overallStatus: null,
  statusMessage: null,
  adjustedOutstanding: null,
  loading: false,
  error: null,
};

// Get all customers
export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async (params, thunkAPI) => {
    try {
      return await customerService.getCustomers(params);
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

// Get single customer
export const getCustomer = createAsyncThunk(
  'customers/getCustomer',
  async (id, thunkAPI) => {
    try {
      return await customerService.getCustomer(id);
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

// Create customer
export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, thunkAPI) => {
    try {
      return await customerService.createCustomer(customerData);
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

// Update customer
export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, thunkAPI) => {
    try {
      return await customerService.updateCustomer(id, customerData);
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

// Delete customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, thunkAPI) => {
    try {
      return await customerService.deleteCustomer(id);
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

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data.customers;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCustomer.fulfilled, (state, action) => {
        state.customer = action.payload.data.customer;
        state.customerSales = action.payload.data.sales || [];
        state.customerPayments = action.payload.data.payments || [];
        state.salesStats = action.payload.data.salesStats || null;
        state.paymentStats = action.payload.data.paymentStats || null;
        state.overallStatus = action.payload.data.overallStatus || null;
        state.statusMessage = action.payload.data.statusMessage || null;
        state.adjustedOutstanding = action.payload.data.adjustedOutstanding || null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload.data.customer);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.map(customer =>
          customer._id === action.payload.data.customer._id
            ? action.payload.data.customer
            : customer
        );
        state.customer = action.payload.data.customer;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer =>
          customer._id !== action.meta.arg
        );
      });
  },
});

export const { reset } = customerSlice.actions;
export default customerSlice.reducer;
