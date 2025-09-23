import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<User['profile']>) => Promise<{ success: boolean; error?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            await refreshUser();
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await authService.signIn(email, password);
            if (result.success && result.user) {
                setUser(result.user);
            }
            return { success: result.success, error: result.error };
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, confirmPassword: string) => {
        setIsLoading(true);
        try {
            const result = await authService.signUp(email, password, confirmPassword);
            if (result.success && result.user) {
                setUser(result.user);
            }
            return { success: result.success, error: result.error };
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await authService.signOut();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<User['profile']>) => {
        try {
            const result = await authService.updateProfile(updates);
            if (result.success && result.user) {
                setUser(result.user);
            }
            return { success: result.success, error: result.error };
        } catch (error) {
            return { success: false, error: 'Failed to update profile' };
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};