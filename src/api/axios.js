import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const publicEndpoints = ['/accounts/register/', '/accounts/login/'];
  const isPublic = publicEndpoints.some((endpoint) => config.url.includes(endpoint));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// When an access token expires (30 min lifetime) but the refresh token is
// still valid (1 day), silently get a new access token instead of leaving
// the user "logged in" with a dead token and every request failing.
let isRefreshing = false;
let pendingRequests = [];

const resolvePending = (newToken) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest.url.includes('/accounts/login/') ||
      originalRequest.url.includes('/accounts/register/') ||
      originalRequest.url.includes('/accounts/token/refresh/');

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // A refresh is already in flight — queue this request behind it
      // instead of firing a second, redundant refresh call.
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(API(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccessToken = res.data.access;
      localStorage.setItem('access_token', newAccessToken);
      resolvePending(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    } catch (refreshError) {
      // Refresh token itself is expired/invalid — this is the one case
      // that genuinely requires logging in again.
      resolvePending(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;