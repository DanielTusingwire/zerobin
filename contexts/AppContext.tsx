import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { UserRole } from '../types/common';

// App state interface
export interface AppState {
    // User and authentication
    isAuthenticated: boolean;
    currentUser: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        address?: string;
        phone?: string;
    } | null;

    // App settings
    theme: 'light' | 'dark' | 'system';
    language: string;

    // Network and offline
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

// App actions
export type AppAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_USER'; payload: AppState['currentUser'] }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'SET_THEME'; payload: AppState['theme'] }
    | { type: 'SET_LANGUAGE'; payload: string }
    | { type: 'SET_ONLINE_STATUS'; payload: boolean }
    | { type: 'SET_OFFLINE_MODE'; payload: boolean }
    | { type: 'SET_LAST_SYNC_TIME'; payload: Date }
    | { type: 'SET_NOTIFICATIONS_ENABLED'; payload: boolean }
    | { type: 'SET_UNREAD_COUNT'; payload: number }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
    isAuthenticated: false,
    currentUser: null,
    theme: 'system',
    language: 'en',
    isOnline: true,
    isOfflineMode: false,
    lastSyncTime: null,
    isLoading: false,
    error: null,
    notificationsEnabled: true,
    unreadNotificationsCount: 0,
};

// App reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        case 'SET_USER':
            return {
                ...state,
                currentUser: action.payload,
                isAuthenticated: action.payload !== null,
            };

        case 'SET_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: action.payload,
                currentUser: action.payload ? state.currentUser : null,
            };

        case 'SET_THEME':
            return { ...state, theme: action.payload };

        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };

        case 'SET_ONLINE_STATUS':
            return { ...state, isOnline: action.payload };

        case 'SET_OFFLINE_MODE':
            return { ...state, isOfflineMode: action.payload };

        case 'SET_LAST_SYNC_TIME':
            return { ...state, lastSyncTime: action.payload };

        case 'SET_NOTIFICATIONS_ENABLED':
            return { ...state, notificationsEnabled: action.payload };

        case 'SET_UNREAD_COUNT':
            return { ...state, unreadNotificationsCount: action.payload };

        case 'RESET_STATE':
            return { ...initialState };

        default:
            return state;
    }
};

// Context interface
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;

    // Convenience methods
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUser: (user: AppState['currentUser']) => void;
    setTheme: (theme: AppState['theme']) => void;
    setLanguage: (language: string) => void;
    toggleOfflineMode: () => void;
    updateLastSyncTime: () => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    updateUnreadCount: (count: number) => void;
    logout: () => void;
    reset: () => void;
}

// Storage keys
const STORAGE_KEYS = {
    USER: '@ecotrack:user',
    THEME: '@ecotrack:theme',
    LANGUAGE: '@ecotrack:language',
    NOTIFICATIONS: '@ecotrack:notifications_enabled',
    OFFLINE_MODE: '@ecotrack:offline_mode',
} as const;

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// App provider component
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Initialize app state from storage
    useEffect(() => {
        initializeAppState();
        setupNetworkListener();
    }, []);

    // Save state changes to storage
    useEffect(() => {
        saveStateToStorage();
    }, [state.currentUser, state.theme, state.language, state.notificationsEnabled, state.isOfflineMode]);

    const initializeAppState = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Load saved user data
            const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            if (savedUser) {
                const user = JSON.parse(savedUser);
                dispatch({ type: 'SET_USER', payload: user });
            }

            // Load saved preferences
            const [savedTheme, savedLanguage, savedNotifications, savedOfflineMode] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.THEME),
                AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
                AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
                AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_MODE),
            ]);

            if (savedTheme) {
                dispatch({ type: 'SET_THEME', payload: savedTheme as AppState['theme'] });
            }
            if (savedLanguage) {
                dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
            }
            if (savedNotifications !== null) {
                dispatch({ type: 'SET_NOTIFICATIONS_ENABLED', payload: JSON.parse(savedNotifications) });
            }
            if (savedOfflineMode !== null) {
                dispatch({ type: 'SET_OFFLINE_MODE', payload: JSON.parse(savedOfflineMode) });
            }

        } catch (error) {
            console.error('Failed to initialize app state:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load app settings' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const saveStateToStorage = async () => {
        try {
            const savePromises = [];

            if (state.currentUser) {
                savePromises.push(
                    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.currentUser))
                );
            }

            savePromises.push(
                AsyncStorage.setItem(STORAGE_KEYS.THEME, state.theme),
                AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language),
                AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(state.notificationsEnabled)),
                AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, JSON.stringify(state.isOfflineMode))
            );

            await Promise.all(savePromises);
        } catch (error) {
            console.error('Failed to save app state:', error);
        }
    };

    const setupNetworkListener = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            dispatch({ type: 'SET_ONLINE_STATUS', payload: state.isConnected ?? false });
        });

        return unsubscribe;
    };

    // Convenience methods
    const setLoading = (loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const setUser = (user: AppState['currentUser']) => {
        dispatch({ type: 'SET_USER', payload: user });
    };

    const setTheme = (theme: AppState['theme']) => {
        dispatch({ type: 'SET_THEME', payload: theme });
    };

    const setLanguage = (language: string) => {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
    };

    const toggleOfflineMode = () => {
        dispatch({ type: 'SET_OFFLINE_MODE', payload: !state.isOfflineMode });
    };

    const updateLastSyncTime = () => {
        dispatch({ type: 'SET_LAST_SYNC_TIME', payload: new Date() });
    };

    const setNotificationsEnabled = (enabled: boolean) => {
        dispatch({ type: 'SET_NOTIFICATIONS_ENABLED', payload: enabled });
    };

    const updateUnreadCount = (count: number) => {
        dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
    };

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.USER,
                STORAGE_KEYS.THEME,
                STORAGE_KEYS.LANGUAGE,
                STORAGE_KEYS.NOTIFICATIONS,
                STORAGE_KEYS.OFFLINE_MODE,
            ]);
            dispatch({ type: 'RESET_STATE' });
        } catch (error) {
            console.error('Failed to logout:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to logout' });
        }
    };

    const reset = () => {
        dispatch({ type: 'RESET_STATE' });
    };

    const contextValue: AppContextType = {
        state,
        dispatch,
        setLoading,
        setError,
        setUser,
        setTheme,
        setLanguage,
        toggleOfflineMode,
        updateLastSyncTime,
        setNotificationsEnabled,
        updateUnreadCount,
        logout,
        reset,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

// Hook to use app context
export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

// Convenience hooks
export function useAppState() {
    const { state } = useAppContext();
    return state;
}

export function useAppActions() {
    const {
        setLoading,
        setError,
        setUser,
        setTheme,
        setLanguage,
        toggleOfflineMode,
        updateLastSyncTime,
        setNotificationsEnabled,
        updateUnreadCount,
        logout,
        reset
    } = useAppContext();

    return {
        setLoading,
        setError,
        setUser,
        setTheme,
        setLanguage,
        toggleOfflineMode,
        updateLastSyncTime,
        setNotificationsEnabled,
        updateUnreadCount,
        logout,
        reset,
    };
}