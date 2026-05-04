import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
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