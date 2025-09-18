import { JobStatus, WasteType } from '../../types/common';
import { DriverProfile, DriverStats, Job, Route, ScanRecord } from '../../types/driver';
import { simulateApiCall } from './index';

// Mock driver jobs data with varied statuses and waste types
const mockJobs: Job[] = [
    {
        id: 'job-001',
        customerId: 'customer-001',
        customerName: 'Green Valley Restaurant',
        customerPhone: '+1-555-0123',
        address: '123 Main St, Downtown',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        scheduledTime: new Date('2024-01-15T09:00:00'),
        wasteType: [WasteType.ORGANIC, WasteType.RECYCLABLE],
        status: JobStatus.SCHEDULED,
        specialInstructions: 'Use back entrance, containers are behind the kitchen',
        estimatedVolume: 2.5,
        photos: [],
        scannedCodes: [],
        priority: 'high',
        createdAt: new Date('2024-01-14T10:00:00'),
        updatedAt: new Date('2024-01-14T10:00:00'),
    },
    {
        id: 'job-002',
        customerId: 'customer-002',
        customerName: 'TechCorp Office Building',
        customerPhone: '+1-555-0124',
        address: '456 Business Ave, Suite 200',
        coordinates: { latitude: 40.7589, longitude: -73.9851 },
        scheduledTime: new Date('2024-01-15T10:30:00'),
        wasteType: [WasteType.RECYCLABLE, WasteType.GENERAL],
        status: JobStatus.IN_PROGRESS,
        specialInstructions: 'Security code: 1234. Contact reception first',
        estimatedVolume: 1.8,
        actualVolume: 2.1,
        photos: ['photo-001.jpg', 'photo-002.jpg'],
        scannedCodes: ['QR123456789', 'BC987654321'],
        priority: 'medium',
        notes: 'Extra recyclables this week due to office cleanup',
        createdAt: new Date('2024-01-14T11:00:00'),
        updatedAt: new Date('2024-01-15T10:45:00'),
    },
    {
        id: 'job-003',
        customerId: 'customer-003',
        customerName: 'Riverside Medical Center',
        customerPhone: '+1-555-0125',
        address: '789 Health Blvd, Medical District',
        coordinates: { latitude: 40.7505, longitude: -73.9934 },
        scheduledTime: new Date('2024-01-15T14:00:00'),
        wasteType: [WasteType.HAZARDOUS, WasteType.GENERAL],
        status: JobStatus.SCHEDULED,
        specialInstructions: 'HAZARDOUS WASTE - Follow safety protocols. Contact Dr. Smith ext. 2345',
        estimatedVolume: 0.8,
        photos: [],
        scannedCodes: [],
        priority: 'high',
        createdAt: new Date('2024-01-14T12:00:00'),
        updatedAt: new Date('2024-01-14T12:00:00'),
    },
    {
        id: 'job-004',
        customerId: 'customer-004',
        customerName: 'Sunset Apartments',
        customerPhone: '+1-555-0126',
        address: '321 Residential St, Apt Complex',
        coordinates: { latitude: 40.7282, longitude: -74.0776 },
        scheduledTime: new Date('2024-01-15T08:00:00'),
        wasteType: [WasteType.GENERAL, WasteType.ORGANIC],
        status: JobStatus.COMPLETED,
        specialInstructions: 'Multiple dumpsters - check all 4 locations',
        estimatedVolume: 4.2,
        actualVolume: 4.0,
        photos: ['photo-003.jpg', 'photo-004.jpg', 'photo-005.jpg'],
        scannedCodes: ['QR111222333', 'QR444555666'],
        priority: 'medium',
        completedAt: new Date('2024-01-15T08:45:00'),
        notes: 'All containers collected successfully',
        createdAt: new Date('2024-01-14T09:00:00'),
        updatedAt: new Date('2024-01-15T08:45:00'),
    },
    {
        id: 'job-005',
        customerId: 'customer-005',
        customerName: 'Downtown Shopping Mall',
        customerPhone: '+1-555-0127',
        address: '555 Commerce Plaza, Mall Level B1',
        coordinates: { latitude: 40.7614, longitude: -73.9776 },
        scheduledTime: new Date('2024-01-15T16:00:00'),
        wasteType: [WasteType.RECYCLABLE, WasteType.GENERAL, WasteType.ORGANIC],
        status: JobStatus.CANCELLED,
        specialInstructions: 'Loading dock access required - coordinate with security',
        estimatedVolume: 6.5,
        photos: [],
        scannedCodes: [],
        priority: 'low',
        notes: 'Cancelled due to mall maintenance - reschedule for tomorrow',
        createdAt: new Date('2024-01-14T13:00:00'),
        updatedAt: new Date('2024-01-15T15:30:00'),
    },
    {
        id: 'job-006',
        customerId: 'customer-006',
        customerName: 'University Campus - Science Building',
        customerPhone: '+1-555-0128',
        address: '100 University Ave, Science Complex',
        coordinates: { latitude: 40.7831, longitude: -73.9712 },
        scheduledTime: new Date('2024-01-16T11:00:00'),
        wasteType: [WasteType.HAZARDOUS, WasteType.RECYCLABLE],
        status: JobStatus.SCHEDULED,
        specialInstructions: 'Lab waste - requires special handling certification',
        estimatedVolume: 1.2,
        photos: [],
        scannedCodes: [],
        priority: 'high',
        createdAt: new Date('2024-01-14T14:00:00'),
        updatedAt: new Date('2024-01-14T14:00:00'),
    },
];

// Mock route data with GPS coordinates and optimized paths
const mockRoutes: Route[] = [
    {
        id: 'route-001',
        driverId: 'driver-001',
        jobs: [mockJobs[0], mockJobs[1], mockJobs[2]],
        optimizedPath: [
            { latitude: 40.7128, longitude: -74.0060 }, // Start
            { latitude: 40.7589, longitude: -73.9851 }, // Job 2
            { latitude: 40.7505, longitude: -73.9934 }, // Job 3
            { latitude: 40.7128, longitude: -74.0060 }, // Return
        ],
        totalDistance: 15.2,
        estimatedDuration: 180, // 3 hours
        actualDuration: 195,
        startTime: new Date('2024-01-15T08:30:00'),
        endTime: new Date('2024-01-15T11:45:00'),
        status: 'active',
        createdAt: new Date('2024-01-14T16:00:00'),
        updatedAt: new Date('2024-01-15T08:30:00'),
    },
    {
        id: 'route-002',
        driverId: 'driver-001',
        jobs: [mockJobs[3]],
        optimizedPath: [
            { latitude: 40.7128, longitude: -74.0060 }, // Start
            { latitude: 40.7282, longitude: -74.0776 }, // Job 4
            { latitude: 40.7128, longitude: -74.0060 }, // Return
        ],
        totalDistance: 8.5,
        estimatedDuration: 90,
        actualDuration: 85,
        startTime: new Date('2024-01-15T07:45:00'),
        endTime: new Date('2024-01-15T09:10:00'),
        status: 'completed',
        createdAt: new Date('2024-01-14T15:00:00'),
        updatedAt: new Date('2024-01-15T09:10:00'),
    },
];

// Mock driver profile
const mockDriverProfile: DriverProfile = {
    id: 'driver-001',
    name: 'John Smith',
    employeeId: 'EMP001',
    phone: '+1-555-0100',
    email: 'john.smith@ecotrack.com',
    vehicleId: 'TRUCK-001',
    vehicleType: 'Waste Collection Truck',
    licenseNumber: 'CDL123456',
    isActive: true,
    createdAt: new Date('2023-06-01T00:00:00'),
    updatedAt: new Date('2024-01-14T00:00:00'),
};

// Mock driver statistics
const mockDriverStats: DriverStats = {
    totalJobs: 1247,
    completedJobs: 1198,
    totalDistance: 15420.5,
    averageRating: 4.7,
    onTimePercentage: 94.2,
    currentWeekJobs: 23,
    currentMonthJobs: 89,
};

// Mock scan records
const mockScanRecords: ScanRecord[] = [
    {
        id: 'scan-001',
        jobId: 'job-002',
        code: 'QR123456789',
        type: 'qr',
        scannedAt: new Date('2024-01-15T10:35:00'),
        location: { latitude: 40.7589, longitude: -73.9851 },
        createdAt: new Date('2024-01-15T10:35:00'),
        updatedAt: new Date('2024-01-15T10:35:00'),
    },
    {
        id: 'scan-002',
        jobId: 'job-002',
        code: 'BC987654321',
        type: 'barcode',
        scannedAt: new Date('2024-01-15T10:40:00'),
        location: { latitude: 40.7589, longitude: -73.9851 },
        createdAt: new Date('2024-01-15T10:40:00'),
        updatedAt: new Date('2024-01-15T10:40:00'),
    },
];

// Driver Jobs Service
export const driverJobsService = {
    // Get all jobs for a driver
    async getJobs(driverId?: string): Promise<Job[]> {
        return simulateApiCall(mockJobs);
    },

    // Get jobs by status
    async getJobsByStatus(status: JobStatus): Promise<Job[]> {
        const filteredJobs = mockJobs.filter(job => job.status === status);
        return simulateApiCall(filteredJobs);
    },

    // Get a specific job
    async getJob(jobId: string): Promise<Job | null> {
        const job = mockJobs.find(j => j.id === jobId) || null;
        return simulateApiCall(job);
    },

    // Update job status
    async updateJobStatus(jobId: string, status: JobStatus, notes?: string): Promise<Job> {
        const jobIndex = mockJobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) {
            throw new Error('Job not found');
        }

        mockJobs[jobIndex] = {
            ...mockJobs[jobIndex],
            status,
            notes: notes || mockJobs[jobIndex].notes,
            updatedAt: new Date(),
            ...(status === JobStatus.COMPLETED && { completedAt: new Date() }),
        };

        return simulateApiCall(mockJobs[jobIndex]);
    },

    // Add photo to job
    async addJobPhoto(jobId: string, photoUri: string): Promise<Job> {
        const jobIndex = mockJobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) {
            throw new Error('Job not found');
        }

        mockJobs[jobIndex] = {
            ...mockJobs[jobIndex],
            photos: [...mockJobs[jobIndex].photos, photoUri],
            updatedAt: new Date(),
        };

        return simulateApiCall(mockJobs[jobIndex]);
    },

    // Delete photo from job
    async deleteJobPhoto(jobId: string, photoUri: string): Promise<Job> {
        const jobIndex = mockJobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) {
            throw new Error('Job not found');
        }

        mockJobs[jobIndex] = {
            ...mockJobs[jobIndex],
            photos: mockJobs[jobIndex].photos.filter(uri => uri !== photoUri),
            updatedAt: new Date(),
        };

        return simulateApiCall(mockJobs[jobIndex]);
    },

    // Add scan record to job
    async addScanRecord(jobId: string, code: string, type: 'qr' | 'barcode'): Promise<Job> {
        const jobIndex = mockJobs.findIndex(j => j.id === jobId);
        if (jobIndex === -1) {
            throw new Error('Job not found');
        }

        mockJobs[jobIndex] = {
            ...mockJobs[jobIndex],
            scannedCodes: [...mockJobs[jobIndex].scannedCodes, code],
            updatedAt: new Date(),
        };

        // Also add to scan records
        const scanRecord: ScanRecord = {
            id: `scan-${Date.now()}`,
            jobId,
            code,
            type,
            scannedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockScanRecords.push(scanRecord);

        return simulateApiCall(mockJobs[jobIndex]);
    },

    // Get routes for driver
    async getRoutes(driverId: string): Promise<Route[]> {
        const routes = mockRoutes.filter(r => r.driverId === driverId);
        return simulateApiCall(routes);
    },

    // Get active route
    async getActiveRoute(driverId: string): Promise<Route | null> {
        const activeRoute = mockRoutes.find(r => r.driverId === driverId && r.status === 'active') || null;
        return simulateApiCall(activeRoute);
    },

    // Get driver profile
    async getDriverProfile(driverId: string): Promise<DriverProfile> {
        return simulateApiCall(mockDriverProfile);
    },

    // Get driver statistics
    async getDriverStats(driverId: string): Promise<DriverStats> {
        return simulateApiCall(mockDriverStats);
    },

    // Get scan records for job
    async getScanRecords(jobId: string): Promise<ScanRecord[]> {
        const records = mockScanRecords.filter(r => r.jobId === jobId);
        return simulateApiCall(records);
    },

    // Get today's jobs
    async getTodaysJobs(): Promise<Job[]> {
        const today = new Date();
        const todaysJobs = mockJobs.filter(job => {
            const jobDate = new Date(job.scheduledTime);
            return jobDate.toDateString() === today.toDateString();
        });
        return simulateApiCall(todaysJobs);
    },

    // Search jobs
    async searchJobs(query: string): Promise<Job[]> {
        const searchResults = mockJobs.filter(job =>
            job.customerName.toLowerCase().includes(query.toLowerCase()) ||
            job.address.toLowerCase().includes(query.toLowerCase()) ||
            job.id.toLowerCase().includes(query.toLowerCase())
        );
        return simulateApiCall(searchResults);
    },
};