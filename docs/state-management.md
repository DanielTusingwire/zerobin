# State Management Documentation

## Overview

The EcoTrack app uses React Context API with useReducer for comprehensive state management. The state is organized into four main contexts, each handling specific aspects of the application.

## Architecture

### Context Hierarchy
```
RootProvider
├── AppProvider (Global app state)
│   ├── NavigationProvider (Navigation and routing)
│   │   ├── DriverProvider (Driver-specific state)
│   │   │   └── CustomerProvider (Customer-specific state)
│   │   │       └── App Components
```

### Context Structure
```
contexts/
├── AppContext.tsx           # Global app state
├── NavigationContext.tsx    # Navigation and routing
├── DriverContext.tsx        # Driver-specific state
├── CustomerContext.tsx      # Customer-specific state
├── RootProvider.tsx         # Combined provider
└── index.ts                 # Exports
```

## Contexts

### 1. AppContext - Global Application State

Manages global application state that persists across role switches and app sessions.

#### State Properties
```typescript
interface AppState {
  // Authentication
  isAuthenticated: boolean;
  currentUser: User | null;
  
  // App settings
  theme: 'light' | 'dark' | 'system';
  language: string;
  
  // Network status
  isOnline: boolean;
  isOfflineMode: boolean;
  lastSyncTime: Date | null;
  
  // App status
  isLoading: boolean;
  error: string | null;
  
  // Notifications
  notificationsEnabled: boolean;
  unreadNotificationsCount: number;
}
```

#### Key Features
- **Persistent Storage**: User data, theme, and preferences saved to AsyncStorage
- **Network Monitoring**: Real-time network status using NetInfo
- **Error Handling**: Global error state management
- **Theme Management**: System, light, and dark theme support
- **Notification Settings**: Global notification preferences

#### Usage
```typescript
import { useAppContext, useAppState, useAppActions } from '../contexts';

// Full context access
const { state, setUser, setTheme } = useAppContext();

// State-only access
const appState = useAppState();

// Actions-only access
const { setLoading, setError, logout } = useAppActions();
```

### 2. NavigationContext - Navigation State

Handles role-based navigation and routing state.

#### State Properties
```typescript
interface NavigationState {
  currentRole: UserRole | null;
  isLoading: boolean;
}
```

#### Key Features
- **Role Persistence**: Saves selected role to AsyncStorage
- **Role Switching**: Seamless switching between driver and customer roles
- **Navigation Integration**: Works with Expo Router for type-safe navigation

#### Usage
```typescript
import { useNavigationContext, useRoleNavigation } from '../contexts';

// Navigation context
const { currentRole, switchRole } = useNavigationContext();

// Role-specific navigation
const { isDriver, isCustomer, switchToDriver } = useRoleNavigation();
```

### 3. DriverContext - Driver-Specific State

Manages all driver-related data and operations.

#### State Properties
```typescript
interface DriverState {
  // Profile and stats
  profile: DriverProfile | null;
  stats: DriverStats | null;
  
  // Jobs management
  jobs: Job[];
  todaysJobs: Job[];
  activeJob: Job | null;
  
  // Routes
  routes: Route[];
  activeRoute: Route | null;
  
  // Scanning and photos
  scanRecords: ScanRecord[];
  recentScans: ScanRecord[];
  
  // Filters and search
  jobStatusFilter: JobStatus | 'all';
  searchQuery: string;
  
  // Loading states
  isLoading: boolean;
  jobsLoading: boolean;
  routesLoading: boolean;
}
```

#### Key Features
- **Auto-loading**: Automatically loads data when driver role is selected
- **Real-time Updates**: Updates job status, photos, and scan records
- **Filtering**: Advanced filtering and search capabilities
- **Route Management**: Active route tracking and optimization
- **Offline Support**: Caches data for offline access

#### Usage
```typescript
import { useDriverContext, useDriverState, useDriverActions } from '../contexts';

// Full context access
const { state, updateJobStatus, addJobPhoto } = useDriverContext();

// State-only access
const driverState = useDriverState();

// Actions-only access
const { loadJobs, setActiveJob, refreshAll } = useDriverActions();
```

### 4. CustomerContext - Customer-Specific State

Manages all customer-related data and operations.

#### State Properties
```typescript
interface CustomerState {
  // Profile and preferences
  profile: CustomerProfile | null;
  preferences: CustomerPreferences | null;
  analytics: CustomerAnalytics | null;
  
  // Pickup management
  pickupRequests: PickupRequest[];
  scheduledPickups: ScheduledPickup[];
  upcomingPickups: ScheduledPickup[];
  
  // Feedback
  feedback: Feedback[];
  
  // Educational content
  wasteTips: WasteTip[];
  tipCategories: TipCategory[];
  filteredTips: WasteTip[];
  
  // Service history
  serviceHistory: ServiceHistory[];
  
  // Notifications
  notifications: CustomerNotification[];
  unreadNotifications: CustomerNotification[];
  
  // Filters and search
  selectedTipCategory: WasteType | 'all';
  tipsSearchQuery: string;
  requestStatusFilter: RequestStatus | 'all';
}
```

#### Key Features
- **Auto-loading**: Automatically loads data when customer role is selected
- **Request Management**: Create, update, and track pickup requests
- **Educational Content**: Waste sorting tips with search and filtering
- **Analytics**: Environmental impact and service analytics
- **Feedback System**: Submit and track service feedback
- **Smart Filtering**: Advanced filtering for tips and requests

#### Usage
```typescript
import { useCustomerContext, useCustomerState, useCustomerActions } from '../contexts';

// Full context access
const { state, createPickupRequest, submitFeedback } = useCustomerContext();

// State-only access
const customerState = useCustomerState();

// Actions-only access
const { loadWasteTips, setTipCategoryFilter, refreshAll } = useCustomerActions();
```

## Data Flow

### 1. Initialization Flow
```
App Start
├── AppProvider initializes
│   ├── Load user from AsyncStorage
│   ├── Load preferences from AsyncStorage
│   └── Setup network monitoring
├── NavigationProvider initializes
│   ├── Load saved role from AsyncStorage
│   └── Navigate to appropriate screen
└── Role-specific provider loads data
    ├── Driver: Load jobs, routes, profile
    └── Customer: Load requests, tips, profile
```

### 2. Role Switch Flow
```
Role Switch Triggered
├── NavigationContext updates role
├── Save new role to AsyncStorage
├── Navigate to role-specific screen
├── Previous role context resets
└── New role context loads data
```

### 3. Data Update Flow
```
User Action (e.g., update job status)
├── Context action called
├── API service called
├── Optimistic UI update (optional)
├── API response received
├── Context state updated
└── UI re-renders
```

## Best Practices

### Using Contexts
```typescript
// ✅ Good: Use specific hooks for better performance
const { jobs, activeJob } = useDriverState();
const { updateJobStatus } = useDriverActions();

// ❌ Avoid: Using full context when only state is needed
const { state } = useDriverContext(); // Re-renders on any state change
```

### Error Handling
```typescript
// ✅ Good: Handle errors in actions
const { updateJobStatus } = useDriverActions();

try {
  await updateJobStatus(jobId, JobStatus.COMPLETED);
  // Success feedback
} catch (error) {
  // Error is already set in context
  // Show user-friendly error message
}
```

### Loading States
```typescript
// ✅ Good: Use specific loading states
const { jobsLoading, routesLoading } = useDriverState();

// Show specific loading indicators
if (jobsLoading) return <JobsLoadingSpinner />;
if (routesLoading) return <RoutesLoadingSpinner />;
```

### Data Refresh
```typescript
// ✅ Good: Use refresh methods for pull-to-refresh
const { refreshAll } = useDriverActions();

const handleRefresh = async () => {
  try {
    await refreshAll();
  } catch (error) {
    // Error handled by context
  }
};
```

## Performance Optimizations

### 1. Selective Re-rendering
- Use specific hooks (`useDriverState`, `useDriverActions`) instead of full context
- Split state and actions to prevent unnecessary re-renders
- Use React.memo for expensive components

### 2. Data Caching
- Contexts cache data to reduce API calls
- Last update timestamps track data freshness
- Offline mode preserves data when network is unavailable

### 3. Lazy Loading
- Data loads only when role is active
- Background refresh for better user experience
- Pagination for large datasets (future enhancement)

## Testing

### Context Testing
```typescript
// Test context providers
import { renderHook } from '@testing-library/react-hooks';
import { DriverProvider, useDriverContext } from '../contexts';

const wrapper = ({ children }) => (
  <DriverProvider>{children}</DriverProvider>
);

test('should load driver jobs', async () => {
  const { result } = renderHook(() => useDriverContext(), { wrapper });
  
  await act(async () => {
    await result.current.loadJobs();
  });
  
  expect(result.current.state.jobs).toHaveLength(6);
});
```

### Mock Contexts
```typescript
// Create mock contexts for testing components
const mockDriverContext = {
  state: { jobs: mockJobs, isLoading: false },
  loadJobs: jest.fn(),
  updateJobStatus: jest.fn(),
};

jest.mock('../contexts', () => ({
  useDriverContext: () => mockDriverContext,
}));
```

## Migration and Scaling

### Adding New State
1. Add to appropriate context interface
2. Add action type to reducer
3. Implement reducer case
4. Add action method to context
5. Update documentation

### Context Splitting
If contexts become too large:
1. Identify related state groups
2. Create new focused context
3. Update provider hierarchy
4. Migrate components gradually

### Backend Integration
The context system is designed for easy backend integration:
1. Replace mock services with real API calls
2. Add authentication tokens to requests
3. Implement proper error handling
4. Add retry logic and offline queuing

## Debugging

### Context DevTools
```typescript
// Add to context providers for debugging
const contextValue = {
  state,
  dispatch,
  // ... other methods
};

// Log state changes in development
if (__DEV__) {
  console.log('DriverContext state updated:', state);
}
```

### State Inspection
```typescript
// Access context state in development
import { useDriverState } from '../contexts';

const DebugPanel = () => {
  const state = useDriverState();
  
  if (__DEV__) {
    return (
      <View>
        <Text>{JSON.stringify(state, null, 2)}</Text>
      </View>
    );
  }
  
  return null;
};
```

## Common Patterns

### Conditional Data Loading
```typescript
useEffect(() => {
  if (appState.currentUser?.role === 'driver' && appState.currentUser.id) {
    loadInitialData();
  }
}, [appState.currentUser]);
```

### Optimistic Updates
```typescript
const updateJobStatus = async (jobId: string, status: JobStatus) => {
  // Optimistic update
  dispatch({ type: 'UPDATE_JOB', payload: { ...job, status } });
  
  try {
    const updatedJob = await dataService.driver.updateJobStatus(jobId, status);
    dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
  } catch (error) {
    // Revert optimistic update
    dispatch({ type: 'UPDATE_JOB', payload: originalJob });
    throw error;
  }
};
```

### Cross-Context Communication
```typescript
// AppContext notifies other contexts of user changes
useEffect(() => {
  if (appState.currentUser?.role === 'driver') {
    driverActions.loadInitialData();
  } else if (appState.currentUser?.role === 'customer') {
    customerActions.loadInitialData();
  }
}, [appState.currentUser]);
```