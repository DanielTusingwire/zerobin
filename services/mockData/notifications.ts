import { Notification } from '../../types/common';
import { CustomerNotification } from '../../types/customer';
import { simulateApiCall } from './index';

// Mock general notifications
const mockNotifications: Notification[] = [
    {
        id: 'notif-general-001',
        title: 'New Job Assigned',
        message: 'You have been assigned a new pickup job at Green Valley Restaurant',
        timestamp: new Date('2024-01-15T08:00:00'),
        read: false,
        type: 'job_assigned',
    },
    {
        id: 'notif-general-002',
        title: 'Route Optimized',
        message: 'Your route for today has been optimized. Check the updated schedule.',
        timestamp: new Date('2024-01-15T07:45:00'),
        read: true,
        type: 'status_update',
    },
    {
        id: 'notif-general-003',
        title: 'Pickup Reminder',
        message: 'Reminder: Pickup scheduled at TechCorp Office Building in 30 minutes',
        timestamp: new Date('2024-01-15T10:00:00'),
        read: false,
        type: 'pickup_reminder',
    },
    {
        id: 'notif-general-004',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight from 11 PM to 1 AM. App may be unavailable.',
        timestamp: new Date('2024-01-14T16:00:00'),
        read: true,
        type: 'general',
    },
    {
        id: 'notif-general-005',
        title: 'Weather Alert',
        message: 'Heavy rain expected tomorrow. Check route conditions before departure.',
        timestamp: new Date('2024-01-14T18:30:00'),
        read: false,
        type: 'general',
    },
];

// Mock driver-specific notifications
const mockDriverNotifications: Notification[] = [
    {
        id: 'notif-driver-001',
        title: 'Job Status Update',
        message: 'Job at Riverside Medical Center has been marked as high priority',
        timestamp: new Date('2024-01-15T09:15:00'),
        read: false,
        type: 'status_update',
    },
    {
        id: 'notif-driver-002',
        title: 'Vehicle Maintenance Due',
        message: 'Your assigned vehicle TRUCK-001 is due for maintenance next week',
        timestamp: new Date('2024-01-14T14:00:00'),
        read: true,
        type: 'general',
    },
    {
        id: 'notif-driver-003',
        title: 'New Safety Protocol',
        message: 'Updated safety protocols for hazardous waste handling are now available',
        timestamp: new Date('2024-01-13T10:00:00'),
        read: false,
        type: 'general',
    },
];

// Mock customer-specific notifications (extended from customerData.ts)
const mockCustomerNotifications: CustomerNotification[] = [
    {
        id: 'notif-customer-001',
        customerId: 'customer-001',
        type: 'pickup_reminder',
        title: 'Pickup Reminder',
        message: 'Your waste pickup is scheduled for tomorrow at 9:00 AM. Please ensure containers are accessible.',
        read: false,
        actionRequired: false,
        relatedId: 'pickup-001',
        scheduledFor: new Date('2024-01-15T18:00:00'),
        createdAt: new Date('2024-01-15T18:00:00'),
        updatedAt: new Date('2024-01-15T18:00:00'),
    },
    {
        id: 'notif-customer-002',
        customerId: 'customer-001',
        type: 'status_update',
        title: 'Pickup Completed',
        message: 'Your waste pickup has been completed successfully. Thank you for using EcoTrack!',
        read: true,
        actionRequired: false,
        relatedId: 'pickup-002',
        createdAt: new Date('2024-01-12T11:30:00'),
        updatedAt: new Date('2024-01-12T15:00:00'),
    },
    {
        id: 'notif-customer-003',
        customerId: 'customer-001',
        type: 'feedback_request',
        title: 'Rate Your Recent Pickup',
        message: 'How was your pickup service? Your feedback helps us improve our service quality.',
        read: false,
        actionRequired: true,
        relatedId: 'pickup-002',
        expiresAt: new Date('2024-01-19T00:00:00'),
        createdAt: new Date('2024-01-12T12:00:00'),
        updatedAt: new Date('2024-01-12T12:00:00'),
    },
    {
        id: 'notif-customer-004',
        customerId: 'customer-001',
        type: 'tip_of_day',
        title: 'Waste Sorting Tip',
        message: 'Did you know? Pizza boxes with grease stains should go in general waste, not recycling.',
        read: false,
        actionRequired: false,
        relatedId: 'tip-001',
        createdAt: new Date('2024-01-15T08:00:00'),
        updatedAt: new Date('2024-01-15T08:00:00'),
    },
    {
        id: 'notif-customer-005',
        customerId: 'customer-001',
        type: 'promotion',
        title: 'Special Offer: Bulk Disposal',
        message: 'Get 20% off your next bulk disposal service. Valid until end of month.',
        read: false,
        actionRequired: false,
        expiresAt: new Date('2024-01-31T23:59:59'),
        createdAt: new Date('2024-01-14T12:00:00'),
        updatedAt: new Date('2024-01-14T12:00:00'),
    },
];

// Notification templates for generating dynamic notifications
const notificationTemplates = {
    driver: {
        job_assigned: {
            title: 'New Job Assigned',
            message: (customerName: string) => `You have been assigned a new pickup job at ${customerName}`,
        },
        job_completed: {
            title: 'Job Completed',
            message: (customerName: string) => `Job at ${customerName} has been marked as completed`,
        },
        route_updated: {
            title: 'Route Updated',
            message: 'Your route has been updated. Please check the new schedule.',
        },
        pickup_reminder: {
            title: 'Pickup Reminder',
            message: (customerName: string, time: string) => `Reminder: Pickup at ${customerName} in ${time}`,
        },
    },
    customer: {
        pickup_scheduled: {
            title: 'Pickup Scheduled',
            message: (date: string, time: string) => `Your pickup has been scheduled for ${date} at ${time}`,
        },
        pickup_reminder: {
            title: 'Pickup Reminder',
            message: (time: string) => `Your waste pickup is scheduled for ${time}. Please ensure containers are accessible.`,
        },
        pickup_completed: {
            title: 'Pickup Completed',
            message: 'Your waste pickup has been completed successfully. Thank you for using EcoTrack!',
        },
        feedback_request: {
            title: 'Rate Your Recent Pickup',
            message: 'How was your pickup service? Your feedback helps us improve our service quality.',
        },
    },
};

// Notifications Service
export const notificationsService = {
    // Get all notifications for a user
    async getNotifications(userId: string, userType: 'driver' | 'customer'): Promise<Notification[]> {
        let notifications: Notification[] = [];

        if (userType === 'driver') {
            notifications = [...mockNotifications, ...mockDriverNotifications];
        } else {
            // Convert customer notifications to general format
            const customerNotifs = mockCustomerNotifications
                .filter(n => n.customerId === userId)
                .map(n => ({
                    id: n.id,
                    title: n.title,
                    message: n.message,
                    timestamp: n.createdAt,
                    read: n.read,
                    type: n.type as Notification['type'],
                }));
            notifications = [...mockNotifications, ...customerNotifs];
        }

        // Sort by timestamp (newest first)
        notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return simulateApiCall(notifications);
    },

    // Get unread notifications count
    async getUnreadCount(userId: string, userType: 'driver' | 'customer'): Promise<number> {
        const notifications = await this.getNotifications(userId, userType);
        const unreadCount = notifications.filter(n => !n.read).length;
        return simulateApiCall(unreadCount);
    },

    // Mark notification as read
    async markAsRead(notificationId: string): Promise<void> {
        // Update in general notifications
        const generalIndex = mockNotifications.findIndex(n => n.id === notificationId);
        if (generalIndex !== -1) {
            mockNotifications[generalIndex].read = true;
        }

        // Update in driver notifications
        const driverIndex = mockDriverNotifications.findIndex(n => n.id === notificationId);
        if (driverIndex !== -1) {
            mockDriverNotifications[driverIndex].read = true;
        }

        // Update in customer notifications
        const customerIndex = mockCustomerNotifications.findIndex(n => n.id === notificationId);
        if (customerIndex !== -1) {
            mockCustomerNotifications[customerIndex].read = true;
            mockCustomerNotifications[customerIndex].updatedAt = new Date();
        }

        return simulateApiCall(undefined);
    },

    // Mark all notifications as read
    async markAllAsRead(userId: string, userType: 'driver' | 'customer'): Promise<void> {
        if (userType === 'driver') {
            mockNotifications.forEach(n => n.read = true);
            mockDriverNotifications.forEach(n => n.read = true);
        } else {
            mockNotifications.forEach(n => n.read = true);
            mockCustomerNotifications
                .filter(n => n.customerId === userId)
                .forEach(n => {
                    n.read = true;
                    n.updatedAt = new Date();
                });
        }

        return simulateApiCall(undefined);
    },

    // Create a new notification
    async createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
        };

        mockNotifications.unshift(newNotification);
        return simulateApiCall(newNotification);
    },

    // Create customer notification
    async createCustomerNotification(
        customerId: string,
        type: CustomerNotification['type'],
        title: string,
        message: string,
        options?: {
            actionRequired?: boolean;
            relatedId?: string;
            expiresAt?: Date;
        }
    ): Promise<CustomerNotification> {
        const newNotification: CustomerNotification = {
            id: `notif-customer-${Date.now()}`,
            customerId,
            type,
            title,
            message,
            read: false,
            actionRequired: options?.actionRequired || false,
            relatedId: options?.relatedId,
            expiresAt: options?.expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockCustomerNotifications.unshift(newNotification);
        return simulateApiCall(newNotification);
    },

    // Delete notification
    async deleteNotification(notificationId: string): Promise<void> {
        // Remove from general notifications
        const generalIndex = mockNotifications.findIndex(n => n.id === notificationId);
        if (generalIndex !== -1) {
            mockNotifications.splice(generalIndex, 1);
        }

        // Remove from driver notifications
        const driverIndex = mockDriverNotifications.findIndex(n => n.id === notificationId);
        if (driverIndex !== -1) {
            mockDriverNotifications.splice(driverIndex, 1);
        }

        // Remove from customer notifications
        const customerIndex = mockCustomerNotifications.findIndex(n => n.id === notificationId);
        if (customerIndex !== -1) {
            mockCustomerNotifications.splice(customerIndex, 1);
        }

        return simulateApiCall(undefined);
    },

    // Get notifications by type
    async getNotificationsByType(
        userId: string,
        userType: 'driver' | 'customer',
        notificationType: Notification['type']
    ): Promise<Notification[]> {
        const allNotifications = await this.getNotifications(userId, userType);
        const filteredNotifications = allNotifications.filter(n => n.type === notificationType);
        return simulateApiCall(filteredNotifications);
    },

    // Generate notification from template
    async generateNotification(
        userType: 'driver' | 'customer',
        templateKey: string,
        params: Record<string, string>
    ): Promise<Notification> {
        const templates = notificationTemplates[userType] as any;
        const template = templates[templateKey];

        if (!template) {
            throw new Error(`Template ${templateKey} not found for ${userType}`);
        }

        const message = typeof template.message === 'function'
            ? template.message(...Object.values(params))
            : template.message;

        const notification: Notification = {
            id: `notif-generated-${Date.now()}`,
            title: template.title,
            message,
            timestamp: new Date(),
            read: false,
            type: templateKey.includes('job') ? 'job_assigned' : 'general',
        };

        return simulateApiCall(notification);
    },

    // Schedule notification for future delivery
    async scheduleNotification(
        notification: Omit<Notification, 'id' | 'timestamp'>,
        scheduledFor: Date
    ): Promise<{ id: string; scheduledFor: Date }> {
        // In a real app, this would be handled by a background service
        const scheduledNotification = {
            id: `scheduled-${Date.now()}`,
            scheduledFor,
            notification,
        };

        // Simulate scheduling
        return simulateApiCall({
            id: scheduledNotification.id,
            scheduledFor,
        });
    },
};