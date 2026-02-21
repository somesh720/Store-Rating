import api from './api';

export const submitRating = async (storeId, rating) => {
  const response = await api.post('/ratings', { store_id: storeId, rating });
  return response.data;
};

export const getUserRatings = async () => {
  const response = await api.get('/ratings/my-ratings');
  return response.data;
};