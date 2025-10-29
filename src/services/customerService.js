import api from './api';

const CUSTOMER_URL = '/customers';

// Get all customers
const getCustomers = async (params = {}) => {
  const response = await api.get(CUSTOMER_URL, { params });
  return response.data;
};

// Get single customer
const getCustomer = async (id) => {
  const response = await api.get(`${CUSTOMER_URL}/${id}`);
  return response.data;
};

// Create customer
const createCustomer = async (customerData) => {
  const response = await api.post(CUSTOMER_URL, customerData);
  return response.data;
};

// Update customer
const updateCustomer = async (id, customerData) => {
  const response = await api.put(`${CUSTOMER_URL}/${id}`, customerData);
  return response.data;
};

// Delete customer
const deleteCustomer = async (id) => {
  const response = await api.delete(`${CUSTOMER_URL}/${id}`);
  return response.data;
};

// Get customer transactions
const getCustomerTransactions = async (id) => {
  const response = await api.get(`${CUSTOMER_URL}/${id}/transactions`);
  return response.data;
};

const customerService = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerTransactions,
};

export default customerService;

