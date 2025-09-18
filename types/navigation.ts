// Navigation type definitions for type-safe routing

export type RootStackParamList = {
    'role-selection': undefined;
    '(tabs)': undefined;
    modal: undefined;
};

export type TabsStackParamList = {
    driver: undefined;
    customer: undefined;
};

export type DriverTabParamList = {
    jobs: undefined;
    routes: undefined;
    scanner: undefined;
    profile: undefined;
};

export type CustomerTabParamList = {
    request: undefined;
    schedule: undefined;
    feedback: undefined;
    tips: undefined;
};

// Navigation props for screens
export type ScreenProps<T extends keyof any> = {
    navigation: any; // TODO: Add proper navigation typing
    route: {
        params: T;
    };
};

// Role-based navigation utilities
export type UserRole = 'driver' | 'customer';

export interface NavigationState {
    currentRole: UserRole | null;
    isAuthenticated: boolean;
    canSwitchRoles: boolean;
}

// Navigation actions
export type NavigationAction =
    | { type: 'SET_ROLE'; payload: UserRole }
    | { type: 'CLEAR_ROLE' }
    | { type: 'SET_AUTHENTICATED'; payload: boolean };

// Route configuration
export interface RouteConfig {
    name: string;
    component: React.ComponentType<any>;
    options?: {
        title?: string;
        headerShown?: boolean;
        tabBarIcon?: (props: { color: string; size: number }) => React.ReactNode;
    };
    requiresAuth?: boolean;
    allowedRoles?: UserRole[];
}