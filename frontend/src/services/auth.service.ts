import api from './api';
import { AuthResponse, User } from '@/src/types';

export const authService = {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/firebase-login', { idToken });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
