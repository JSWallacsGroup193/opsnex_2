/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import apiClient from './api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../types';

export const authService = {
  /**
   * Login user and get access token
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Logout user (client-side only - JWT is stateless)
   */
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Set token
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },
};
