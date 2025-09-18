import { RequestStatus, WasteType } from '../../types/common';
import {
    CustomerAnalytics,
    CustomerNotification,
    CustomerPreferences,
    CustomerProfile,
    Feedback,
    PickupRequest,
    ScheduledPickup,
    ServiceHistory,
    TipCategory,
    WasteTip
} from '../../types/customer';
import { simulateApiCall } from './index';

// Mock pickup requests
const mockPickupRequests: PickupRequest[] = [
    {
        id: 'request-001',
        customerId: 'customer-001',
        wasteType: [WasteType.ORGANIC, WasteType.RECYCLABLE],
        quantity: 2.5,
        preferredDate: new Date('2024-01-16T00:00:00'),
        preferredTimeSlot: 'morning',
        isBulkDisposal: false,
        status: RequestStatus.CONFIRMED,
        notes: 'Extra organic waste from weekend event',
        urgency: 'medium',
        estimatedCost: 45.00,
        assignedDriverId: 'driver-001',
        scheduledDate: new Date('2024-01-16T09:00:00'),
        address: '123 Main St, Downtown',
        contactPerson: 'Sarah Johnson',
        contactPhone: '+1-555-0201',
        createdAt: new Date('2024-01-14T10:30:00'),
        updatedAt: new Date('2024-01-15T14:20:00'),
    },
    {
        id: 'request-002',
        customerId: 'customer-001',
        wasteType: [WasteType.HAZARDOUS],
        quantity: 0.5,
        preferredDate: new Date('2024-01-18T00:00:00'),
        preferredTimeSlot: 'afternoon',
        isBulkDisposal: false,
        status: RequestStatus.PENDING,
        notes: 'Old paint cans and chemicals from renovation',
        urgency: 'high',
        estimatedCost: 75.00,
        address: '123 Main St, Downtown',
        contactPerson: 'Sarah Johnson',
        contactPhone: '+1-555-0201',
        createdAt: new Date('2024-01-15T11:00:00'),
        updatedAt: new Date('2024-01-15T11:00:00'),
    },
    {
        id: 'request-003',
        customerId: 'customer-002',
        wasteType: [WasteType.GENERAL, WasteType.RECYCLABLE],
        quantity: 8.0,
        preferredDate: new Date('2024-01-17T00:00:00'),
        preferredTimeSlot: 'anytime',
        isBulkDisposal: true,
        status: RequestStatus.IN_PROGRESS,
        notes: 'Office cleanout - furniture and electronics',
        urgency: 'low',
        estimatedCost: 120.00,
        actualCost: 115.00,
        assignedDriverId: 'driver-002',
        scheduledDate: new Date('2024-01-17T13:00:00'),
        address: '456 Business Ave, Suite 200',
        contactPerson: 'Mike Chen',
        contactPhone: '+1-555-0202',
        createdAt: new Date('2024-01-13T09:15:00'),
        updatedAt: new Date('2024-01-17T13:30:00'),
    },
];

// Mock scheduled pickups
const mockScheduledPickups: ScheduledPickup[] = [
    {
        id: 'pickup-001',
        customerId: 'customer-001',
        requestId: 'request-001',
        driverId: 'driver-001',
        driverName: 'John Smith',
        scheduledDate: new Date('2024-01-16T09:00:00'),
        timeSlot: '9:00 AM - 11:00 AM',
        wasteType: [WasteType.ORGANIC, WasteType.RECYCLABLE],
        estimatedQuantity: 2.5,
        status: 'scheduled',
        address: '123 Main St, Downtown',
        specialInstructions: 'Use back entrance, containers behind kitchen',
        cost: 45.00,
        createdAt: new Date('2024-01-15T14:20:00'),
        updatedAt: new Date('2024-01-15T14:20:00'),
    },
    {
        id: 'pickup-002',
        customerId: 'customer-001',
        requestId: 'request-004',
        driverId: 'driver-001',
        driverName: 'John Smith',
        scheduledDate: new Date('2024-01-12T10:00:00'),
        timeSlot: '10:00 AM - 12:00 PM',
        wasteType: [WasteType.GENERAL, WasteType.RECYCLABLE],
        estimatedQuantity: 3.2,
        actualQuantity: 3.0,
        status: 'completed',
        address: '123 Main St, Downtown',
        cost: 55.00,
        completedAt: new Date('2024-01-12T11:15:00'),
        photos: ['pickup-002-before.jpg', 'pickup-002-after.jpg'],
        proofOfCollection: ['receipt-002.pdf'],
        createdAt: new Date('2024-01-10T16:00:00'),
        updatedAt: new Date('2024-01-12T11:15:00'),
    },
];

// Mock feedback data
const mockFeedback: Feedback[] = [
    {
        id: 'feedback-001',
        customerId: 'customer-001',
        jobId: 'job-004',
        pickupId: 'pickup-002',
        driverId: 'driver-001',
        rating: 5,
        comments: 'Excellent service! Driver was punctual and professional.',
        submittedAt: new Date('2024-01-12T15:30:00'),
        categories: {
            timeliness: 5,
            professionalism: 5,
            cleanliness: 4,
            communication: 5,
        },
        wouldRecommend: true,
        followUpRequired: false,
        createdAt: new Date('2024-01-12T15:30:00'),
        updatedAt: new Date('2024-01-12T15:30:00'),
    },
    {
        id: 'feedback-002',
        customerId: 'customer-002',
        jobId: 'job-002',
        pickupId: 'pickup-003',
        driverId: 'driver-001',
        rating: 4,
        comments: 'Good service overall, but arrived 15 minutes late.',
        submittedAt: new Date('2024-01-10T14:45:00'),
        categories: {
            timeliness: 3,
            professionalism: 5,
            cleanliness: 4,
            communication: 4,
        },
        wouldRecommend: true,
        followUpRequired: false,
        createdAt: new Date('2024-01-10T14:45:00'),
        updatedAt: new Date('2024-01-10T14:45:00'),
    },
];

// Mock customer profile
const mockCustomerProfile: CustomerProfile = {
    id: 'customer-001',
    companyName: 'Green Valley Restaurant',
    contactName: 'Sarah Johnson',
    email: 'sarah@greenvalley.com',
    phone: '+1-555-0201',
    address: '123 Main St, Downtown',
    businessType: 'Restaurant',
    accountType: 'premium',
    isActive: true,
    preferredPickupDays: ['Monday', 'Wednesday', 'Friday'],
    specialRequirements: 'Organic waste separation required',
    billingAddress: '123 Main St, Downtown',
    taxId: 'TAX123456789',
    createdAt: new Date('2023-03-15T00:00:00'),
    updatedAt: new Date('2024-01-15T00:00:00'),
};

// Mock customer preferences
const mockCustomerPreferences: CustomerPreferences = {
    notificationSettings: {
        pickupReminders: true,
        statusUpdates: true,
        promotions: false,
        emailNotifications: true,
        smsNotifications: true,
    },
    defaultWasteTypes: [WasteType.ORGANIC, WasteType.RECYCLABLE],
    preferredTimeSlots: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'],
    autoScheduleRecurring: true,
    recurringFrequency: 'weekly',
};

// Mock waste tips
const mockWasteTips: WasteTip[] = [
    {
        id: 'tip-001',
        title: 'Proper Food Waste Composting',
        description: 'Learn how to properly separate and prepare organic waste for composting. Avoid meat, dairy, and oily foods in your organic bin.',
        category: WasteType.ORGANIC,
        imageUrl: 'https://example.com/composting-guide.jpg',
        tags: ['composting', 'organic', 'food-waste', 'restaurant'],
        difficulty: 'beginner',
        estimatedReadTime: 3,
        isLocal: true,
        lastUpdated: new Date('2024-01-10T00:00:00'),
        views: 1247,
        helpful: 89,
        notHelpful: 12,
        createdAt: new Date('2023-12-01T00:00:00'),
        updatedAt: new Date('2024-01-10T00:00:00'),
    },
    {
        id: 'tip-002',
        title: 'Recycling Electronics Safely',
        description: 'Electronics contain valuable materials but also hazardous substances. Learn where and how to recycle them properly in your area.',
        category: WasteType.HAZARDOUS,
        imageUrl: 'https://example.com/electronics-recycling.jpg',
        tags: ['electronics', 'hazardous', 'recycling', 'safety'],
        difficulty: 'intermediate',
        estimatedReadTime: 5,
        isLocal: true,
        lastUpdated: new Date('2024-01-08T00:00:00'),
        views: 892,
        helpful: 76,
        notHelpful: 8,
        createdAt: new Date('2023-11-15T00:00:00'),
        updatedAt: new Date('2024-01-08T00:00:00'),
    },
    {
        id: 'tip-003',
        title: 'Maximizing Cardboard Recycling',
        description: 'Flatten boxes, remove tape and staples, and keep cardboard dry. These simple steps help maximize recycling efficiency.',
        category: WasteType.RECYCLABLE,
        imageUrl: 'https://example.com/cardboard-recycling.jpg',
        tags: ['cardboard', 'recycling', 'office', 'packaging'],
        difficulty: 'beginner',
        estimatedReadTime: 2,
        isLocal: false,
        lastUpdated: new Date('2024-01-05T00:00:00'),
        views: 2156,
        helpful: 145,
        notHelpful: 23,
        createdAt: new Date('2023-10-20T00:00:00'),
        updatedAt: new Date('2024-01-05T00:00:00'),
    },
];

// Mock tip categories
const mockTipCategories: TipCategory[] = [
    {
        id: 'cat-001',
        name: 'Organic Waste',
        wasteType: WasteType.ORGANIC,
        description: 'Composting and organic waste management tips',
        iconName: 'leaf',
        color: '#D2F801',
        tipCount: 15,
    },
    {
        id: 'cat-002',
        name: 'Recyclables',
        wasteType: WasteType.RECYCLABLE,
        description: 'Recycling best practices and guidelines',
        iconName: 'refresh',
        color: '#00796B',
        tipCount: 23,
    },
    {
        id: 'cat-003',
        name: 'Hazardous Materials',
        wasteType: WasteType.HAZARDOUS,
        description: 'Safe disposal of hazardous waste',
        iconName: 'warning',
        color: '#F44336',
        tipCount: 12,
    },
    {
        id: 'cat-004',
        name: 'General Waste',
        wasteType: WasteType.GENERAL,
        description: 'General waste reduction and management',
        iconName: 'trash',
        color: '#9E9E9E',
        tipCount: 18,
    },
];

// Mock service history
const mockServiceHistory: ServiceHistory[] = [
    {
        id: 'history-001',
        customerId: 'customer-001',
        pickupId: 'pickup-002',
        date: new Date('2024-01-12T11:15:00'),
        wasteType: [WasteType.GENERAL, WasteType.RECYCLABLE],
        quantity: 3.0,
        cost: 55.00,
        driverName: 'John Smith',
        rating: 5,
        status: 'completed',
        notes: 'Regular weekly pickup',
        createdAt: new Date('2024-01-12T11:15:00'),
        updatedAt: new Date('2024-01-12T11:15:00'),
    },
    {
        id: 'history-002',
        customerId: 'customer-001',
        pickupId: 'pickup-001',
        date: new Date('2024-01-05T10:30:00'),
        wasteType: [WasteType.ORGANIC, WasteType.RECYCLABLE],
        quantity: 2.8,
        cost: 50.00,
        driverName: 'John Smith',
        rating: 4,
        status: 'completed',
        createdAt: new Date('2024-01-05T10:30:00'),
        updatedAt: new Date('2024-01-05T10:30:00'),
    },
];

// Mock customer analytics
const mockCustomerAnalytics: CustomerAnalytics = {
    totalPickups: 48,
    totalWasteCollected: 142.5,
    totalCost: 2340.00,
    averageRating: 4.6,
    favoriteWasteTypes: [WasteType.ORGANIC, WasteType.RECYCLABLE],
    monthlyTrend: [
        { month: 'Oct 2023', pickups: 4, cost: 220.00, wasteVolume: 12.5 },
        { month: 'Nov 2023', pickups: 4, cost: 210.00, wasteVolume: 11.8 },
        { month: 'Dec 2023', pickups: 5, cost: 275.00, wasteVolume: 15.2 },
        { month: 'Jan 2024', pickups: 3, cost: 165.00, wasteVolume: 9.1 },
    ],
    environmentalImpact: {
        co2Saved: 285.6,
        treesEquivalent: 12.3,
        recyclingRate: 78.5,
    },
};

// Mock notifications
const mockNotifications: CustomerNotification[] = [
    {
        id: 'notif-001',
        customerId: 'customer-001',
        type: 'pickup_reminder',
        title: 'Pickup Reminder',
        message: 'Your waste pickup is scheduled for tomorrow at 9:00 AM',
        read: false,
        actionRequired: false,
        relatedId: 'pickup-001',
        scheduledFor: new Date('2024-01-15T18:00:00'),
        createdAt: new Date('2024-01-15T18:00:00'),
        updatedAt: new Date('2024-01-15T18:00:00'),
    },
    {
        id: 'notif-002',
        customerId: 'customer-001',
        type: 'feedback_request',
        title: 'Rate Your Recent Pickup',
        message: 'How was your pickup service? Your feedback helps us improve.',
        read: true,
        actionRequired: true,
        relatedId: 'pickup-002',
        expiresAt: new Date('2024-01-19T00:00:00'),
        createdAt: new Date('2024-01-12T12:00:00'),
        updatedAt: new Date('2024-01-13T09:30:00'),
    },
];

// Customer Data Service
export const customerDataService = {
    // Pickup Requests
    async getPickupRequests(customerId: string): Promise<PickupRequest[]> {
        const requests = mockPickupRequests.filter(r => r.customerId === customerId);
        return simulateApiCall(requests);
    },

    async createPickupRequest(request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<PickupRequest> {
        const newRequest: PickupRequest = {
            ...request,
            id: `request-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockPickupRequests.push(newRequest);
        return simulateApiCall(newRequest);
    },

    async updatePickupRequest(requestId: string, updates: Partial<PickupRequest>): Promise<PickupRequest> {
        const index = mockPickupRequests.findIndex(r => r.id === requestId);
        if (index === -1) throw new Error('Request not found');

        mockPickupRequests[index] = {
            ...mockPickupRequests[index],
            ...updates,
            updatedAt: new Date(),
        };
        return simulateApiCall(mockPickupRequests[index]);
    },

    // Scheduled Pickups
    async getScheduledPickups(customerId: string): Promise<ScheduledPickup[]> {
        const pickups = mockScheduledPickups.filter(p => p.customerId === customerId);
        return simulateApiCall(pickups);
    },

    async getUpcomingPickups(customerId: string): Promise<ScheduledPickup[]> {
        const now = new Date();
        const upcoming = mockScheduledPickups.filter(p =>
            p.customerId === customerId &&
            new Date(p.scheduledDate) > now &&
            p.status === 'scheduled'
        );
        return simulateApiCall(upcoming);
    },

    // Feedback
    async getFeedback(customerId: string): Promise<Feedback[]> {
        const feedback = mockFeedback.filter(f => f.customerId === customerId);
        return simulateApiCall(feedback);
    },

    async submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feedback> {
        const newFeedback: Feedback = {
            ...feedback,
            id: `feedback-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockFeedback.push(newFeedback);
        return simulateApiCall(newFeedback);
    },

    // Customer Profile
    async getCustomerProfile(customerId: string): Promise<CustomerProfile> {
        return simulateApiCall(mockCustomerProfile);
    },

    async updateCustomerProfile(customerId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
        const updatedProfile = {
            ...mockCustomerProfile,
            ...updates,
            updatedAt: new Date(),
        };
        return simulateApiCall(updatedProfile);
    },

    // Customer Preferences
    async getCustomerPreferences(customerId: string): Promise<CustomerPreferences> {
        return simulateApiCall(mockCustomerPreferences);
    },

    async updateCustomerPreferences(customerId: string, preferences: Partial<CustomerPreferences>): Promise<CustomerPreferences> {
        const updatedPreferences = {
            ...mockCustomerPreferences,
            ...preferences,
        };
        return simulateApiCall(updatedPreferences);
    },

    // Waste Tips
    async getWasteTips(category?: WasteType): Promise<WasteTip[]> {
        const tips = category
            ? mockWasteTips.filter(t => t.category === category)
            : mockWasteTips;
        return simulateApiCall(tips);
    },

    async getTipCategories(): Promise<TipCategory[]> {
        return simulateApiCall(mockTipCategories);
    },

    async searchTips(query: string): Promise<WasteTip[]> {
        const results = mockWasteTips.filter(tip =>
            tip.title.toLowerCase().includes(query.toLowerCase()) ||
            tip.description.toLowerCase().includes(query.toLowerCase()) ||
            tip.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        return simulateApiCall(results);
    },

    // Service History
    async getServiceHistory(customerId: string): Promise<ServiceHistory[]> {
        const history = mockServiceHistory.filter(h => h.customerId === customerId);
        return simulateApiCall(history);
    },

    // Analytics
    async getCustomerAnalytics(customerId: string): Promise<CustomerAnalytics> {
        return simulateApiCall(mockCustomerAnalytics);
    },

    // Notifications
    async getNotifications(customerId: string): Promise<CustomerNotification[]> {
        const notifications = mockNotifications.filter(n => n.customerId === customerId);
        return simulateApiCall(notifications);
    },

    async markNotificationAsRead(notificationId: string): Promise<CustomerNotification> {
        const index = mockNotifications.findIndex(n => n.id === notificationId);
        if (index === -1) throw new Error('Notification not found');

        mockNotifications[index] = {
            ...mockNotifications[index],
            read: true,
            updatedAt: new Date(),
        };
        return simulateApiCall(mockNotifications[index]);
    },
};