import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (data: any) => {
    const response = await api.post('users/login/', data);
    if (response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
    }
    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post('users/register/', data);
    if (response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
    }
    return response.data;
};

export const forgotPassword = async (email: string) => {
    return await api.post('users/forgot-password/', { email });
};

export const verifyOtp = async (data: any) => {
    return await api.post('users/verify-otp/', data);
};

export const resetPassword = async (data: any) => {
    return await api.post('users/reset-password/', data);
};

export default api;
