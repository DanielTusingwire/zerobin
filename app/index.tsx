import { router } from 'expo-router';
import { useEffect } from 'react';
import { useNavigationContext } from '../contexts/NavigationContext';

// App entry point - handles initial navigation based on saved role
export default function AppIndex() {
    const { currentRole, isLoading } = useNavigationContext();

    useEffect(() => {
        if (!isLoading) {
            if (currentRole) {
                // User has a saved role, navigate to their home screen
                if (currentRole === 'customer') {
                    router.replace('/(tabs)/customer/home');
                } else {
                    router.replace('/(tabs)/driver/jobs');
                }
            } else {
                // No saved role, show role selection
                router.replace('/role-selection');
            }
        }
    }, [currentRole, isLoading]);

    return null;
}