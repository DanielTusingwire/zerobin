import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { dataService } from '../services/dataService';
import { JobStatus } from '../types/common';
import { DriverProfile, DriverStats, Job, Route, ScanRecord } from '../types/driver';
import { useAppContext } from './AppContext';

// Driver state interface
export interface DriverState {
    // Driver profile
    profile: DriverProfile | null;
    stats: DriverStats | null;

    // Jobs
    jobs: Job[];
    todaysJobs: Job[];
    activeJob: Job | null;
    jobsLoading: boolean;

    // Routes
    routes: Route[];
    activeRoute: Route | null;
    routesLoading: boolean;

    // Scanning and photos
    scanRecords: ScanRecord[];
    recentScans: ScanRecord[];

    // Filters and search
    jobStatusFilter: JobStatus | 'all';
    searchQuery: string;

    // Loading states
    isLoading: boolean;
    error: string | null;

    // Last update times
    lastJobsUpdate: Date | null;
    lastRoutesUpdate: Date | null;
    lastStatsUpdate: Date | null;
}

// Driver actions
export type DriverAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_PROFILE'; payload: DriverProfile | null }
    | { type: 'SET_STATS'; payload: DriverStats | null }
    | { type: 'SET_JOBS'; payload: Job[] }
    | { type: 'SET_TODAYS_JOBS'; payload: Job[] }
    | { type: 'SET_ACTIVE_JOB'; payload: Job | null }
    | { type: 'SET_JOBS_LOADING'; payload: boolean }
    | { type: 'UPDATE_JOB'; payload: Job }
    | { type: 'SET_ROUTES'; payload: Route[] }
    | { type: 'SET_ACTIVE_ROUTE'; payload: Route | null }
    | { type: 'SET_ROUTES_LOADING'; payload: boolean }
    | { type: 'UPDATE_ROUTE'; payload: Route }
    | { type: 'SET_SCAN_RECORDS'; payload: ScanRecord[] }
    | { type: 'ADD_SCAN_RECORD'; payload: ScanRecord }
    | { type: 'SET_JOB_STATUS_FILTER'; payload: JobStatus | 'all' }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_LAST_JOBS_UPDATE'; payload: Date }
    | { type: 'SET_LAST_ROUTES_UPDATE'; payload: Date }
    | { type: 'SET_LAST_STATS_UPDATE'; payload: Date }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: DriverState = {
    profile: null,
    stats: null,
    jobs: [],
    todaysJobs: [],
    activeJob: null,
    jobsLoading: false,
    routes: [],
    activeRoute: null,
    routesLoading: false,
    scanRecords: [],
    recentScans: [],
    jobStatusFilter: 'all',
    searchQuery: '',
    isLoading: false,
    error: null,
    lastJobsUpdate: null,
    lastRoutesUpdate: null,
    lastStatsUpdate: null,
};

// Driver reducer
const driverReducer = (state: DriverState, action: DriverAction): DriverState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        case 'SET_PROFILE':
            return { ...state, profile: action.payload };

        case 'SET_STATS':
            return { ...state, stats: action.payload };

        case 'SET_JOBS':
            return { ...state, jobs: action.payload, jobsLoading: false };

        case 'SET_TODAYS_JOBS':
            return { ...state, todaysJobs: action.payload };

        case 'SET_ACTIVE_JOB':
            return { ...state, activeJob: action.payload };

        case 'SET_JOBS_LOADING':
            return { ...state, jobsLoading: action.payload };

        case 'UPDATE_JOB':
            const updatedJobs = state.jobs.map(job =>
                job.id === action.payload.id ? action.payload : job
            );
            const updatedTodaysJobs = state.todaysJobs.map(job =>
                job.id === action.payload.id ? action.payload : job
            );
            return {
                ...state,
                jobs: updatedJobs,
                todaysJobs: updatedTodaysJobs,
                activeJob: state.activeJob?.id === action.payload.id ? action.payload : state.activeJob,
            };

        case 'SET_ROUTES':
            return { ...state, routes: action.payload, routesLoading: false };

        case 'SET_ACTIVE_ROUTE':
            return { ...state, activeRoute: action.payload };

        case 'SET_ROUTES_LOADING':
            return { ...state, routesLoading: action.payload };

        case 'UPDATE_ROUTE':
            const updatedRoutes = state.routes.map(route =>
                route.id === action.payload.id ? action.payload : route
            );
            return {
                ...state,
                routes: updatedRoutes,
                activeRoute: state.activeRoute?.id === action.payload.id ? action.payload : state.activeRoute,
            };

        case 'SET_SCAN_RECORDS':
            return {
                ...state,
                scanRecords: action.payload,
                recentScans: action.payload.slice(0, 10), // Keep 10 most recent
            };

        case 'ADD_SCAN_RECORD':
            const newScanRecords = [action.payload, ...state.scanRecords];
            return {
                ...state,
                scanRecords: newScanRecords,
                recentScans: newScanRecords.slice(0, 10),
            };

        case 'SET_JOB_STATUS_FILTER':
            return { ...state, jobStatusFilter: action.payload };

        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };

        case 'SET_LAST_JOBS_UPDATE':
            return { ...state, lastJobsUpdate: action.payload };

        case 'SET_LAST_ROUTES_UPDATE':
            return { ...state, lastRoutesUpdate: action.payload };

        case 'SET_LAST_STATS_UPDATE':
            return { ...state, lastStatsUpdate: action.payload };

        case 'RESET_STATE':
            return { ...initialState };

        default:
            return state;
    }
};

// Context interface
interface DriverContextType {
    state: DriverState;
    dispatch: React.Dispatch<DriverAction>;

    // Data loading methods
    loadProfile: () => Promise<void>;
    loadStats: () => Promise<void>;
    loadJobs: () => Promise<void>;
    loadTodaysJobs: () => Promise<void>;
    loadRoutes: () => Promise<void>;
    loadActiveRoute: () => Promise<void>;
    refreshAll: () => Promise<void>;

    // Job management
    updateJobStatus: (jobId: string, status: JobStatus, notes?: string) => Promise<void>;
    addJobPhoto: (jobId: string, photoUri: string) => Promise<void>;
    deleteJobPhoto: (jobId: string, photoUri: string) => Promise<void>;
    addScanRecord: (jobId: string, code: string, type: 'qr' | 'barcode') => Promise<void>;
    setActiveJob: (job: Job | null) => void;

    // Route management
    updateRouteStatus: (routeId: string, status: Route['status']) => Promise<void>;

    // Filtering and search
    setJobStatusFilter: (filter: JobStatus | 'all') => void;
    setSearchQuery: (query: string) => void;
    getFilteredJobs: () => Job[];

    // Utility methods
    reset: () => void;
}

// Create context
const DriverContext = createContext<DriverContextType | undefined>(undefined);

// Driver provider component
export function DriverProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(driverReducer, initialState);
    const { state: appState } = useAppContext();

    // Auto-load data when user changes
    useEffect(() => {
        if (appState.currentUser?.role === 'driver' && appState.currentUser.id) {
            loadInitialData();
        }
    }, [appState.currentUser]);

    const loadInitialData = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await Promise.all([
                loadProfile(),
                loadTodaysJobs(),
                loadActiveRoute(),
            ]);
        } catch (error) {
            console.error('Failed to load initial driver data:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load driver data' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const loadProfile = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const profile = await dataService.driver.getProfile(appState.currentUser.id);
            dispatch({ type: 'SET_PROFILE', payload: profile });
        } catch (error) {
            console.error('Failed to load driver profile:', error);
            throw error;
        }
    };

    const loadStats = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const stats = await dataService.driver.getStats(appState.currentUser.id);
            dispatch({ type: 'SET_STATS', payload: stats });
            dispatch({ type: 'SET_LAST_STATS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load driver stats:', error);
            throw error;
        }
    };

    const loadJobs = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_JOBS_LOADING', payload: true });
            const jobs = await dataService.driver.getJobs(appState.currentUser.id);
            dispatch({ type: 'SET_JOBS', payload: jobs });
            dispatch({ type: 'SET_LAST_JOBS_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load jobs:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load jobs' });
        }
    };

    const loadTodaysJobs = async () => {
        try {
            const todaysJobs = await dataService.driver.getTodaysJobs();
            dispatch({ type: 'SET_TODAYS_JOBS', payload: todaysJobs });
        } catch (error) {
            console.error('Failed to load today\'s jobs:', error);
            throw error;
        }
    };

    const loadRoutes = async () => {
        try {
            if (!appState.currentUser?.id) return;

            dispatch({ type: 'SET_ROUTES_LOADING', payload: true });
            const routes = await dataService.driver.getRoutes(appState.currentUser.id);
            dispatch({ type: 'SET_ROUTES', payload: routes });
            dispatch({ type: 'SET_LAST_ROUTES_UPDATE', payload: new Date() });
        } catch (error) {
            console.error('Failed to load routes:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load routes' });
        }
    };

    const loadActiveRoute = async () => {
        try {
            if (!appState.currentUser?.id) return;

            const activeRoute = await dataService.driver.getActiveRoute(appState.currentUser.id);
            dispatch({ type: 'SET_ACTIVE_ROUTE', payload: activeRoute });
        } catch (error) {
            console.error('Failed to load active route:', error);
            throw error;
        }
    };

    const refreshAll = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await Promise.all([
                loadProfile(),
                loadStats(),
                loadJobs(),
                loadTodaysJobs(),
                loadRoutes(),
                loadActiveRoute(),
            ]);
        } catch (error) {
            console.error('Failed to refresh driver data:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh data' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const updateJobStatus = async (jobId: string, status: JobStatus, notes?: string) => {
        try {
            const updatedJob = await dataService.driver.updateJobStatus(jobId, status, notes);
            dispatch({ type: 'UPDATE_JOB', payload: updatedJob });

            // Update active job if it's the same job
            if (state.activeJob?.id === jobId) {
                dispatch({ type: 'SET_ACTIVE_JOB', payload: updatedJob });
            }
        } catch (error) {
            console.error('Failed to update job status:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update job status' });
            throw error;
        }
    };

    const addJobPhoto = async (jobId: string, photoUri: string) => {
        try {
            const updatedJob = await dataService.driver.addJobPhoto(jobId, photoUri);
            dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
        } catch (error) {
            console.error('Failed to add job photo:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to add photo' });
            throw error;
        }
    };

    const deleteJobPhoto = async (jobId: string, photoUri: string) => {
        try {
            const updatedJob = await dataService.driver.deleteJobPhoto(jobId, photoUri);
            dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
        } catch (error) {
            console.error('Failed to delete job photo:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to delete photo' });
            throw error;
        }
    };

    const addScanRecord = async (jobId: string, code: string, type: 'qr' | 'barcode') => {
        try {
            const updatedJob = await dataService.driver.addScanRecord(jobId, code, type);
            dispatch({ type: 'UPDATE_JOB', payload: updatedJob });

            // Create scan record
            const scanRecord: ScanRecord = {
                id: `scan-${Date.now()}`,
                jobId,
                code,
                type,
                scannedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            dispatch({ type: 'ADD_SCAN_RECORD', payload: scanRecord });
        } catch (error) {
            console.error('Failed to add scan record:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to record scan' });
            throw error;
        }
    };

    const updateRouteStatus = async (routeId: string, status: Route['status']) => {
        try {
            const updatedRoute = await dataService.routes.updateRouteStatus(routeId, status);
            dispatch({ type: 'UPDATE_ROUTE', payload: updatedRoute });
        } catch (error) {
            console.error('Failed to update route status:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update route status' });
            throw error;
        }
    };

    const setActiveJob = (job: Job | null) => {
        dispatch({ type: 'SET_ACTIVE_JOB', payload: job });
    };

    const setJobStatusFilter = (filter: JobStatus | 'all') => {
        dispatch({ type: 'SET_JOB_STATUS_FILTER', payload: filter });
    };

    const setSearchQuery = (query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    };

    const getFilteredJobs = (): Job[] => {
        let filteredJobs = state.jobs;

        // Apply status filter
        if (state.jobStatusFilter !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.status === state.jobStatusFilter);
        }

        // Apply search query
        if (state.searchQuery.trim()) {
            const query = state.searchQuery.toLowerCase();
            filteredJobs = filteredJobs.filter(job =>
                job.customerName.toLowerCase().includes(query) ||
                job.address.toLowerCase().includes(query) ||
                job.id.toLowerCase().includes(query)
            );
        }

        return filteredJobs;
    };

    const reset = () => {
        dispatch({ type: 'RESET_STATE' });
    };

    const contextValue: DriverContextType = {
        state,
        dispatch,
        loadProfile,
        loadStats,
        loadJobs,
        loadTodaysJobs,
        loadRoutes,
        loadActiveRoute,
        refreshAll,
        updateJobStatus,
        addJobPhoto,
        deleteJobPhoto,
        addScanRecord,
        setActiveJob,
        updateRouteStatus,
        setJobStatusFilter,
        setSearchQuery,
        getFilteredJobs,
        reset,
    };

    return (
        <DriverContext.Provider value={contextValue}>
            {children}
        </DriverContext.Provider>
    );
}

// Hook to use driver context
export function useDriverContext() {
    const context = useContext(DriverContext);
    if (context === undefined) {
        throw new Error('useDriverContext must be used within a DriverProvider');
    }
    return context;
}

// Convenience hooks
export function useDriverState() {
    const { state } = useDriverContext();
    return state;
}

export function useDriverActions() {
    const {
        loadProfile,
        loadStats,
        loadJobs,
        loadTodaysJobs,
        loadRoutes,
        loadActiveRoute,
        refreshAll,
        updateJobStatus,
        addJobPhoto,
        deleteJobPhoto,
        addScanRecord,
        setActiveJob,
        updateRouteStatus,
        setJobStatusFilter,
        setSearchQuery,
        getFilteredJobs,
        reset,
    } = useDriverContext();

    return {
        loadProfile,
        loadStats,
        loadJobs,
        loadTodaysJobs,
        loadRoutes,
        loadActiveRoute,
        refreshAll,
        updateJobStatus,
        addJobPhoto,
        deleteJobPhoto,
        addScanRecord,
        setActiveJob,
        updateRouteStatus,
        setJobStatusFilter,
        setSearchQuery,
        getFilteredJobs,
        reset,
    };
}