import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const publicEndpoints = ['/accounts/register/', '/accounts/login/'];
  const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
  
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;