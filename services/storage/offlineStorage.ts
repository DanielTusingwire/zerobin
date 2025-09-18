// Offline storage service using AsyncStorage
// TODO: Add encryption for sensitive data in production

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
    DRIVER_JOBS: 'driver_jobs',
    DRIVER_ROUTES: 'driver_routes',
    CUSTOMER_REQUESTS: 'customer_requests',
    CUSTOMER_SCHEDULE: 'customer_schedule',
    USER_PROFILE: 'user_profile',
    OFFLINE_QUEUE: 'offline_queue',
    APP_SETTINGS: 'app_settings',
    CACHE_TIMESTAMP: 'cache_timestamp',
} as const;

class OfflineStorageService {
    // Generic storage methods
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify({
                data: value,
                timestamp: new Date().toISOString(),
            });
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('[Storage] Error saving data:', error);
            throw error;
        }
    }

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue === null) return null;

            const parsed = JSON.parse(jsonValue);
            return parsed.data;
        } catch (error) {
            console.error('[Storage] Error retrieving data:', error);
            return null;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('[Storage] Error removing data:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('[Storage] Error clearing storage:', error);
            throw error;
        }
    }

    // Check if data is stale (older than specified minutes)
    async isDataStale(key: string, maxAgeMinutes: number = 60): Promise<boolean> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            if (jsonValue === null) return true;

            const parsed = JSON.parse(jsonValue);
            const timestamp = new Date(parsed.timestamp);
            const now = new Date();
            const ageMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60);

            return ageMinutes > maxAgeMinutes;
        } catch (error) {
            console.error('[Storage] Error checking data age:', error);
            return true;
        }
    }

    // Specific methods for common data types
    async cacheDriverJobs(jobs: any[]): Promise<void> {
        await this.setItem(STORAGE_KEYS.DRIVER_JOBS, jobs);
    }

    async getCachedDriverJobs(): Promise<any[] | null> {
        return this.getItem(STORAGE_KEYS.DRIVER_JOBS);
    }

    async cacheDriverRoutes(routes: any[]): Promise<void> {
        await this.setItem(STORAGE_KEYS.DRIVER_ROUTES, routes);
    }

    async getCachedDriverRoutes(): Promise<any[] | null> {
        return this.getItem(STORAGE_KEYS.DRIVER_ROUTES);
    }

    async cacheCustomerRequests(requests: any[]): Promise<void> {
        await this.setItem(STORAGE_KEYS.CUSTOMER_REQUESTS, requests);
    }

    async getCachedCustomerRequests(): Promise<any[] | null> {
        return this.getItem(STORAGE_KEYS.CUSTOMER_REQUESTS);
    }

    async cacheCustomerSchedule(schedule: any[]): Promise<void> {
        await this.setItem(STORAGE_KEYS.CUSTOMER_SCHEDULE, schedule);
    }

    async getCachedCustomerSchedule(): Promise<any[] | null> {
        return this.getItem(STORAGE_KEYS.CUSTOMER_SCHEDULE);
    }

    // Offline queue management
    async addToOfflineQueue(action: any): Promise<void> {
        try {
            const queue = await this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || [];
            const updatedQueue = Array.isArray(queue) ? [...queue, action] : [action];
            await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
        } catch (error) {
            console.error('[Storage] Error adding to offline queue:', error);
        }
    }

    async getOfflineQueue(): Promise<any[]> {
        const queue = await this.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
        return Array.isArray(queue) ? queue : [];
    }

    async clearOfflineQueue(): Promise<void> {
        await this.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
    }

    async removeFromOfflineQueue(actionId: string): Promise<void> {
        try {
            const queue = await this.getOfflineQueue();
            const updatedQueue = queue.filter(action => action.id !== actionId);
            await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
        } catch (error) {
            console.error('[Storage] Error removing from offline queue:', error);
        }
    }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();