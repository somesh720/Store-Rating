import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/admin/users?${params}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Add deleteUser function
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const getAllStores = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/admin/stores?${params}`);
  return response.data;
};

export const createStore = async (storeData) => {
  const response = await api.post('/admin/stores', storeData);
  return response.data;
};

export const deleteStore = async (id) => {
  const response = await api.delete(`/admin/stores/${id}`);
  return response.data;
};

export const updateStore = async (id, storeData) => {
  const response = await api.put(`/admin/stores/${id}`, storeData);
  return response.data;
};