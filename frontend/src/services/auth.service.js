import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const changePassword = (currentPassword, newPassword) => {
  return api.post('/auth/change-password', { currentPassword, newPassword });
};