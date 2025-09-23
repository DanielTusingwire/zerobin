import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker'; // Removed for now
import { router } from 'expo-router';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileSetupScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { updateProfile, user } = useAuth();

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return false;
        }

        if (name.trim().length < 2) {
            Alert.alert('Error', 'Name must be at least 2 characters long');
            return false;
        }

        return true;
    };

    const handleImagePicker = async () => {
        // Temporarily disabled - will implement later
        Alert.alert(
            'Coming Soon',
            'Profile photo upload will be available in a future update.',
            [{ text: 'OK' }]
        );
    };

    const handleContinue = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const profileUpdates = {
                name: name.trim(),
                phone: phone.trim() || undefined,
                profilePhoto: profilePhoto || undefined,
                isProfileComplete: true,
            };

            const result = await updateProfile(profileUpdates);

            if (result.success) {
                router.replace('/location-setup');
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkipLocation = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const profileUpdates = {
                name: name.trim(),
                phone: phone.trim() || undefined,
                profilePhoto: profilePhoto || undefined,
                isProfileComplete: true,
            };

            const result = await updateProfile(profileUpdates);

            if (result.success) {
                router.replace('/(tabs)');
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Progress Indicator */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '66%' }]} />
                            </View>
                            <Text style={styles.progressText}>Step 2 of 3</Text>
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.subtitle}>
                                Help us personalize your ZeroBin experience
                            </Text>
                        </View>

                        {/* Profile Photo */}
                        <View style={styles.photoSection}>
                            <TouchableOpacity style={styles.photoContainer} onPress={handleImagePicker}>
                                {profilePhoto ? (
                                    <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.photoPlaceholder}>
                                        <Ionicons name="camera" size={32} color="#6B7280" />
                                    </View>
                                )}
                                <View style={styles.photoEditIcon}>
                                    <Ionicons name="pencil" size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.photoLabel}>Add Profile Photo</Text>
                            <Text style={styles.photoHint}>Optional - You can add this later</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formSection}>
                            {/* Name Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Full Name *</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            {/* Phone Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="call" size={20} color="#6B7280" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="+256 700 000 000"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        autoCorrect={false}
                                    />
                                </View>
                                <Text style={styles.inputHint}>
                                    Optional - For pickup notifications and support
                                </Text>
                            </View>
                        </View>

                        {/* User Type Info */}
                        <View style={styles.userTypeSection}>
                            <View style={styles.userTypeCard}>
                                <View style={styles.userTypeIcon}>
                                    <Ionicons name="business" size={24} color="#22C55E" />
                                </View>
                                <View style={styles.userTypeContent}>
                                    <Text style={styles.userTypeTitle}>Customer Account</Text>
                                    <Text style={styles.userTypeDescription}>
                                        Request pickups, track collections, and manage your waste efficiently
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonSection}>
                            <TouchableOpacity
                                style={[styles.continueButton, isLoading && styles.disabledButton]}
                                onPress={handleContinue}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Text style={styles.continueText}>Saving...</Text>
                                ) : (
                                    <>
                                        <Text style={styles.continueText}>Continue to Location</Text>
                                        <Ionicons name="arrow-forward" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.skipButton}
                                onPress={handleSkipLocation}
                                disabled={isLoading}
                            >
                                <Text style={styles.skipText}>Skip Location Setup</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Benefits */}
                        <View style={styles.benefitsSection}>
                            <Text style={styles.benefitsTitle}>Why complete your profile?</Text>

                            <View style={styles.benefit}>
                                <Ionicons name="notifications" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Get personalized pickup reminders
                                </Text>
                            </View>

                            <View style={styles.benefit}>
                                <Ionicons name="headset" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Faster customer support
                                </Text>
                            </View>

                            <View style={styles.benefit}>
                                <Ionicons name="analytics" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Track your environmental impact
                                </Text>
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
        paddingTop: 20,
        paddingBottom: 40,
    },
    progressSection: {
        marginBottom: 30,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#22C55E',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    titleSection: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    photoEditIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    photoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    photoHint: {
        fontSize: 12,
        color: '#6B7280',
    },
    formSection: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    inputHint: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    userTypeSection: {
        marginBottom: 30,
    },
    userTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBF7D0',
        gap: 12,
    },
    userTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userTypeContent: {
        flex: 1,
    },
    userTypeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#166534',
        marginBottom: 4,
    },
    userTypeDescription: {
        fontSize: 14,
        color: '#166534',
        lineHeight: 20,
    },
    buttonSection: {
        marginBottom: 30,
        gap: 12,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22C55E',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    continueText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    benefitsSection: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 12,
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    benefit: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    benefitText: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
});