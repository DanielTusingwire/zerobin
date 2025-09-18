// Unified data service layer that combines all mock data services
// This provides a single interface for accessing all data operations
// TODO: Replace with actual API service when backend is ready

import { UserRole } from '../types/common';
import { customerDataService } from './mockData/customerData';
import { driverJobsService } from './mockData/driverJobs';
import { notificationsService } from './mockData/notifications';
import { routesService } from './mockData/routes';

// Unified data service interface
export class DataService {
    // Driver-related operations
    driver = {
        // Jobs
        getJobs: driverJobsService.getJobs,
        getJobsByStatus: driverJobsService.getJobsByStatus,
        getJob: driverJobsService.getJob,
        updateJobStatus: driverJobsService.updateJobStatus,
        addJobPhoto: driverJobsService.addJobPhoto,
        deleteJobPhoto: driverJobsService.deleteJobPhoto,
        addScanRecord: driverJobsService.addScanRecord,
        getTodaysJobs: driverJobsService.getTodaysJobs,
        searchJobs: driverJobsService.searchJobs,

        // Routes
        getRoutes: driverJobsService.getRoutes,
        getActiveRoute: driverJobsService.getActiveRoute,

        // Profile and stats
        getProfile: driverJobsService.getDriverProfile,
        getStats: driverJobsService.getDriverStats,
        getScanRecords: driverJobsService.getScanRecords,
    };

    // Customer-related operations
    customer = {
        // Pickup requests
        getPickupRequests: customerDataService.getPickupRequests,
        createPickupRequest: customerDataService.createPickupRequest,
        updatePickupRequest: customerDataService.updatePickupRequest,

        // Scheduled pickups
        getScheduledPickups: customerDataService.getScheduledPickups,
        getUpcomingPickups: customerDataService.getUpcomingPickups,

        // Feedback
        getFeedback: customerDataService.getFeedback,
        submitFeedback: customerDataService.submitFeedback,

        // Profile and preferences
        getProfile: customerDataService.getCustomerProfile,
        updateProfile: customerDataService.updateCustomerProfile,
        getPreferences: customerDataService.getCustomerPreferences,
        updatePreferences: customerDataService.updateCustomerPreferences,

        // Waste tips
        getWasteTips: customerDataService.getWasteTips,
        getTipCategories: customerDataService.getTipCategories,
        searchTips: customerDataService.searchTips,

        // Service history and analytics
        getServiceHistory: customerDataService.getServiceHistory,
        getAnalytics: customerDataService.getCustomerAnalytics,

        // Notifications
        getNotifications: customerDataService.getNotifications,
        markNotificationAsRead: customerDataService.markNotificationAsRead,
    };

    // Route-related operations
    routes = {
        getRoutes: routesService.getRoutes,
        getActiveRoute: routesService.getActiveRoute,
        getRoute: routesService.getRoute,
        createRoute: routesService.createRoute,
        updateRouteStatus: routesService.updateRouteStatus,
        optimizeRoute: routesService.optimizeRoute,
        getRouteStats: routesService.getRouteStats,
        getNearbyLocations: routesService.getNearbyLocations,
        calculateRoute: routesService.calculateRoute,
        getDepotLocation: routesService.getDepotLocation,
        getServiceArea: routesService.getServiceArea,
        isWithinServiceArea: routesService.isWithinServiceArea,
        getEstimatedTravelTime: routesService.getEstimatedTravelTime,
    };

    // Notification operations
    notifications = {
        getNotifications: notificationsService.getNotifications,
        getUnreadCount: notificationsService.getUnreadCount,
        markAsRead: notificationsService.markAsRead,
        markAllAsRead: notificationsService.markAllAsRead,
        createNotification: notificationsService.createNotification,
        createCustomerNotification: notificationsService.createCustomerNotification,
        deleteNotification: notificationsService.deleteNotification,
        getNotificationsByType: notificationsService.getNotificationsByType,
        generateNotification: notificationsService.generateNotification,
        scheduleNotification: notificationsService.scheduleNotification,
    };

    // Cross-service operations
    async getDashboardData(userId: string, userRole: UserRole) {
        try {
            if (userRole === 'driver') {
                const [jobs, activeRoute, stats, notifications] = await Promise.all([
                    this.driver.getTodaysJobs(),
                    this.driver.getActiveRoute(userId),
                    this.driver.getStats(userId),
                    this.notifications.getNotifications(userId, 'driver'),
                ]);

                return {
                    jobs,
                    activeRoute,
                    stats,
                    notifications: notifications.slice(0, 5), // Latest 5 notifications
                    unreadCount: notifications.filter(n => !n.read).length,
                };
            } else {
                const [upcomingPickups, recentRequests, analytics, notifications] = await Promise.all([
                    this.customer.getUpcomingPickups(userId),
                    this.customer.getPickupRequests(userId),
                    this.customer.getAnalytics(userId),
                    this.notifications.getNotifications(userId, 'customer'),
                ]);

                return {
                    upcomingPickups,
                    recentRequests: recentRequests.slice(0, 3), // Latest 3 requests
                    analytics,
                    notifications: notifications.slice(0, 5), // Latest 5 notifications
                    unreadCount: notifications.filter(n => !n.read).length,
                };
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    // Search across all data types
    async globalSearch(query: string, userRole: UserRole) {
        try {
            const results: any = {
                jobs: [],
                customers: [],
                tips: [],
                notifications: [],
            };

            if (userRole === 'driver') {
                results.jobs = await this.driver.searchJobs(query);
            } else {
                results.tips = await this.customer.searchTips(query);
            }

            return results;
        } catch (error) {
            console.error('Error performing global search:', error);
            throw error;
        }
    }

    // Health check for all services
    async healthCheck() {
        try {
            const checks = await Promise.allSettled([
                this.driver.getJobs(),
                this.customer.getTipCategories(),
                this.routes.getDepotLocation(),
                this.notifications.getNotifications('test', 'driver'),
            ]);

            return {
                driver: checks[0].status === 'fulfilled',
                customer: checks[1].status === 'fulfilled',
                routes: checks[2].status === 'fulfilled',
                notifications: checks[3].status === 'fulfilled',
                timestamp: new Date(),
            };
        } catch (error) {
            console.error('Health check failed:', error);
            return {
                driver: false,
                customer: false,
                routes: false,
                notifications: false,
                timestamp: new Date(),
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}

// Export singleton instance
export const dataService = new DataService();

// Export individual services for direct access if needed
export {
    customerDataService, driverJobsService, notificationsService, routesService
};

