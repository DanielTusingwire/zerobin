// Common types shared across the application
export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'pickup_reminder' | 'job_assigned' | 'status_update' | 'general';
}

export enum WasteType {
    GENERAL = 'general',
    RECYCLABLE = 'recyclable',
    ORGANIC = 'organic',
    HAZARDOUS = 'hazardous'
}

export enum JobStatus {
    SCHEDULED = 'scheduled',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum RequestStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// User role types for navigation and access control
export type UserRole = 'driver' | 'customer';

// API response wrapper for future backend integration
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
}

// Error types for consistent error handling
export interface AppError {
    code: string;
    message: string;
    details?: any;
}

export enum ErrorType {
    NETWORK = 'network',
    PERMISSION = 'permission',
    VALIDATION = 'validation',
    STORAGE = 'storage',
    HARDWARE = 'hardware'
}

// Pickup request structure
export interface PickupRequest {
  id: string;
  customerId: string;
  address: string;
  wasteType: WasteType[];
  quantity: number;
  scheduledDate: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}