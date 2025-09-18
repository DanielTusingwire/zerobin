import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationContext } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const { currentRole, isLoading } = useNavigationContext();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Show splash for at least 2 seconds
        const timer = setTimeout(() => {
            if (!isLoading) {
                if (currentRole) {
                    // User has a saved role, navigate to their home screen
                    if (currentRole === 'driver') {
                        router.replace('/(tabs)/driver/jobs');
                    } else {
                        router.replace('/(tabs)/customer/home');
                    }
                } else {
                    // No saved role, show role selection
                    router.replace('/role-selection');
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentRole, isLoading]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>
                    Zero<Text style={styles.logoAccent}>Bin</Text>
                    <Text style={styles.logoDot}>.</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEFF93', // Bright lime green from the image
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: '800',
        color: '#1A1A1A', // Dark text
        letterSpacing: -1,
    },
    logoAccent: {
        color: '#4CAF50', // Green accent for "Bin"
    },
    logoDot: {
        color: '#4CAF50', // Green dot
    },
});