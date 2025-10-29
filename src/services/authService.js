import api from './api';

const AUTH_URL = '/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${AUTH_URL}/register`, userData);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${AUTH_URL}/login`, userData);
  if (response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// Get current user
const getMe = async () => {
  const response = await api.get(`${AUTH_URL}/me`);
  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put(`${AUTH_URL}/profile`, userData);
  if (response.data.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put(`${AUTH_URL}/change-password`, passwordData);
  return response.data;
};

// Logout
const logout = async () => {
  const response = await api.post(`${AUTH_URL}/logout`);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
};

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};

export default authService;
