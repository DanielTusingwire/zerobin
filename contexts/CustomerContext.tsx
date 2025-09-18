import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { dataService } from '../services/dataService';
import { RequestStatus, WasteType } from '../types/common';
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
} from '../types/customer';
import { useAppContext } from './AppContext';

// Customer state interface
export interface CustomerState {
    // Customer profile
    profile: CustomerProfile | null;
    preferences: CustomerPreferences | null;
    analytics: CustomerAnalytics | null;

    // Pickup requests
    pickupRequests: PickupRequest[];
    recentRequests: PickupRequest[];
    requestsLoading: boolean;

    // Scheduled pickups
    scheduledPickups: ScheduledPickup[];
    upcomingPickups: ScheduledPickup[];
    pickupsLoading: boolean;

    // Feedback
    feedback: Feedback[];
    feedbackLoading: boolean;

    // Educational content
    wasteTips: WasteTip[];
    tipCategories: TipCategory[];
    filteredTips: WasteTip[];
    tipsLoading: boolean;

    // Service history
    serviceHistory: ServiceHistory[];
    historyLoading: boolean;

    // Notifications
    notifications: CustomerNotification[];
    unreadNotifications: CustomerNotification[];
    notificationsLoading: boolean;

    // Filters and search
    selectedTipCategory: WasteType | 'all';
    tipsSearchQuery: string;
    requestStatusFilter: RequestStatus | 'all';

    // Loading states
    isLoading: boolean;
    error: string | null;

    // Last update times
    lastRequestsUpdate: Date | null;
    lastPickupsUpdate: Date | null;
    lastTipsUpdate: Date | null;
    lastAnalyticsUpdate: Date | null;
}

// Customer actions
export type CustomerAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_PROFILE'; payload: CustomerProfile | null }
    | { type: 'SET_PREFERENCES'; payload: CustomerPreferences | null }
    | { type: 'SET_ANALYTICS'; payload: CustomerAnalytics | null }
    | { type: 'SET_PICKUP_REQUESTS'; payload: PickupRequest[] }
    | { type: 'SET_RECENT_REQUESTS'; payload: PickupRequest[] }
    | { type: 'SET_REQUESTS_LOADING'; payload: boolean }
    | { type: 'ADD_PICKUP_REQUEST'; payload: PickupRequest }
    | { type: 'UPDATE_PICKUP_REQUEST'; payload: PickupRequest }
    | { type: 'SET_SCHEDULED_PICKUPS'; payload: ScheduledPickup[] }
    | { type: 'SET_UPCOMING_PICKUPS'; payload: ScheduledPickup[] }
    | { type: 'SET_PICKUPS_LOADING'; payload: boolean }
    | { type: 'SET_FEEDBACK'; payload: Feedback[] }
    | { type: 'SET_FEEDBACK_LOADING'; payload: boolean }
    | { type: 'ADD_FEEDBACK'; payload: Feedback }
    | { type: 'SET_WASTE_TIPS'; payload: WasteTip[] }
    | { type: 'SET_TIP_CATEGORIES'; payload: TipCategory[] }
    | { type: 'SET_FILTERED_TIPS'; payload: WasteTip[] }
    | { type: 'SET_TIPS_LOADING'; payload: boolean }
    | { type: 'SET_SERVICE_HISTORY'; payload: ServiceHistory[] }
    | { type: 'SET_HISTORY_LOADING'; payload: boolean }
    | { type: 'SET_NOTIFICATIONS'; payload: CustomerNotification[] }
    | { type: 'SET_NOTIFICATIONS_LOADING'; payload: boolean }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string }
    | { type: 'SET_TIP_CATEGORY_FILTER'; payload: WasteType | 'all' }
    | { type: 'SET_TIPS_SEARCH_QUERY'; payload: string }
    | { type: 'SET_REQUEST_STATUS_FILTER'; payload: RequestStatus | 'all' }
    | { type: 'SET_LAST_REQUESTS_UPDATE'; payload: Date }
    | { type: 'SET_LAST_PICKUPS_UPDATE'; payload: Date }
    | { type: 'SET_LAST_TIPS_UPDATE'; payload: Date }
    | { type: 'SET_LAST_ANALYTICS_UPDATE'; payload: Date }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: CustomerState = {
    profile: null,
    preferences: null,
    analytics: null,
    pickupRequests: [],
    recentRequests: [],
    requestsLoading: false,
    scheduledPickups: [],
    upcomingPickups: [],
    pickupsLoading: false,
    feedback: [],
    feedbackLoading: false,
    wasteTips: [],
    tipCategories: [],
    filteredTips: [],
    tipsLoading: false,
    serviceHistory: [],
    historyLoading: false,
    notifications: [],
    unreadNotifications: [],
    notificationsLoading: false,
    selectedTipCategory: 'all',
    tipsSearchQuery: '',
    requestStatusFilter: 'all',
    isLoading: false,
    error: null,
    lastRequestsUpdate: null,
    lastPickupsUpdate: null,
    lastTipsUpdate: null,
    lastAnalyticsUpdate: null,
};

// Customer reducer
const customerReducer = (state: CustomerState, action: CustomerAction): CustomerState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        case 'SET_PROFILE':
            return { ...state, profile: action.payload };

        case 'SET_PREFERENCES':
            return { ...state, preferences: action.payload };

        case 'SET_ANALYTICS':
            return { ...state, analytics: action.payload };

        case 'SET_PICKUP_REQUESTS':
            return {
                ...state,
                pickupRequests: action.payload,
                recentRequests: action.payload.slice(0, 5), // Keep 5 most recent
                requestsLoading: false,
            };

        case 'SET_RECENT_REQUESTS':
            return { ...state, recentRequests: action.payload };

        case 'SET_REQUESTS_LOADING':
            return { ...state, requestsLoading: action.payload };

        case 'ADD_PICKUP_REQUEST':
            const newRequests = [action.payload, ...state.pickupRequests];
            return {
                ...state,
                pickupRequests: newRequests,
                recentRequests: newRequests.slice(0, 5),
            };

        case 'UPDATE_PICKUP_REQUEST':
            const updatedRequests = state.pickupRequests.map(request =>
                request.id === action.payload.id ? action.payload : request
            );
            return {
                ...state,
                pickupRequests: updatedRequests,
                recentRequests: updatedRequests.slice(0, 5),
            };

        case 'SET_SCHEDULED_PICKUPS':
            return {
                ...state,
                scheduledPickups: action.payload,
                pickupsLoading: false,
            };

        case 'SET_UPCOMING_PICKUPS':
            return { ...state, upcomingPickups: action.payload };

        case 'SET_PICKUPS_LOADING':
            return { ...state, pickupsLoading: action.payload };

        case 'SET_FEEDBACK':
            return { ...state, feedback: action.payload, feedbackLoading: false };

        case 'SET_FEEDBACK_LOADING':
            return { ...state, feedbackLoading: action.payload };

        case 'ADD_FEEDBACK':
            return {
                ...state,
                feedback: [action.payload, ...state.feedback],
            };

        case 'SET_WASTE_TIPS':
            return { ...state, wasteTips: action.payload, tipsLoading: false };

        case 'SET_TIP_CATEGORIES':
            return { ...state, tipCategories: action.payload };

        case 'SET_FILTERED_TIPS':
            return { ...state, filteredTips: action.payload };

        case 'SET_TIPS_LOADING':
            return { ...state, tipsLoading: action.payload };

        case 'SET_SERVICE_HISTORY':
            return { ...state, serviceHistory: action.payload, historyLoading: false };

        case 'SET_HISTORY_LOADING':
            return { ...state, historyLoading: action.payload };

        case 'SET_NOTIFICATIONS':
            const unreadNotifications = action.payload.filter(n => !n.read);
            return {
                ...state,
                notifications: action.payload,
                unreadNotifications,
                notificationsLoading: false,
            };

        case 'SET_NOTIFICATIONS_LOADING':
            return { ...state, notificationsLoading: action.payload };

        case 'MARK_NOTIFICATION_READ':
            const updatedNotifications = state.notifications.map(notification =>
                notification.id === action.payload
                    ? { ...notification, read: true, updatedAt: new Date() }
                    : notification
            );
            return {
                ...state,
                notifications: updatedNotifications,
                unreadNotifications: updatedNotifications.filter(n => !n.read),
            };

        case 'SET_TIP_CATEGORY_FILTER':
            return { ...state, selectedTipCategory: action.payload };

        case 'SET_TIPS_SEARCH_QUERY':
            return { ...state, tipsSearchQuery: action.payload };

        case 'SET_REQUEST_STATUS_FILTER':
            return { ...state, requestStatusFilter: action.payload };

        case 'SET_LAST_REQUESTS_UPDATE':
            return { ...state, lastRequestsUpdate: action.payload };

        case 'SET_LAST_PICKUPS_UPDATE':
            return { ...state, lastPickupsUpdate: action.payload };

        case 'SET_LAST_TIPS_UPDATE':
            return { ...state, lastTipsUpdate: action.payload };

        case 'SET_LAST_ANALYTICS_UPDATE':
            return { ...state, lastAnalyticsUpdate: action.payload };

        case 'RESET_STATE':
            return { ...initialState };

        default:
            return state;
    }
};

// Context interface
interface CustomerContextType {
    state: CustomerState;
    dispatch: React.Dispatch<CustomerAction>;

    // Data loading methods
    loadProfile: () => Promise<void>;
    loadPreferences: () => Promise<void>;
    loadAnalytics: () => Promise<void>;
    loadPickupRequests: () => Promise<void>;
    loadScheduledPickups: () => Promise<void>;
    loadUpcomingPickups: () => Promise<void>;
    loadFeedback: () => Promise<void>;
    loadWasteTips: (category?: WasteType) => Promise<void>;
    loadTipCategories: () => Promise<void>;
    loadServiceHistory: () => Promise<void>;
    loadNotifications: () => Promise<void>;
    refreshAll: () => Promise<void>;

    // Request management
    createPickupRequest: (request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePickupRequest: (requestId: string, updates: Partial<PickupRequest>) => Promise<void>;

    // Feedback management
    submitFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;

    // Profile management
    updateProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
    updatePreferences: (preferences: Partial<CustomerPreferences>) => Promise<void>;

    // Notification management
    markNotificationAsRead: (notificationId: string) => Promise<void>;

    // Filtering and search
    setTipCategoryFilter: (category: WasteType | 'all') => void;
    setTipsSearchQuery: (query: string) => void;
    setRequestStatusFilter: (filter: RequestStatus | 'all') => void;
    getFilteredRequests: () => PickupRequest[];
    getFilteredTips: () => WasteTip[];
    searchTips: (query: string) => Promise<void>;

    // Utility methods
    reset: () => void;
}

// Create context
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Customer provider component
export function CustomerProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(customerReducer, initialState);
    const { state: appState } = useAppContext();

    // Auto-load data when user changes
    useEffect(() => {
        if (appState.currentUser?.role === 'customer' && appState.currentUser.id) {
            loadInitialData();
        }
    }, [appState.currentUser]);

    // Update filtered tips when filters change
    useEffect(() => {
        updateFilteredTips();
    }, [state.wasteTips, state.selectedTipCategory, state.tipsSearchQuery]);

    const loadInitialData = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await Promise.all([
                loadProfile(),
                loadUpcomingPickups(),
                loadTipCategories(),
                loadNotifications(),
            ]);
        } catch (error) {
            console.error('Failed to load initial customer data:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load customer data' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const loadProfile = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const profile = await dataService.customer.getProfile(appState.currentUser.id);
            dispatch({ type: 'SET_PROFILE', payload: profile });
        } catch (error) {
            console.error('Failed to load customer profile:', error);
            throw error;
        }
    };

    const loadPreferences = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const preferences = await dataService.customer.getPreferences(appState.currentUser.id);
            dispatch({ type: 'SET_PREFERENCES', payload: preferences });
        } catch (error) {
            console.error('Failed to load customer preferences:', error);
            throw error;
        }
    };

    const loadAnalytics = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const analytics = await dataService.customer.getAnalytics(appState.currentUser.id);
            dispatch({ type: 'SET_ANALYTICS', payload: analytics });
            dispatch({ type: 'SET_LAST_ANALYTICS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load customer analytics:', error);
            throw error;
        }
    };

    const loadPickupRequests = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_REQUESTS_LOADING', payload: true });
            const requests = await dataService.customer.getPickupRequests(appState.currentUser.id);
            dispatch({ type: 'SET_PICKUP_REQUESTS', payload: requests });
            dispatch({ type: 'SET_LAST_REQUESTS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load pickup requests:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load pickup requests' });
        }
    };

    const loadScheduledPickups = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_PICKUPS_LOADING', payload: true });
            const pickups = await dataService.customer.getScheduledPickups(appState.currentUser.id);
            dispatch({ type: 'SET_SCHEDULED_PICKUPS', payload: pickups });
            dispatch({ type: 'SET_LAST_PICKUPS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load scheduled pickups:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load scheduled pickups' });
        }
    };

    const loadUpcomingPickups = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const upcomingPickups = await dataService.customer.getUpcomingPickups(appState.currentUser.id);
            dispatch({ type: 'SET_UPCOMING_PICKUPS', payload: upcomingPickups });
        } catch (error) {
            console.error('Failed to load upcoming pickups:', error);
            throw error;
        }
    };

    const loadFeedback = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_FEEDBACK_LOADING', payload: true });
            const feedback = await dataService.customer.getFeedback(appState.currentUser.id);
            dispatch({ type: 'SET_FEEDBACK', payload: feedback });
        } catch (error) {
            console.error('Failed to load feedback:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load feedback' });
        }
    };

    const loadWasteTips = async (category?: WasteType) => {
        try {
            dispatch({ type: 'SET_TIPS_LOADING', payload: true });
            const tips = await dataService.customer.getWasteTips(category);
            dispatch({ type: 'SET_WASTE_TIPS', payload: tips });
            dispatch({ type: 'SET_LAST_TIPS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load waste tips:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load waste tips' });
        }
    };

    const loadTipCategories = async () => {
        try {
            const categories = await dataService.customer.getTipCategories();
            dispatch({ type: 'SET_TIP_CATEGORIES', payload: categories });
        } catch (error) {
            console.error('Failed to load tip categories:', error);
            throw error;
        }
    };

    const loadServiceHistory = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_HISTORY_LOADING', payload: true });
            const history = await dataService.customer.getServiceHistory(appState.currentUser.id);
            dispatch({ type: 'SET_SERVICE_HISTORY', payload: history });
        } catch (error) {
            console.error('Failed to load service history:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load service history' });
        }
    };

    const loadNotifications = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_NOTIFICATIONS_LOADING', payload: true });
            const notifications = await dataService.customer.getNotifications(appState.currentUser.id);
            dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
        } catch (error) {
            console.error('Failed to load notifications:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load notifications' });
        }
    };

    const refreshAll = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await Promise.all([
                loadProfile(),
                loadPreferences(),
                loadAnalytics(),
                loadPickupRequests(),
                loadScheduledPickups(),
                loadFeedback(),
                loadWasteTips(),
                loadServiceHistory(),
                loadNotifications(),
            ]);
        } catch (error) {
            console.error('Failed to refresh customer data:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh data' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const createPickupRequest = async (request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newRequest = await dataService.customer.createPickupRequest(request);
            dispatch({ type: 'ADD_PICKUP_REQUEST', payload: newRequest });
        } catch (error) {
            console.error('Failed to create pickup request:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to create pickup request' });
            throw error;
        }
    };

    const updatePickupRequest = async (requestId: string, updates: Partial<PickupRequest>) => {
        try {
            const updatedRequest = await dataService.customer.updatePickupRequest(requestId, updates);
            dispatch({ type: 'UPDATE_PICKUP_REQUEST', payload: updatedRequest });
        } catch (error) {
            console.error('Failed to update pickup request:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update pickup request' });
            throw error;
        }
    };

    const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newFeedback = await dataService.customer.submitFeedback(feedback);
            dispatch({ type: 'ADD_FEEDBACK', payload: newFeedback });
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to submit feedback' });
            throw error;
        }
    };

    const updateProfile = async (updates: Partial<CustomerProfile>) => {
        try {
            if (!appState.currentUser?.id) return;

            const updatedProfile = await dataService.customer.updateProfile(appState.currentUser.id, updates);
            dispatch({ type: 'SET_PROFILE', payload: updatedProfile });
        } catch (error) {
            console.error('Failed to update profile:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
            throw error;
        }
    };

    const updatePreferences = async (preferences: Partial<CustomerPreferences>) => {
        try {
            if (!appState.currentUser?.id) return;

            const updatedPreferences = await dataService.customer.updatePreferences(appState.currentUser.id, preferences);
            dispatch({ type: 'SET_PREFERENCES', payload: updatedPreferences });
        } catch (error) {
            console.error('Failed to update preferences:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update preferences' });
            throw error;
        }
    };

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await dataService.customer.markNotificationAsRead(notificationId);
            dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update notification' });
            throw error;
        }
    };

    const setTipCategoryFilter = (category: WasteType | 'all') => {
        dispatch({ type: 'SET_TIP_CATEGORY_FILTER', payload: category });
    };

    const setTipsSearchQuery = (query: string) => {
        dispatch({ type: 'SET_TIPS_SEARCH_QUERY', payload: query });
    };

    const setRequestStatusFilter = (filter: RequestStatus | 'all') => {
        dispatch({ type: 'SET_REQUEST_STATUS_FILTER', payload: filter });
    };

    const getFilteredRequests = (): PickupRequest[] => {
        let filteredRequests = state.pickupRequests;

        if (state.requestStatusFilter !== 'all') {
            filteredRequests = filteredRequests.filter(request => request.status === state.requestStatusFilter);
        }

        return filteredRequests;
    };

    const getFilteredTips = (): WasteTip[] => {
        return state.filteredTips;
    };

    const updateFilteredTips = () => {
        let filteredTips = state.wasteTips;

        // Apply category filter
        if (state.selectedTipCategory !== 'all') {
            filteredTips = filteredTips.filter(tip => tip.category === state.selectedTipCategory);
        }

        // Apply search query
        if (state.tipsSearchQuery.trim()) {
            const query = state.tipsSearchQuery.toLowerCase();
            filteredTips = filteredTips.filter(tip =>
                tip.title.toLowerCase().includes(query) ||
                tip.description.toLowerCase().includes(query) ||
                tip.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        dispatch({ type: 'SET_FILTERED_TIPS', payload: filteredTips });
    };

    const searchTips = async (query: string) => {
        try {
            dispatch({ type: 'SET_TIPS_LOADING', payload: true });
            const searchResults = await dataService.customer.searchTips(query);
            dispatch({ type: 'SET_WASTE_TIPS', payload: searchResults });
        } catch (error) {
            console.error('Failed to search tips:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to search tips' });
        }
    };

    const reset = () => {
        dispatch({ type: 'RESET_STATE' });
    };

    const contextValue: CustomerContextType = {
        state,
        dispatch,
        loadProfile,
        loadPreferences,
        loadAnalytics,
        loadPickupRequests,
        loadScheduledPickups,
        loadUpcomingPickups,
        loadFeedback,
        loadWasteTips,
        loadTipCategories,
        loadServiceHistory,
        loadNotifications,
        refreshAll,
        createPickupRequest,
        updatePickupRequest,
        submitFeedback,
        updateProfile,
        updatePreferences,
        markNotificationAsRead,
        setTipCategoryFilter,
        setTipsSearchQuery,
        setRequestStatusFilter,
        getFilteredRequests,
        getFilteredTips,
        searchTips,
        reset,
    };

    return (
        <CustomerContext.Provider value={contextValue}>
            {children}
        </CustomerContext.Provider>
    );
}

// Hook to use customer context
export function useCustomerContext() {
    const context = useContext(CustomerContext);
    if (context === undefined) {
        throw new Error('useCustomerContext must be used within a CustomerProvider');
    }
    return context;
}

// Convenience hooks
export function useCustomerState() {
    const { state } = useCustomerContext();
    return state;
}

export function useCustomerActions() {
    const {
        loadProfile,
        loadPreferences,
        loadAnalytics,
        loadPickupRequests,
        loadScheduledPickups,
        loadUpcomingPickups,
        loadFeedback,
        loadWasteTips,
        loadTipCategories,
        loadServiceHistory,
        loadNotifications,
        refreshAll,
        createPickupRequest,
        updatePickupRequest,
        submitFeedback,
        updateProfile,
        updatePreferences,
        markNotificationAsRead,
        setTipCategoryFilter,
        setTipsSearchQuery,
        setRequestStatusFilter,
        getFilteredRequests,
        getFilteredTips,
        searchTips,
        reset,
    } = useCustomerContext();

    return {
        loadProfile,
        loadPreferences,
        loadAnalytics,
        loadPickupRequests,
        loadScheduledPickups,
        loadUpcomingPickups,
        loadFeedback,
        loadWasteTips,
        loadTipCategories,
        loadServiceHistory,
        loadNotifications,
        refreshAll,
        createPickupRequest,
        updatePickupRequest,
        submitFeedback,
        updateProfile,
        updatePreferences,
        markNotificationAsRead,
        setTipCategoryFilter,
        setTipsSearchQuery,
        setRequestStatusFilter,
        getFilteredRequests,
        getFilteredTips,
        searchTips,
        reset,
    };
}