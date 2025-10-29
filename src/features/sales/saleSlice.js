import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import saleService from '../../services/saleService';

const initialState = {
  sales: [],
  sale: null,
  loading: false,
  error: null,
};

// Get all sales
export const getSales = createAsyncThunk(
  'sales/getSales',
  async (params, thunkAPI) => {
    try {
      return await saleService.getSales(params);
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

// Get single sale
export const getSale = createAsyncThunk(
  'sales/getSale',
  async (id, thunkAPI) => {
    try {
      return await saleService.getSale(id);
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

// Create sale
export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, thunkAPI) => {
    try {
      return await saleService.createSale(saleData);
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

// Update sale
export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async ({ id, saleData }, thunkAPI) => {
    try {
      return await saleService.updateSale(id, saleData);
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

// Delete sale
export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, thunkAPI) => {
    try {
      return await saleService.deleteSale(id);
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

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.data.sales;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSale.fulfilled, (state, action) => {
        state.sale = action.payload.data.sale;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.push(action.payload.data.sale);
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.sales = state.sales.map(sale =>
          sale._id === action.payload.data.sale._id
            ? action.payload.data.sale
            : sale
        );
        state.sale = action.payload.data.sale;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.sales = state.sales.filter(sale =>
          sale._id !== action.meta.arg
        );
      });
  },
});

export const { reset } = saleSlice.actions;
export default saleSlice.reducer;
