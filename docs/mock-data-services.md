# Mock Data Services Documentation

## Overview

The EcoTrack app includes comprehensive mock data services that simulate a complete backend API. These services provide realistic data for development, testing, and demonstration purposes.

## Architecture

### Service Structure
```
services/
├── mockData/
│   ├── index.ts              # Configuration and utilities
│   ├── driverJobs.ts         # Driver job management
│   ├── customerData.ts       # Customer data and requests
│   ├── routes.ts             # Route optimization and mapping
│   └── notifications.ts      # Notification system
├── dataService.ts            # Unified data service layer
└── index.ts                  # Service exports
```

### Key Features
- **Realistic Data**: Comprehensive mock data with varied scenarios
- **API Simulation**: Network delays and failure simulation
- **Type Safety**: Full TypeScript support with proper interfaces
- **Service Layer**: Unified interface for all data operations
- **Error Handling**: Proper error simulation and handling

## Services

### 1. Driver Jobs Service (`driverJobsService`)

Manages driver job data, routes, and statistics.

#### Key Features
- Job management with multiple statuses (scheduled, in_progress, completed, cancelled)
- Photo and scan record management
- Route optimization and tracking
- Driver profile and performance statistics

#### Sample Data
- **6 mock jobs** with varied waste types and statuses
- **3 mock routes** with GPS coordinates and optimization
- **Driver profile** with vehicle and license information
- **Performance statistics** with completion rates and ratings

#### Key Methods
```typescript
// Get jobs
await driverJobsService.getJobs(driverId);
await driverJobsService.getJobsByStatus(JobStatus.SCHEDULED);
await driverJobsService.getTodaysJobs();

// Update jobs
await driverJobsService.updateJobStatus(jobId, JobStatus.COMPLETED);
await driverJobsService.addJobPhoto(jobId, photoUri);
await driverJobsService.addScanRecord(jobId, code, 'qr');

// Routes and stats
await driverJobsService.getActiveRoute(driverId);
await driverJobsService.getDriverStats(driverId);
```

### 2. Customer Data Service (`customerDataService`)

Handles customer requests, feedback, and educational content.

#### Key Features
- Pickup request management
- Scheduled pickup tracking
- Feedback and rating system
- Waste sorting tips and educational content
- Service history and analytics

#### Sample Data
- **3 pickup requests** with different waste types and statuses
- **2 scheduled pickups** with driver assignments
- **2 feedback entries** with detailed ratings
- **3 waste tips** with educational content
- **Customer analytics** with environmental impact metrics

#### Key Methods
```typescript
// Pickup requests
await customerDataService.getPickupRequests(customerId);
await customerDataService.createPickupRequest(requestData);
await customerDataService.getUpcomingPickups(customerId);

// Feedback
await customerDataService.submitFeedback(feedbackData);
await customerDataService.getFeedback(customerId);

// Educational content
await customerDataService.getWasteTips(WasteType.ORGANIC);
await customerDataService.searchTips(query);

// Analytics
await customerDataService.getCustomerAnalytics(customerId);
```

### 3. Routes Service (`routesService`)

Provides route optimization, mapping, and location services.

#### Key Features
- Route optimization algorithms
- GPS coordinate management
- Distance and time calculations
- Service area validation
- Nearby location discovery

#### Sample Data
- **3 mock routes** with optimized paths
- **8 common locations** in the service area
- **Route statistics** with completion rates
- **Service area definition** with center and radius

#### Key Methods
```typescript
// Route management
await routesService.getRoutes(driverId);
await routesService.optimizeRoute(optimizationRequest);
await routesService.updateRouteStatus(routeId, 'active');

// Location services
await routesService.calculateRoute(startCoord, endCoord);
await routesService.getNearbyLocations(coordinate, radius);
await routesService.isWithinServiceArea(coordinate);

// Statistics
await routesService.getRouteStats(driverId, dateRange);
```

### 4. Notifications Service (`notificationsService`)

Manages notifications for both drivers and customers.

#### Key Features
- Role-based notifications
- Template-based notification generation
- Scheduled notifications
- Read/unread status tracking
- Notification categorization

#### Sample Data
- **5 general notifications** for system updates
- **3 driver-specific notifications** for job updates
- **5 customer notifications** for pickups and feedback
- **Notification templates** for dynamic generation

#### Key Methods
```typescript
// Get notifications
await notificationsService.getNotifications(userId, userType);
await notificationsService.getUnreadCount(userId, userType);

// Manage notifications
await notificationsService.markAsRead(notificationId);
await notificationsService.createNotification(notificationData);

// Advanced features
await notificationsService.generateNotification(userType, templateKey, params);
await notificationsService.scheduleNotification(notification, scheduledDate);
```

## Unified Data Service

The `DataService` class provides a single interface to access all mock services:

```typescript
import { dataService } from '../services';

// Driver operations
const jobs = await dataService.driver.getTodaysJobs();
const route = await dataService.driver.getActiveRoute(driverId);

// Customer operations
const requests = await dataService.customer.getPickupRequests(customerId);
const tips = await dataService.customer.getWasteTips(WasteType.ORGANIC);

// Cross-service operations
const dashboardData = await dataService.getDashboardData(userId, userRole);
const searchResults = await dataService.globalSearch(query, userRole);
```

## Configuration

### API Simulation Settings
```typescript
export const MOCK_API_DELAY = 500; // Network delay in milliseconds
export const MOCK_API_FAILURE_RATE = 0.05; // 5% failure rate
```

### Customization
- Modify delay and failure rates in `services/mockData/index.ts`
- Add new mock data by extending the existing arrays
- Create new service methods following the established patterns

## Data Relationships

### Driver → Jobs → Routes
- Drivers are assigned multiple jobs
- Jobs are organized into optimized routes
- Routes track completion status and statistics

### Customer → Requests → Pickups → Feedback
- Customers create pickup requests
- Requests become scheduled pickups
- Completed pickups can receive feedback

### Notifications → All Entities
- Notifications link to jobs, pickups, and other entities
- Role-based filtering ensures relevant notifications
- Templates enable dynamic notification generation

## Testing and Development

### Mock Data Statistics
```typescript
import { getMockDataStats } from '../services/mockData';

const stats = getMockDataStats();
// Returns: totalJobs, totalRoutes, totalCustomers, etc.
```

### Data Reset and Seeding
```typescript
import { resetMockData, seedMockData } from '../services/mockData';

// Reset to initial state
resetMockData();

// Add additional test data
seedMockData({
  additionalJobs: 10,
  additionalCustomers: 5,
  additionalNotifications: 20,
});
```

### Health Checks
```typescript
const health = await dataService.healthCheck();
// Returns status of all services
```

## Future Backend Integration

The mock services are designed to be easily replaceable with real API calls:

1. **Same Interface**: All methods return Promises with the same data structures
2. **Error Handling**: Consistent error patterns that match real API responses
3. **Type Safety**: Full TypeScript interfaces that will work with real APIs
4. **Service Layer**: The unified `DataService` can be updated to use real endpoints

### Migration Path
1. Replace individual service implementations
2. Update the `DataService` class to use real API clients
3. Maintain the same public interface for components
4. Update configuration for real API endpoints

## Best Practices

### Using Mock Services
- Always use the unified `dataService` for consistency
- Handle errors appropriately (services simulate real failures)
- Use TypeScript interfaces for type safety
- Test with different data scenarios

### Adding New Data
- Follow existing patterns for data structure
- Include realistic variations and edge cases
- Update related services when adding cross-references
- Document new data relationships

### Performance Considerations
- Mock services include realistic delays
- Large datasets are paginated where appropriate
- Optimize queries for realistic performance testing
- Consider memory usage with large mock datasets