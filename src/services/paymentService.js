import api from './api';

const PAYMENT_URL = '/payments';

// Get all payments
const getPayments = async (params = {}) => {
  const response = await api.get(PAYMENT_URL, { params });
  return response.data;
};

// Get single payment
const getPayment = async (id) => {
  const response = await api.get(`${PAYMENT_URL}/${id}`);
  return response.data;
};

// Create payment
const createPayment = async (paymentData) => {
  const response = await api.post(PAYMENT_URL, paymentData);
  return response.data;
};

// Update payment
const updatePayment = async (id, paymentData) => {
  const response = await api.put(`${PAYMENT_URL}/${id}`, paymentData);
  return response.data;
};

// Delete payment
const deletePayment = async (id) => {
  const response = await api.delete(`${PAYMENT_URL}/${id}`);
  return response.data;
};

// Get payments by customer
const getPaymentsByCustomer = async (customerId) => {
  const response = await api.get(`${PAYMENT_URL}/customer/${customerId}`);
  return response.data;
};

const paymentService = {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByCustomer,
};

export default paymentService;

