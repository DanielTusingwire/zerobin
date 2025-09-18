// Mock data service exports
// This file provides centralized access to all mock data services
// TODO: Replace with actual API calls when backend is ready

export * from './customerData';
export * from './driverJobs';
export * from './notifications';
export * from './routes';

// Mock API service configuration
export const MOCK_API_DELAY = 500; // Simulate network delay in milliseconds
export const MOCK_API_FAILURE_RATE = 0.05; // 5% chance of simulated API failure

// Utility function to simulate API calls with delay and potential failure
export const simulateApiCall = <T>(data: T, delay: number = MOCK_API_DELAY): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < MOCK_API_FAILURE_RATE) {
                reject(new Error('Simulated API failure'));
            } else {
                resolve(data);
            }
        }, delay);
    });
};

// Mock data statistics for development insights
export const getMockDataStats = () => {
    return {
        totalJobs: 6,
        totalRoutes: 3,
        totalCustomers: 6,
        totalPickupRequests: 3,
        totalFeedback: 2,
        totalNotifications: 12,
        lastUpdated: new Date(),
    };
};

// Reset all mock data to initial state (useful for testing)
export const resetMockData = () => {
    console.log('Mock data reset to initial state');
    // In a real implementation, this would reset all mock arrays
    // For now, it's just a placeholder
};

// Seed additional mock data for testing
export const seedMockData = (options: {
    additionalJobs?: number;
    additionalCustomers?: number;
    additionalNotifications?: number;
} = {}) => {
    console.log('Seeding additional mock data:', options);
    // In a real implementation, this would generate additional mock data
    // For now, it's just a placeholder
};