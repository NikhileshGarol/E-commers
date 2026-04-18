import { create } from 'zustand';
import axios from 'axios';
import { API_CONFIG } from '../Api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,

    login: (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user: userData, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null, isAuthenticated: false });
    },

    updateLocation: async (location) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, location };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });

        // Persist to DB if logged in
        if (localStorage.getItem('token')) {
            try {
                await axios.put(`${API_CONFIG.BASE_URL}/api/user/location`, location);
            } catch (err) {
                console.error("Failed to persist location", err);
            }
        }
    }
}));

// Initialize axios header if token exists
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default useAuthStore;
