import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    // Because we use a proxy in vite.config.js, we don't need the full URL here during development
    // Just the base path for your API
    baseURL: '/api', 
    // This ensures cookies are sent with requests (important for auth tokens)
    withCredentials: true,
});

// Response interceptor for handling common errors, e.g., token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 Unauthorized (and it's not the login request),
        // you might want to try refreshing the token here depending on your backend logic
        if (error.response?.status === 401 && !originalRequest._retry) {
            // handle error here or let the components handle it
        }
        
        return Promise.reject(error);
    }
);

export default api;
