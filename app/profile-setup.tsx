import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSetupScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    const { updateProfile } = useAuth();

    const handleNameChange = (text: string) => {
        setName(text);
        if (text && text.trim().length < 2) {
            setNameError('Name must be at least 2 characters');
        } else {
            setNameError('');
        }
    };

    const handleComplete = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (nameError) {
            Alert.alert('Error', 'Please fix the errors before continuing');
            return;
        }

        setIsLoading(true);
        try {
            const profileUpdates = {
                name: name.trim(),
                phone: phone.trim() || undefined,
                isProfileComplete: true,
            };

            const result = await updateProfile(profileUpdates);

            if (result.success) {
                Alert.alert(
                    'Profile Complete!',
                    'Now choose your role to get started with ZeroBin.',
                    [{ text: 'Continue', onPress: () => router.replace('/role-selection') }]
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Logo */}
                        <View style={styles.logoSection}>
                            <Image
                                source={require('../assets/logo/zerobin.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.subtitle}>
                                Just a few details to get you started with waste management services
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formSection}>
                            {/* Name Input */}
                            <FloatingLabelInput
                                label="Full name"
                                value={name}
                                onChangeText={handleNameChange}
                                autoCapitalize="words"
                                autoCorrect={false}
                                error={nameError}
                                hint={!nameError ? "This will be used for your account" : undefined}
                            />

                            {/* Phone Input */}
                            <FloatingLabelInput
                                label="Phone number (optional)"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                autoCorrect={false}
                                hint="For pickup notifications and support"
                            />
                        </View>

                        {/* Complete Button */}
                        <TouchableOpacity
                            style={[styles.completeButton, isLoading && styles.disabledButton]}
                            onPress={handleComplete}
                            disabled={isLoading}
                        >
                            <Text style={styles.completeButtonText}>
                                {isLoading ? 'Setting up...' : 'Complete Setup'}
                            </Text>
                        </TouchableOpacity>

                        {/* Info Section */}
                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>You're all set to:</Text>

                            <View style={styles.infoList}>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoBullet}>•</Text>
                                    <Text style={styles.infoText}>Schedule waste pickups</Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text style={styles.infoBullet}>•</Text>
                                    <Text style={styles.infoText}>Track collection progress</Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text style={styles.infoBullet}>•</Text>
                                    <Text style={styles.infoText}>Monitor environmental impact</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 60,
    },
    titleSection: {
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    formSection: {
        marginBottom: 40,
    },
    completeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    completeButtonText: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoSection: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    infoList: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    infoBullet: {
        fontSize: 16,
        color: theme.colors.secondary,
        fontWeight: 'bold',
        marginTop: 1,
    },
    infoText: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
        lineHeight: 18,
    },
});