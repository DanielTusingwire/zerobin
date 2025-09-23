import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// App entry point - handles initial navigation based on authentication status
export default function AppIndex() {
    const { isAuthenticated, isLoading, user } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && user) {
                // Check if profile is complete
                if (user.profile.isProfileComplete) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/profile-setup');
                }
            } else {
                // Not authenticated, start onboarding
                router.replace('/splash');
            }
        }
    }, [isAuthenticated, isLoading, user]);

    // Show loading screen while checking authentication
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#22C55E" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});