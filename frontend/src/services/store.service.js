import api from './api';

export const getAllStores = async (search = '') => {
  const response = await api.get(`/stores${search ? `?search=${search}` : ''}`);
  return response.data;
};

export const getStoreById = async (id) => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

export const getOwnerDashboard = async () => {
  const response = await api.get('/stores/owner/dashboard');
  return response.data;
};