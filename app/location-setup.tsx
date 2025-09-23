import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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

export default function LocationSetupScreen() {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [useManualEntry, setUseManualEntry] = useState(false);

    const { updateProfile } = useAuth();

    const districts = [
        'Kampala', 'Wakiso', 'Mukono', 'Entebbe', 'Jinja', 'Mbale', 'Gulu',
        'Mbarara', 'Fort Portal', 'Kasese', 'Soroti', 'Lira', 'Arua', 'Masaka'
    ];

    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'Please grant location permissions to automatically detect your address.',
                    [
                        { text: 'Use Manual Entry', onPress: () => setUseManualEntry(true) },
                        { text: 'Try Again', onPress: getCurrentLocation }
                    ]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            // Reverse geocoding to get address
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const location = reverseGeocode[0];
                setAddress(`${location.street || ''} ${location.streetNumber || ''}`.trim());
                setCity(location.city || location.subregion || '');
                setDistrict(location.region || '');
            }

            Alert.alert('Success', 'Location detected successfully!');
        } catch (error) {
            Alert.alert(
                'Location Error',
                'Unable to get your current location. Please enter your address manually.',
                [{ text: 'OK', onPress: () => setUseManualEntry(true) }]
            );
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const validateForm = () => {
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter your address');
            return false;
        }

        if (!city.trim()) {
            Alert.alert('Error', 'Please enter your city');
            return false;
        }

        return true;
    };

    const handleComplete = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const locationData = {
                address: `${address.trim()}, ${city.trim()}${district ? `, ${district}` : ''}`,
                coordinates: currentLocation,
            };

            const result = await updateProfile({ location: locationData });

            if (result.success) {
                Alert.alert(
                    'Profile Complete!',
                    'Your profile has been set up successfully. Welcome to ZeroBin!',
                    [{ text: 'Get Started', onPress: () => router.replace('/(tabs)') }]
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to save location');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip Location Setup?',
            'You can add your location later in the profile settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Skip', onPress: () => router.replace('/(tabs)') }
            ]
        );
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
                                <View style={[styles.progressFill, { width: '100%' }]} />
                            </View>
                            <Text style={styles.progressText}>Step 3 of 3</Text>
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Add Your Location</Text>
                            <Text style={styles.subtitle}>
                                Help us provide better service by knowing your location
                            </Text>
                        </View>

                        {/* Location Detection */}
                        {!useManualEntry && (
                            <View style={styles.locationSection}>
                                <TouchableOpacity
                                    style={[styles.detectButton, isLoadingLocation && styles.disabledButton]}
                                    onPress={getCurrentLocation}
                                    disabled={isLoadingLocation}
                                >
                                    <Ionicons
                                        name={isLoadingLocation ? "hourglass" : "location"}
                                        size={20}
                                        color="white"
                                    />
                                    <Text style={styles.detectText}>
                                        {isLoadingLocation ? 'Detecting Location...' : 'Use Current Location'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.manualButton}
                                    onPress={() => setUseManualEntry(true)}
                                >
                                    <Text style={styles.manualText}>Enter Address Manually</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Manual Entry Form */}
                        {(useManualEntry || currentLocation) && (
                            <View style={styles.formSection}>
                                <Text style={styles.formTitle}>
                                    {useManualEntry ? 'Enter Your Address' : 'Confirm Your Address'}
                                </Text>

                                {/* Address Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Street Address *</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="home" size={20} color="#6B7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="e.g., Plot 123, Main Street"
                                            value={address}
                                            onChangeText={setAddress}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

                                {/* City Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>City/Town *</Text>
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="business" size={20} color="#6B7280" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="e.g., Kampala"
                                            value={city}
                                            onChangeText={setCity}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

                                {/* District Picker */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>District (Optional)</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.districtScroll}
                                    >
                                        {districts.map((districtName) => (
                                            <TouchableOpacity
                                                key={districtName}
                                                style={[
                                                    styles.districtChip,
                                                    district === districtName && styles.selectedDistrict
                                                ]}
                                                onPress={() => setDistrict(district === districtName ? '' : districtName)}
                                            >
                                                <Text style={[
                                                    styles.districtText,
                                                    district === districtName && styles.selectedDistrictText
                                                ]}>
                                                    {districtName}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Location Status */}
                                {currentLocation && (
                                    <View style={styles.locationStatus}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                                        <Text style={styles.locationStatusText}>
                                            GPS coordinates saved
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Benefits */}
                        <View style={styles.benefitsSection}>
                            <Text style={styles.benefitsTitle}>Why add your location?</Text>

                            <View style={styles.benefit}>
                                <Ionicons name="time" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Faster pickup scheduling
                                </Text>
                            </View>

                            <View style={styles.benefit}>
                                <Ionicons name="car" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Optimized collection routes
                                </Text>
                            </View>

                            <View style={styles.benefit}>
                                <Ionicons name="notifications" size={16} color="#22C55E" />
                                <Text style={styles.benefitText}>
                                    Accurate arrival notifications
                                </Text>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonSection}>
                            <TouchableOpacity
                                style={[styles.completeButton, isLoading && styles.disabledButton]}
                                onPress={handleComplete}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Text style={styles.completeText}>Completing Setup...</Text>
                                ) : (
                                    <>
                                        <Text style={styles.completeText}>Complete Setup</Text>
                                        <Ionicons name="checkmark" size={20} color="white" />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.skipButton}
                                onPress={handleSkip}
                                disabled={isLoading}
                            >
                                <Text style={styles.skipText}>Skip for Now</Text>
                            </TouchableOpacity>
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
    locationSection: {
        marginBottom: 30,
        gap: 12,
    },
    detectButton: {
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
    detectText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    manualButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    manualText: {
        color: '#22C55E',
        fontSize: 14,
        fontWeight: '500',
    },
    formSection: {
        marginBottom: 30,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
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
    districtScroll: {
        marginTop: 8,
    },
    districtChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedDistrict: {
        backgroundColor: '#22C55E',
        borderColor: '#22C55E',
    },
    districtText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    selectedDistrictText: {
        color: 'white',
    },
    locationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    locationStatusText: {
        fontSize: 14,
        color: '#166534',
        fontWeight: '500',
    },
    benefitsSection: {
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 12,
        marginBottom: 30,
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
    buttonSection: {
        gap: 12,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22C55E',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    completeText: {
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
});