import { BaseEntity, Coordinate, JobStatus, WasteType } from './common';

// Driver-specific types for job management and route optimization
export interface Job extends BaseEntity {
    customerId: string;
    customerName: string;
    customerPhone?: string;
    address: string;
    coordinates: Coordinate;
    scheduledTime: Date;
    wasteType: WasteType[];
    status: JobStatus;
    specialInstructions?: string;
    estimatedVolume: number; // in cubic meters
    actualVolume?: number;
    photos: string[]; // Array of photo URIs
    scannedCodes: string[]; // QR/Barcode scan results
    priority: 'low' | 'medium' | 'high';
    completedAt?: Date;
    notes?: string;
}

export interface Route extends BaseEntity {
    driverId: string;
    jobs: Job[];
    optimizedPath: Coordinate[];
    totalDistance: number; // in kilometers
    estimatedDuration: number; // in minutes
    actualDuration?: number;
    startTime?: Date;
    endTime?: Date;
    status: 'planned' | 'active' | 'completed';
}

export interface ScanRecord extends BaseEntity {
    jobId: string;
    code: string;
    type: 'qr' | 'barcode';
    scannedAt: Date;
    location?: Coordinate;
}

export interface OfflineAction {
    id: string;
    type: 'job_update' | 'photo_upload' | 'scan_record' | 'status_change';
    data: any;
    timestamp: Date;
    synced: boolean;
}

// Driver profile and statistics
export interface DriverProfile extends BaseEntity {
    name: string;
    employeeId: string;
    phone: string;
    email: string;
    vehicleId?: string;
    vehicleType?: string;
    licenseNumber?: string;
    isActive: boolean;
}

export interface DriverStats {
    totalJobs: number;
    completedJobs: number;
    totalDistance: number;
    averageRating: number;
    onTimePercentage: number;
    currentWeekJobs: number;
    currentMonthJobs: number;
}

// Camera and scanning related types
export interface PhotoCapture {
    uri: string;
    jobId: string;
    timestamp: Date;
    location?: Coordinate;
    compressed?: boolean;
}

export interface ScanResult {
    data: string;
    type: 'qr' | 'barcode';
    timestamp: Date;
}

// Route optimization types
export interface RouteOptimizationRequest {
    startLocation: Coordinate;
    jobs: Pick<Job, 'id' | 'coordinates' | 'scheduledTime' | 'priority'>[];
    vehicleType?: string;
    maxDuration?: number;
}

export interface RouteOptimizationResult {
    optimizedOrder: string[]; // Job IDs in optimal order
    totalDistance: number;
    estimatedDuration: number;
    path: Coordinate[];
}