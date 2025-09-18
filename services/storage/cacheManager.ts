// Cache manager for intelligent data caching and synchronization
import { offlineStorage, STORAGE_KEYS } from './offlineStorage';

export interface CacheConfig {
    maxAge: number; // in minutes
    autoRefresh: boolean;
    fallbackToCache: boolean;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxAge: 60, // 1 hour
    autoRefresh: true,
    fallbackToCache: true,
};

class CacheManager {
    private configs: Map<string, CacheConfig> = new Map();

    // Set cache configuration for a specific key
    setCacheConfig(key: string, config: Partial<CacheConfig>): void {
        this.configs.set(key, { ...DEFAULT_CACHE_CONFIG, ...config });
    }

    // Get cache configuration for a key
    private getCacheConfig(key: string): CacheConfig {
        return this.configs.get(key) || DEFAULT_CACHE_CONFIG;
    }

    // Generic cache get with automatic refresh
    async getCachedData<T>(
        key: string,
        fetchFunction: () => Promise<T>,
        config?: Partial<CacheConfig>
    ): Promise<T | null> {
        const cacheConfig = config ? { ...DEFAULT_CACHE_CONFIG, ...config } : this.getCacheConfig(key);

        try {
            // Check if cached data exists and is fresh
            const isStale = await offlineStorage.isDataStale(key, cacheConfig.maxAge);

            if (!isStale) {
                const cachedData = await offlineStorage.getItem<T>(key);
                if (cachedData !== null) {
                    return cachedData;
                }
            }

            // Data is stale or doesn't exist, fetch fresh data
            if (cacheConfig.autoRefresh) {
                try {
                    const freshData = await fetchFunction();
                    await offlineStorage.setItem(key, freshData);
                    return freshData;
                } catch (error) {
                    console.error('[Cache] Error fetching fresh data:', error);

                    // Fall back to cached data if available
                    if (cacheConfig.fallbackToCache) {
                        const cachedData = await offlineStorage.getItem<T>(key);
                        if (cachedData !== null) {
                            console.log('[Cache] Falling back to cached data');
                            return cachedData;
                        }
                    }

                    throw error;
                }
            }

            // Return cached data even if stale
            return await offlineStorage.getItem<T>(key);
        } catch (error) {
            console.error('[Cache] Error in getCachedData:', error);
            return null;
        }
    }

    // Force refresh cached data
    async refreshCache<T>(key: string, fetchFunction: () => Promise<T>): Promise<T> {
        try {
            const freshData = await fetchFunction();
            await offlineStorage.setItem(key, freshData);
            return freshData;
        } catch (error) {
            console.error('[Cache] Error refreshing cache:', error);
            throw error;
        }
    }

    // Invalidate cache for a specific key
    async invalidateCache(key: string): Promise<void> {
        await offlineStorage.removeItem(key);
    }

    // Invalidate all cache
    async invalidateAllCache(): Promise<void> {
        await offlineStorage.clear();
    }

    // Preload cache with data
    async preloadCache<T>(key: string, data: T): Promise<void> {
        await offlineStorage.setItem(key, data);
    }

    // Get cache statistics
    async getCacheStats(): Promise<{
        totalKeys: number;
        staleKeys: string[];
        freshKeys: string[];
    }> {
        try {
            const allKeys = Object.values(STORAGE_KEYS);
            const staleKeys: string[] = [];
            const freshKeys: string[] = [];

            for (const key of allKeys) {
                const isStale = await offlineStorage.isDataStale(key);
                if (isStale) {
                    staleKeys.push(key);
                } else {
                    freshKeys.push(key);
                }
            }

            return {
                totalKeys: allKeys.length,
                staleKeys,
                freshKeys,
            };
        } catch (error) {
            console.error('[Cache] Error getting cache stats:', error);
            return {
                totalKeys: 0,
                staleKeys: [],
                freshKeys: [],
            };
        }
    }

    // Cleanup old cache entries
    async cleanupCache(): Promise<void> {
        try {
            const stats = await this.getCacheStats();

            // Remove stale entries that are older than 24 hours
            for (const key of stats.staleKeys) {
                const isVeryStale = await offlineStorage.isDataStale(key, 24 * 60); // 24 hours
                if (isVeryStale) {
                    await offlineStorage.removeItem(key);
                    console.log(`[Cache] Cleaned up stale cache entry: ${key}`);
                }
            }
        } catch (error) {
            console.error('[Cache] Error during cache cleanup:', error);
        }
    }
}

// Export singleton instance
export const cacheManager = new CacheManager();

// Pre-configure cache settings for common data types
cacheManager.setCacheConfig(STORAGE_KEYS.DRIVER_JOBS, {
    maxAge: 30, // 30 minutes for job data
    autoRefresh: true,
    fallbackToCache: true,
});

cacheManager.setCacheConfig(STORAGE_KEYS.DRIVER_ROUTES, {
    maxAge: 60, // 1 hour for route data
    autoRefresh: true,
    fallbackToCache: true,
});

cacheManager.setCacheConfig(STORAGE_KEYS.CUSTOMER_SCHEDULE, {
    maxAge: 15, // 15 minutes for schedule data
    autoRefresh: true,
    fallbackToCache: true,
});