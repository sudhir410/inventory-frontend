import api from './api';

const SALE_URL = '/sales';

// Get all sales
const getSales = async (params = {}) => {
  const response = await api.get(SALE_URL, { params });
  return response.data;
};

// Get single sale
const getSale = async (id) => {
  const response = await api.get(`${SALE_URL}/${id}`);
  return response.data;
};

// Create sale
const createSale = async (saleData) => {
  const response = await api.post(SALE_URL, saleData);
  return response.data;
};

// Update sale
const updateSale = async (id, saleData) => {
  const response = await api.put(`${SALE_URL}/${id}`, saleData);
  return response.data;
};

// Delete sale
const deleteSale = async (id) => {
  const response = await api.delete(`${SALE_URL}/${id}`);
  return response.data;
};

// Get sales by customer
const getSalesByCustomer = async (customerId) => {
  const response = await api.get(`${SALE_URL}/customer/${customerId}`);
  return response.data;
};

// Get sales report
const getSalesReport = async (params = {}) => {
  const response = await api.get(`${SALE_URL}/report`, { params });
  return response.data;
};

const saleService = {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  getSalesByCustomer,
  getSalesReport,
};

export default saleService;

