import api from './api';

const PRODUCT_URL = '/inventory/products';

// Get all products
const getProducts = async (params = {}) => {
  const response = await api.get(PRODUCT_URL, { params });
  return response.data;
};

// Get single product
const getProduct = async (id) => {
  const response = await api.get(`${PRODUCT_URL}/${id}`);
  return response.data;
};

// Create product
const createProduct = async (productData) => {
  const response = await api.post(PRODUCT_URL, productData);
  return response.data;
};

// Update product
const updateProduct = async (id, productData) => {
  const response = await api.put(`${PRODUCT_URL}/${id}`, productData);
  return response.data;
};

// Delete product
const deleteProduct = async (id) => {
  const response = await api.delete(`${PRODUCT_URL}/${id}`);
  return response.data;
};

// Get categories
const getCategories = async () => {
  const response = await api.get(`${PRODUCT_URL}/categories`);
  return response.data;
};

// Update stock
const updateStock = async (id, stockData) => {
  const response = await api.put(`${PRODUCT_URL}/${id}/stock`, stockData);
  return response.data;
};

// Get low stock products
const getLowStock = async () => {
  const response = await api.get(`${PRODUCT_URL}/low-stock`);
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateStock,
  getLowStock,
};

export default productService;
