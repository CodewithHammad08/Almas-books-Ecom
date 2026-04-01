import axios from 'axios';

// Create an Axios instance — proxy handles baseURL in dev (vite.config.js)
const api = axios.create({
    // Add /api if the user provided the base domain only, otherwise default to proxy /api
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
    withCredentials: true, // Send cookies (httpOnly auth cookies) on every request
});

// Track whether a refresh is already in progress to prevent parallel refresh storms
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only intercept 401s that aren't already a retry or the refresh call itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login')
        ) {
            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest))
                  .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to get a new access token using the httpOnly refresh cookie
                await api.post('/auth/refresh');
                processQueue(null);
                return api(originalRequest); // Retry the original failed request
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh failed — session is truly expired, redirect to login
                window.dispatchEvent(new CustomEvent('auth:logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
