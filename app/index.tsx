import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// App entry point - immediately navigate to splash screen
export default function AppIndex() {
    useEffect(() => {
        // Navigate to splash immediately on app start
        console.log('Index: Navigating to splash immediately');
        const timer = setTimeout(() => {
            router.replace('/splash');
        }, 100); // Small delay to ensure router is ready

        return () => clearTimeout(timer);
    }, []);

    // Show loading screen briefly
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