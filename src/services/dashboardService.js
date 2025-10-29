import api from './api';

const DASHBOARD_URL = '/dashboard';

// Get dashboard stats
const getDashboardStats = async () => {
  const response = await api.get(`${DASHBOARD_URL}/stats`);
  return response.data;
};

// Get recent activities
const getRecentActivities = async (limit = 10) => {
  const response = await api.get(`${DASHBOARD_URL}/activities`, { params: { limit } });
  return response.data;
};

const dashboardService = {
  getDashboardStats,
  getRecentActivities,
};

export default dashboardService;

