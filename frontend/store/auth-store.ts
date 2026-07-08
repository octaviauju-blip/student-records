import { create } from 'zustand';
import apiClient from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string;
  isAuthenticated: boolean;

  signin: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUserFromStorage: () => void;
  markVerified: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: '',
  isAuthenticated: false,

  signin: async (email: string, password: string) => {
    set({ isLoading: true, error: '' });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const token = response.data?.access_token;
      const user = response.data?.user;

      if (!token) throw new Error('No token received from server');

      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      set({ user: user || null, token, isAuthenticated: true, isLoading: false, error: '' });
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: message, isAuthenticated: false });
      throw new Error(message);
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: '' });
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      const token = response.data?.access_token;
      const user = response.data?.user;

      if (!token) throw new Error('No token received from server');

      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      set({ user: user || null, token, isAuthenticated: true, isLoading: false, error: '' });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isLoading: true, error: '' });
    try {
      await apiClient.post('/auth/verify-otp', { email, otp });
      get().markVerified();
      set({ isLoading: false, error: '' });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Verification failed. Please try again.';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  resendOtp: async (email: string) => {
    set({ isLoading: true, error: '' });
    try {
      await apiClient.post('/auth/resend-otp', { email });
      set({ isLoading: false, error: '' });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend code.';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  markVerified: () => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, isVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: '' }),

  loadUserFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
}));