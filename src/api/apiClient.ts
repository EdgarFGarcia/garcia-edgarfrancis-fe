import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    },
    withCredentials: true,
});

// Request Interceptor (Attach Token)
apiClient.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
        const storedData = JSON.parse(localStorage.getItem('unauth') || '{}');
        const token: string | undefined = storedData?.token;

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor (Handle Unauthorized)
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            router.push({ name: 'Login' });
            location.reload();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
