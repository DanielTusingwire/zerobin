import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { navigationService } from '../services/navigation/navigationService';
import { UserRole } from '../types/common';

interface NavigationContextType {
    currentRole: UserRole | null;
    setRole: (role: UserRole) => Promise<void>;
    switchRole: (role: UserRole) => Promise<void>;
    clearRole: () => Promise<void>;
    isLoading: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = '@ecotrack:user_role';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved role on app start
    useEffect(() => {
        loadSavedRole();
    }, []);

    const loadSavedRole = async () => {
        try {
            const savedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
            if (savedRole && (savedRole === 'driver' || savedRole === 'customer')) {
                const role = savedRole as UserRole;
                setCurrentRole(role);
                navigationService.setUserRole(role);

                // Role loaded successfully - user creation will be handled by AppContext
            }
        } catch (error) {
            console.error('Failed to load saved role:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setRole = async (role: UserRole) => {
        try {
            await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
            setCurrentRole(role);
            navigationService.setUserRole(role);

            // Role set successfully - user creation will be handled by AppContext
        } catch (error) {
            console.error('Failed to save role:', error);
            throw error;
        }
    };

    const switchRole = async (role: UserRole) => {
        await setRole(role);

        // Role switched successfully - user creation will be handled by AppContext
        navigationService.navigateToRoleHome(role);
    };

    const clearRole = async () => {
        try {
            await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
            setCurrentRole(null);
            navigationService.navigateToRoleSelection();
        } catch (error) {
            console.error('Failed to clear role:', error);
            throw error;
        }
    };

    const value: NavigationContextType = {
        currentRole,
        setRole,
        switchRole,
        clearRole,
        isLoading,
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
}

// Hook for role-based navigation
export function useRoleNavigation() {
    const { currentRole, switchRole, clearRole } = useNavigationContext();

    return {
        currentRole,
        isDriver: currentRole === 'driver',
        isCustomer: currentRole === 'customer',
        switchToDriver: () => switchRole('driver'),
        switchToCustomer: () => switchRole('customer'),
        logout: clearRole,
    };
}