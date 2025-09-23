import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
    useEffect(() => {
        // Hide the default Expo splash screen immediately
        ExpoSplashScreen.hideAsync();

        // Show our custom splash for 3 seconds then navigate to welcome
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor={theme.colors.primary} />
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo/zerobin.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Lime green background
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 100,
    },
});