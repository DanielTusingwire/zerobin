// API Service - placeholder for future backend integration
// TODO: Replace mock implementations with actual API calls

import { ApiResponse } from '../../types/common';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.ecotrack.com';
const API_TIMEOUT = 10000; // 10 seconds

// API client configuration
class ApiClient {
    private baseURL: string;
    private timeout: number;
    private headers: Record<string, string>;

    constructor() {
        this.baseURL = API_BASE_URL;
        this.timeout = API_TIMEOUT;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    // Set authentication token
    setAuthToken(token: string) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    // Remove authentication token
    clearAuthToken() {
        delete this.headers['Authorization'];
    }

    // Generic API request method
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config: RequestInit = {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers,
                },
                timeout: this.timeout,
            };

            // TODO: Replace with actual fetch call when backend is ready
            // const response = await fetch(url, config);
            // const data = await response.json();

            // Mock response for development
            console.log(`[API] Mock request to ${endpoint}`, options);

            return {
                data: {} as T,
                success: true,
                message: 'Mock API response - replace with actual implementation',
            };
        } catch (error) {
            console.error('[API] Request failed:', error);
            return {
                data: {} as T,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // HTTP methods
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// API endpoints - to be implemented with actual backend
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',

    // Driver endpoints
    DRIVER_JOBS: '/driver/jobs',
    DRIVER_ROUTES: '/driver/routes',
    DRIVER_PROFILE: '/driver/profile',
    JOB_UPDATE: '/driver/jobs/:id',
    PHOTO_UPLOAD: '/driver/jobs/:id/photos',
    SCAN_RECORD: '/driver/jobs/:id/scans',

    // Customer endpoints
    CUSTOMER_REQUESTS: '/customer/requests',
    CUSTOMER_SCHEDULE: '/customer/schedule',
    CUSTOMER_FEEDBACK: '/customer/feedback',
    CUSTOMER_PROFILE: '/customer/profile',
    WASTE_TIPS: '/customer/tips',

    // Common endpoints
    NOTIFICATIONS: '/notifications',
    UPLOAD: '/upload',
} as const;