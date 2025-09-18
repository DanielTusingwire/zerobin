import { Coordinate } from '../../types/common';
import { Route, RouteOptimizationRequest, RouteOptimizationResult } from '../../types/driver';
import { simulateApiCall } from './index';

// Mock route data with GPS coordinates and optimized paths
const mockRoutes: Route[] = [
    {
        id: 'route-001',
        driverId: 'driver-001',
        jobs: [], // Will be populated from driverJobs service
        optimizedPath: [
            { latitude: 40.7128, longitude: -74.0060 }, // Depot - Downtown Manhattan
            { latitude: 40.7589, longitude: -73.9851 }, // Stop 1 - Midtown
            { latitude: 40.7505, longitude: -73.9934 }, // Stop 2 - Times Square area
            { latitude: 40.7282, longitude: -74.0776 }, // Stop 3 - West Village
            { latitude: 40.7614, longitude: -73.9776 }, // Stop 4 - Upper East Side
            { latitude: 40.7831, longitude: -73.9712 }, // Stop 5 - Upper West Side
            { latitude: 40.7128, longitude: -74.0060 }, // Return to depot
        ],
        totalDistance: 28.5,
        estimatedDuration: 240, // 4 hours
        actualDuration: 255,
        startTime: new Date('2024-01-15T08:00:00'),
        endTime: new Date('2024-01-15T12:15:00'),
        status: 'completed',
        createdAt: new Date('2024-01-14T16:00:00'),
        updatedAt: new Date('2024-01-15T12:15:00'),
    },
    {
        id: 'route-002',
        driverId: 'driver-001',
        jobs: [], // Will be populated from driverJobs service
        optimizedPath: [
            { latitude: 40.7128, longitude: -74.0060 }, // Depot
            { latitude: 40.7282, longitude: -74.0776 }, // Stop 1 - West Village
            { latitude: 40.7589, longitude: -73.9851 }, // Stop 2 - Midtown
            { latitude: 40.7505, longitude: -73.9934 }, // Stop 3 - Times Square area
            { latitude: 40.7128, longitude: -74.0060 }, // Return to depot
        ],
        totalDistance: 18.2,
        estimatedDuration: 180, // 3 hours
        startTime: new Date('2024-01-16T09:00:00'),
        status: 'planned',
        createdAt: new Date('2024-01-15T17:00:00'),
        updatedAt: new Date('2024-01-15T17:00:00'),
    },
    {
        id: 'route-003',
        driverId: 'driver-002',
        jobs: [], // Will be populated from driverJobs service
        optimizedPath: [
            { latitude: 40.7128, longitude: -74.0060 }, // Depot
            { latitude: 40.7831, longitude: -73.9712 }, // Stop 1 - Upper West Side
            { latitude: 40.7614, longitude: -73.9776 }, // Stop 2 - Upper East Side
            { latitude: 40.7589, longitude: -73.9851 }, // Stop 3 - Midtown
            { latitude: 40.7128, longitude: -74.0060 }, // Return to depot
        ],
        totalDistance: 22.1,
        estimatedDuration: 200, // 3.33 hours
        startTime: new Date('2024-01-16T08:30:00'),
        status: 'active',
        createdAt: new Date('2024-01-15T18:00:00'),
        updatedAt: new Date('2024-01-16T08:30:00'),
    },
];

// Mock depot and common locations
const mockLocations = {
    depot: { latitude: 40.7128, longitude: -74.0060 },
    serviceArea: {
        center: { latitude: 40.7589, longitude: -73.9851 },
        radius: 15, // km
    },
    commonStops: [
        { name: 'Downtown Business District', coordinate: { latitude: 40.7128, longitude: -74.0060 } },
        { name: 'Midtown Commercial', coordinate: { latitude: 40.7589, longitude: -73.9851 } },
        { name: 'Times Square Area', coordinate: { latitude: 40.7505, longitude: -73.9934 } },
        { name: 'West Village', coordinate: { latitude: 40.7282, longitude: -74.0776 } },
        { name: 'Upper East Side', coordinate: { latitude: 40.7614, longitude: -73.9776 } },
        { name: 'Upper West Side', coordinate: { latitude: 40.7831, longitude: -73.9712 } },
        { name: 'Brooklyn Heights', coordinate: { latitude: 40.6962, longitude: -73.9961 } },
        { name: 'Long Island City', coordinate: { latitude: 40.7505, longitude: -73.9342 } },
    ],
};

// Route optimization algorithm (simplified mock)
const optimizeRoute = (request: RouteOptimizationRequest): RouteOptimizationResult => {
    const { startLocation, jobs } = request;

    // Simple nearest neighbor algorithm for demo
    const unvisited = [...jobs];
    const optimizedOrder: string[] = [];
    const path: Coordinate[] = [startLocation];

    let currentLocation = startLocation;
    let totalDistance = 0;

    while (unvisited.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = calculateDistance(currentLocation, unvisited[0].coordinates);

        for (let i = 1; i < unvisited.length; i++) {
            const distance = calculateDistance(currentLocation, unvisited[i].coordinates);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = i;
            }
        }

        const nearestJob = unvisited.splice(nearestIndex, 1)[0];
        optimizedOrder.push(nearestJob.id);
        path.push(nearestJob.coordinates);
        currentLocation = nearestJob.coordinates;
        totalDistance += nearestDistance;
    }

    // Return to start
    const returnDistance = calculateDistance(currentLocation, startLocation);
    totalDistance += returnDistance;
    path.push(startLocation);

    // Estimate duration (assuming 30 km/h average speed + 15 min per stop)
    const estimatedDuration = Math.round((totalDistance / 30) * 60 + (jobs.length * 15));

    return {
        optimizedOrder,
        totalDistance: Math.round(totalDistance * 10) / 10,
        estimatedDuration,
        path,
    };
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

// Generate waypoints between two coordinates
const generateWaypoints = (start: Coordinate, end: Coordinate, numPoints: number = 3): Coordinate[] => {
    const waypoints: Coordinate[] = [];

    for (let i = 1; i <= numPoints; i++) {
        const ratio = i / (numPoints + 1);
        const lat = start.latitude + (end.latitude - start.latitude) * ratio;
        const lng = start.longitude + (end.longitude - start.longitude) * ratio;
        waypoints.push({ latitude: lat, longitude: lng });
    }

    return waypoints;
};

// Routes Service
export const routesService = {
    // Get all routes for a driver
    async getRoutes(driverId: string): Promise<Route[]> {
        const routes = mockRoutes.filter(r => r.driverId === driverId);
        return simulateApiCall(routes);
    },

    // Get active route for a driver
    async getActiveRoute(driverId: string): Promise<Route | null> {
        const activeRoute = mockRoutes.find(r =>
            r.driverId === driverId && r.status === 'active'
        ) || null;
        return simulateApiCall(activeRoute);
    },

    // Get route by ID
    async getRoute(routeId: string): Promise<Route | null> {
        const route = mockRoutes.find(r => r.id === routeId) || null;
        return simulateApiCall(route);
    },

    // Create a new route
    async createRoute(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
        const newRoute: Route = {
            ...route,
            id: `route-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockRoutes.push(newRoute);
        return simulateApiCall(newRoute);
    },

    // Update route status
    async updateRouteStatus(routeId: string, status: Route['status']): Promise<Route> {
        const index = mockRoutes.findIndex(r => r.id === routeId);
        if (index === -1) throw new Error('Route not found');

        mockRoutes[index] = {
            ...mockRoutes[index],
            status,
            updatedAt: new Date(),
            ...(status === 'active' && { startTime: new Date() }),
            ...(status === 'completed' && { endTime: new Date() }),
        };

        return simulateApiCall(mockRoutes[index]);
    },

    // Optimize route
    async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimizationResult> {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = optimizeRoute(request);
        return simulateApiCall(result);
    },

    // Get route statistics
    async getRouteStats(driverId: string, dateRange?: { start: Date; end: Date }): Promise<{
        totalRoutes: number;
        totalDistance: number;
        totalDuration: number;
        averageJobsPerRoute: number;
        completionRate: number;
    }> {
        const driverRoutes = mockRoutes.filter(r => r.driverId === driverId);

        const stats = {
            totalRoutes: driverRoutes.length,
            totalDistance: driverRoutes.reduce((sum, r) => sum + r.totalDistance, 0),
            totalDuration: driverRoutes.reduce((sum, r) => sum + (r.actualDuration || r.estimatedDuration), 0),
            averageJobsPerRoute: driverRoutes.reduce((sum, r) => sum + r.jobs.length, 0) / driverRoutes.length || 0,
            completionRate: (driverRoutes.filter(r => r.status === 'completed').length / driverRoutes.length) * 100 || 0,
        };

        return simulateApiCall(stats);
    },

    // Get nearby locations
    async getNearbyLocations(coordinate: Coordinate, radius: number = 5): Promise<{
        name: string;
        coordinate: Coordinate;
        distance: number;
    }[]> {
        const nearby = mockLocations.commonStops
            .map(stop => ({
                ...stop,
                distance: calculateDistance(coordinate, stop.coordinate),
            }))
            .filter(stop => stop.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        return simulateApiCall(nearby);
    },

    // Calculate route between coordinates
    async calculateRoute(start: Coordinate, end: Coordinate): Promise<{
        distance: number;
        duration: number;
        path: Coordinate[];
    }> {
        const distance = calculateDistance(start, end);
        const duration = Math.round((distance / 30) * 60); // 30 km/h average speed
        const path = [start, ...generateWaypoints(start, end), end];

        return simulateApiCall({
            distance: Math.round(distance * 10) / 10,
            duration,
            path,
        });
    },

    // Get depot location
    async getDepotLocation(): Promise<Coordinate> {
        return simulateApiCall(mockLocations.depot);
    },

    // Get service area
    async getServiceArea(): Promise<{
        center: Coordinate;
        radius: number;
    }> {
        return simulateApiCall(mockLocations.serviceArea);
    },

    // Validate coordinates are within service area
    async isWithinServiceArea(coordinate: Coordinate): Promise<boolean> {
        const distance = calculateDistance(coordinate, mockLocations.serviceArea.center);
        const isWithin = distance <= mockLocations.serviceArea.radius;
        return simulateApiCall(isWithin);
    },

    // Get estimated travel time between two points
    async getEstimatedTravelTime(start: Coordinate, end: Coordinate): Promise<{
        distance: number;
        duration: number;
        trafficFactor: number;
    }> {
        const distance = calculateDistance(start, end);
        const baseTime = (distance / 30) * 60; // 30 km/h base speed
        const trafficFactor = 1 + Math.random() * 0.5; // 1.0 to 1.5x for traffic
        const duration = Math.round(baseTime * trafficFactor);

        return simulateApiCall({
            distance: Math.round(distance * 10) / 10,
            duration,
            trafficFactor: Math.round(trafficFactor * 100) / 100,
        });
    },
};