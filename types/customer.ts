import { BaseEntity, RequestStatus, WasteType } from './common';

// Customer-specific types for pickup requests and service management
export interface PickupRequest extends BaseEntity {
    customerId: string;
    wasteType: WasteType[];
    quantity: number; // in cubic meters or bags
    preferredDate: Date;
    preferredTimeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
    isBulkDisposal: boolean;
    status: RequestStatus;
    notes?: string;
    urgency: 'low' | 'medium' | 'high';
    estimatedCost?: number;
    actualCost?: number;
    assignedDriverId?: string;
    scheduledDate?: Date;
    completedDate?: Date;
    address: string;
    contactPerson?: string;
    contactPhone?: string;
}

export interface ScheduledPickup extends BaseEntity {
    customerId: string;
    requestId: string;
    driverId: string;
    driverName: string;
    scheduledDate: Date;
    timeSlot: string;
    wasteType: WasteType[];
    estimatedQuantity: number;
    actualQuantity?: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
    address: string;
    specialInstructions?: string;
    cost?: number;
    completedAt?: Date;
    photos?: string[];
    proofOfCollection?: string[];
}

export interface Feedback extends BaseEntity {
    customerId: string;
    jobId: string;
    pickupId: string;
    driverId: string;
    rating: number; // 1-5 stars
    comments?: string;
    submittedAt: Date;
    categories: {
        timeliness: number;
        professionalism: number;
        cleanliness: number;
        communication: number;
    };
    wouldRecommend: boolean;
    followUpRequired: boolean;
}

export interface CustomerProfile extends BaseEntity {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    businessType: string;
    accountType: 'basic' | 'premium' | 'enterprise';
    isActive: boolean;
    preferredPickupDays: string[];
    specialRequirements?: string;
    billingAddress?: string;
    taxId?: string;
}

export interface CustomerPreferences {
    notificationSettings: {
        pickupReminders: boolean;
        statusUpdates: boolean;
        promotions: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
    };
    defaultWasteTypes: WasteType[];
    preferredTimeSlots: string[];
    autoScheduleRecurring: boolean;
    recurringFrequency?: 'weekly' | 'biweekly' | 'monthly';
}

// Waste sorting and educational content types
export interface WasteTip extends BaseEntity {
    title: string;
    description: string;
    category: WasteType;
    imageUrl?: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadTime: number; // in minutes
    isLocal: boolean; // Local recycling guidelines
    lastUpdated: Date;
    views: number;
    helpful: number;
    notHelpful: number;
}

export interface TipCategory {
    id: string;
    name: string;
    wasteType: WasteType;
    description: string;
    iconName: string;
    color: string;
    tipCount: number;
}

// Service history and analytics
export interface ServiceHistory extends BaseEntity {
    customerId: string;
    pickupId: string;
    date: Date;
    wasteType: WasteType[];
    quantity: number;
    cost: number;
    driverName: string;
    rating?: number;
    status: 'completed' | 'cancelled';
    notes?: string;
}

export interface CustomerAnalytics {
    totalPickups: number;
    totalWasteCollected: number; // in cubic meters
    totalCost: number;
    averageRating: number;
    favoriteWasteTypes: WasteType[];
    monthlyTrend: {
        month: string;
        pickups: number;
        cost: number;
        wasteVolume: number;
    }[];
    environmentalImpact: {
        co2Saved: number;
        treesEquivalent: number;
        recyclingRate: number;
    };
}

// Notification and communication types
export interface CustomerNotification extends BaseEntity {
    customerId: string;
    type: 'pickup_reminder' | 'status_update' | 'feedback_request' | 'promotion' | 'tip_of_day';
    title: string;
    message: string;
    read: boolean;
    actionRequired: boolean;
    relatedId?: string; // Related pickup, request, or feedback ID
    scheduledFor?: Date;
    expiresAt?: Date;
}