import axios from 'axios';

const apiInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for token handling or error mapping
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Map backend error messages or handle global errors
        return Promise.reject(error);
    }
);

export default apiInstance;
