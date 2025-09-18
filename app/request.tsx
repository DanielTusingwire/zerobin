import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { WasteType } from '../types/common';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RequestSuccess } from '../components/customer';
import { InteractiveBottomSheetRef, LoadingSpinner } from '../components/shared';
import { theme } from '../constants/theme';
import { useAppContext, useCustomerContext } from '../contexts';
import { PickupRequest } from '../types/customer';

// Step types
type RequestStep = 'location' | 'wasteType' | 'dateTime';

interface RequestData {
    location?: string;
    wasteTypes?: string[];
    date?: Date;
    time?: string;
}

// Step Components
interface AdaptiveStyles {
    padding: number;
    fontSize: number;
    spacing: number;
}

const LocationStep: React.FC<{
    onSelect: (location: string) => void;
    adaptiveStyles: AdaptiveStyles;
}> = ({ onSelect, adaptiveStyles }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const allLocations = [
        { name: 'Associação de Catadores (ASCAS)', address: 'Av. Santos Dumont, 764' },
        { name: 'Coleta Municipal', address: 'Rua Batista de Castro, 37' },
        { name: 'Centro de Reciclagem Verde', address: 'Rua das Flores, 123' },
        { name: 'EcoPonto Vila Madalena', address: 'Av. Paulista, 1000' },
        { name: 'Cooperativa Recicla SP', address: 'Rua Augusta, 456' },
        { name: 'Ponto de Coleta Seletiva', address: 'Av. Faria Lima, 789' },
    ];

    const filteredLocations = allLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
            <View style={styles.stepHeaderContainer}>
                <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View>
                        <Text style={[styles.stepTitle, { fontSize: 20 * adaptiveStyles.fontSize }]}>
                            Pickup Location
                        </Text>
                        <Text style={[styles.stepSubtitle, { fontSize: 14 * adaptiveStyles.fontSize }]}>
                            Select where the waste will be collected
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search location"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Ionicons name="mic" size={20} color={theme.colors.textSecondary} />
            </View>

            <View style={styles.locationList}>
                {filteredLocations.map((location, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.locationItem}
                        onPress={() => onSelect(location.address)}
                    >
                        <View style={styles.locationIcon}>
                            <Ionicons name="location" size={20} color={theme.colors.secondary} />
                        </View>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationName}>{location.name}</Text>
                            <Text style={styles.locationAddress}>{location.address}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const WasteTypeStep: React.FC<{
    onSelect: (types: string[]) => void;
    adaptiveStyles: AdaptiveStyles;
}> = ({ onSelect, adaptiveStyles }) => {
    const wasteTypes = [
        { name: 'Organic Waste', description: 'food leftovers, garden waste', color: '#E8F5E8' },
        { name: 'Plastic Waste', description: 'Bottles, bags, container', color: '#E3F2FD' },
        { name: 'Paper & Cardboard', description: 'office paper, packaging', color: '#FFF3E0' },
        { name: 'Glass Waste', description: 'Bottles, jars', color: '#F3E5F5' },
        { name: 'E-Waste', description: 'Electronics, batteries, cables', color: '#FFEBEE' },
        { name: 'Mixed Waste', description: 'General trash not separated', color: '#F5F5F5' },
    ];

    const handleTypeSelect = (typeName: string) => {
        // Single selection - automatically proceed to next step
        onSelect([typeName]);
    };

    return (
        <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
            <View style={styles.stepHeaderContainer}>
                <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View>
                        <Text style={[styles.stepTitle, { fontSize: 20 * adaptiveStyles.fontSize }]}>
                            Waste Type
                        </Text>
                        <Text style={[styles.stepSubtitle, { fontSize: 14 * adaptiveStyles.fontSize }]}>
                            Choose your waste category
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.wasteTypeGrid, { gap: 15 * adaptiveStyles.spacing }]}>
                {wasteTypes.map((type, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.wasteTypeCard,
                            {
                                backgroundColor: type.color,
                                padding: 20 * adaptiveStyles.spacing,
                                marginBottom: 15 * adaptiveStyles.spacing
                            }
                        ]}
                        onPress={() => handleTypeSelect(type.name)}
                    >
                        <View style={[styles.wasteTypeIconContainer, { marginBottom: 15 * adaptiveStyles.spacing }]}>
                            <View style={styles.wasteIconBackground}>
                                <Image
                                    source={require('../assets/waste/waste.png')}
                                    style={styles.wasteIcon}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <Text style={[styles.wasteTypeCardName, { fontSize: 16 * adaptiveStyles.fontSize }]}>
                            {type.name}
                        </Text>
                        <Text style={[styles.wasteTypeCardDescription, { fontSize: 12 * adaptiveStyles.fontSize }]}>
                            {type.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const QuantityStep: React.FC<{
    onSelect: (quantity: string) => void;
    adaptiveStyles: AdaptiveStyles;
}> = ({ onSelect, adaptiveStyles }) => {
    const quantities = [
        { name: 'Small Bin', description: '(up to 30kg)', color: '#F0F8E8' },
        { name: 'Medium Bin', description: '(30-100kg)', color: '#E8F5E8' },
        { name: 'Large Skip', description: '(>100kg)', color: '#FFE8E8' },
    ];

    return (
        <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
            <View style={styles.stepHeaderContainer}>
                <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View>
                        <Text style={[styles.stepTitle, { fontSize: 20 * adaptiveStyles.fontSize }]}>
                            How Much Waste?
                        </Text>
                        <Text style={[styles.stepSubtitle, { fontSize: 14 * adaptiveStyles.fontSize }]}>
                            Estimate based on bin size or weight.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.quantityGrid, { gap: 15 * adaptiveStyles.spacing }]}>
                {quantities.map((quantity, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.quantityCard,
                            {
                                backgroundColor: quantity.color,
                                padding: 20 * adaptiveStyles.spacing,
                                marginBottom: 15 * adaptiveStyles.spacing
                            }
                        ]}
                        onPress={() => onSelect(quantity.description)}
                    >
                        <View style={[styles.binIcon, { marginBottom: 15 * adaptiveStyles.spacing }]}>
                            <Image
                                source={require('../assets/waste/bin.png')}
                                style={styles.binImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={[styles.quantityName, { fontSize: 16 * adaptiveStyles.fontSize }]}>
                            {quantity.name}
                        </Text>
                        <Text style={[styles.quantityDescription, { fontSize: 14 * adaptiveStyles.fontSize }]}>
                            {quantity.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const DateTimeStep: React.FC<{
    onSelect: (date: Date, time: string) => void;
    loading: boolean;
    adaptiveStyles: AdaptiveStyles;
}> = ({ onSelect, loading, adaptiveStyles }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Mock available dates with slots
    const availableDates = [8, 12, 15, 18, 22, 25, 28]; // Days with available slots

    // Mock time slots for selected date
    const timeSlots = {
        morning: [
            { id: 'm1', time: '9:00', available: true },
            { id: 'm2', time: '10:00', available: false },
            { id: 'm3', time: '11:00', available: true },
        ],
        afternoon: [
            { id: 'a1', time: '12:00', available: true },
            { id: 'a2', time: '1:00', available: false },
            { id: 'a3', time: '2:00', available: true },
            { id: 'a4', time: '3:00', available: true },
        ],
        evening: [
            { id: 'e1', time: '4:00', available: true },
            { id: 'e2', time: '5:00', available: false },
            { id: 'e3', time: '6:00', available: false },
        ]
    };

    const handleDateSelect = (day: number) => {
        if (!availableDates.includes(day)) return;

        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        setSelectedSlot(null); // Reset slot selection
    };

    const handleSlotSelect = (slot: any) => {
        if (!slot.available || !selectedDate) return;

        setSelectedSlot(slot.id);
        onSelect(selectedDate, slot.time);
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const hasSlots = availableDates.includes(day);
            const isSelected = selectedDate?.getDate() === day;

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.calendarDay,
                        isSelected && styles.calendarDaySelected,
                        !hasSlots && styles.calendarDayDisabled
                    ]}
                    onPress={() => handleDateSelect(day)}
                    disabled={!hasSlots}
                >
                    <Text style={[
                        styles.calendarDayText,
                        isSelected && styles.calendarDayTextSelected,
                        !hasSlots && styles.calendarDayTextDisabled
                    ]}>
                        {day}
                    </Text>
                    {hasSlots && (
                        <View style={[
                            styles.availabilityDot,
                            isSelected && styles.availabilityDotSelected
                        ]} />
                    )}
                </TouchableOpacity>
            );
        }

        return days;
    };

    const renderTimeSlots = (period: string, slots: any[]) => (
        <View key={period} style={styles.timePeriod}>
            <Text style={styles.timePeriodTitle}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
            <View style={styles.timeSlotsRow}>
                {slots.map((slot) => (
                    <TouchableOpacity
                        key={slot.id}
                        style={[
                            styles.timeSlot,
                            !slot.available && styles.timeSlotDisabled,
                            selectedSlot === slot.id && styles.timeSlotSelected
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                        disabled={!slot.available}
                    >
                        <Text style={[
                            styles.timeSlotText,
                            !slot.available && styles.timeSlotTextDisabled,
                            selectedSlot === slot.id && styles.timeSlotTextSelected
                        ]}>
                            {slot.time}
                        </Text>
                        {slot.available && (
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color={selectedSlot === slot.id ? 'white' : '#4CAF50'}
                            />
                        )}
                        {!slot.available && (
                            <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
            <View style={styles.stepHeaderContainer}>
                <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View>
                        <Text style={[styles.stepTitle, { fontSize: 20 * adaptiveStyles.fontSize }]}>
                            Pickup Date & Time
                        </Text>
                        <Text style={[styles.stepSubtitle, { fontSize: 14 * adaptiveStyles.fontSize }]}>
                            Select date and available time slot
                        </Text>
                    </View>
                </View>
            </View>

            {/* Calendar */}
            <View style={styles.calendarContainer}>
                <Text style={styles.monthHeader}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>

                <View style={styles.calendarHeader}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <Text key={index} style={styles.calendarHeaderDay}>{day}</Text>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {renderCalendar()}
                </View>
            </View>

            {/* Time Slots */}
            {selectedDate && (
                <View style={styles.timeSlotsContainer}>
                    <Text style={styles.availableSlotsTitle}>Available Slots</Text>
                    {Object.entries(timeSlots).map(([period, slots]) =>
                        renderTimeSlots(period, slots)
                    )}
                </View>
            )}

            {/* Submit Button */}
            {selectedSlot && (
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={() => {/* Already handled in slot selection */ }}
                    disabled={loading}
                >
                    {loading ? (
                        <LoadingSpinner size="small" />
                    ) : (
                        <Text style={styles.submitButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

// Customer Request Screen - map-based pickup request flow
export default function CustomerRequestScreen() {
    const { state: appState } = useAppContext();
    const { createPickupRequest } = useCustomerContext();
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<InteractiveBottomSheetRef>(null);
    const { width, height } = Dimensions.get('window');

    const [currentStep, setCurrentStep] = useState<RequestStep>('location');
    const [requestData, setRequestData] = useState<RequestData>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<{
        requestId: string;
        estimatedCost: number;
    } | null>(null);

    const handleLocationSelect = useCallback((location: string) => {
        setRequestData(prev => ({ ...prev, location }));
        setCurrentStep('wasteType');
        // Animate to standard height for waste type selection
        bottomSheetRef.current?.animateToSnapPoint(1, 'smooth');
    }, []);

    const handleWasteTypeSelect = useCallback((wasteTypes: string[]) => {
        setRequestData(prev => ({ ...prev, wasteTypes }));
        setCurrentStep('dateTime');
        // Animate to expanded height for date/time selection
        bottomSheetRef.current?.animateToSnapPoint(2, 'smooth');
    }, []);



    // Create mock user if not exists
    const currentUser = appState.currentUser || {
        id: 'mock-customer-1',
        name: 'Daniel Silva',
        email: 'daniel@example.com',
        role: 'customer' as const,
        address: 'Rua Batista de Castro, 37',
        phone: '+55 11 99999-9999'
    };

    const handleDateTimeSelect = useCallback(async (date: Date, time: string) => {
        const finalData = { ...requestData, date, time };
        setRequestData(finalData);

        // Submit the request
        if (!currentUser?.id) {
            Alert.alert('Error', 'Please log in to submit a request.');
            return;
        }

        try {
            setIsSubmitting(true);

            // Map waste type strings to enum values
            const mapWasteTypes = (types: string[]): WasteType[] => {
                return types.map(type => {
                    switch (type) {
                        case 'Organic Waste': return WasteType.ORGANIC;
                        case 'Plastic Waste':
                        case 'Paper & Cardboard':
                        case 'Glass Waste': return WasteType.RECYCLABLE;
                        case 'E-Waste': return WasteType.HAZARDOUS;
                        default: return WasteType.GENERAL;
                    }
                });
            };

            const completeRequest: Partial<PickupRequest> = {
                customerId: currentUser.id,
                address: finalData.location || 'Address not set',
                wasteType: mapWasteTypes(finalData.wasteTypes || []),
                quantity: 0, // Quantity will be determined at pickup time
                scheduledDate: finalData.date,
                notes: `Scheduled for ${time}`,
            };

            await createPickupRequest(completeRequest as Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>);

            const requestId = `REQ-${Date.now().toString().slice(-6)}`;
            const estimatedCost = Math.random() * 50 + 25;

            setSuccessData({ requestId, estimatedCost });
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to submit pickup request:', error);
            Alert.alert('Submission Failed', 'Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [requestData, currentUser, createPickupRequest]);

    const handleViewSchedule = useCallback(() => {
        setShowSuccess(false);
        router.push('/(tabs)/customer/schedule');
    }, []);

    const handleCloseSuccess = useCallback(() => {
        setShowSuccess(false);
    }, []);

    const handleHeightChange = useCallback((height: number) => {
        // Optional: Add any height-based logic here
        console.log(`Bottom sheet height changed to: ${height}px`);
    }, []);

    const handleContentModeChange = useCallback((mode: 'compact' | 'standard' | 'expanded') => {
        // Optional: Adjust UI based on content mode
        console.log(`Content mode changed to: ${mode}`);
    }, []);

    const handleBackPress = useCallback(() => {
        if (currentStep === 'location') {
            router.back();
        } else {
            // Navigate to previous step and adjust bottom sheet height
            const stepOrder: RequestStep[] = ['location', 'wasteType', 'dateTime'];
            const currentIndex = stepOrder.indexOf(currentStep);
            if (currentIndex > 0) {
                const previousStep = stepOrder[currentIndex - 1];
                setCurrentStep(previousStep);

                // Animate to appropriate height for previous step
                switch (previousStep) {
                    case 'location':
                        bottomSheetRef.current?.animateToSnapPoint(1, 'smooth'); // Standard
                        break;
                    case 'wasteType':
                        bottomSheetRef.current?.animateToSnapPoint(1, 'smooth'); // Standard
                        break;
                }
            }
        }
    }, [currentStep]);

    const renderStepContent = useCallback((context?: any) => {
        const adaptiveStyles = context ? {
            padding: context.adaptiveStyles.padding,
            fontSize: context.adaptiveStyles.fontSize,
            spacing: context.adaptiveStyles.spacing,
        } : {
            padding: 20,
            fontSize: 1,
            spacing: 1,
        };

        switch (currentStep) {
            case 'location':
                return <LocationStep onSelect={handleLocationSelect} adaptiveStyles={adaptiveStyles} />;
            case 'wasteType':
                return <WasteTypeStep onSelect={handleWasteTypeSelect} adaptiveStyles={adaptiveStyles} />;
            case 'dateTime':
                return <DateTimeStep onSelect={handleDateTimeSelect} loading={isSubmitting} adaptiveStyles={adaptiveStyles} />;
            default:
                return null;
        }
    }, [currentStep, handleLocationSelect, handleWasteTypeSelect, handleDateTimeSelect, isSubmitting]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.profileButton}>
                    <View style={styles.profileImage}>
                        <Text style={styles.profileInitial}>
                            {currentUser.name?.charAt(0) || 'U'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Map View - Mock Implementation */}
            <View style={styles.map}>
                <View style={styles.mapBackground}>
                    <Text style={styles.mapText}>Map View</Text>
                    <Text style={styles.mapSubtext}>São Paulo, Brazil</Text>

                    {/* Mock markers */}
                    <View style={[styles.marker, styles.marker1]}>
                        <View style={[styles.markerPin, { backgroundColor: theme.colors.secondary }]} />
                    </View>
                    <View style={[styles.marker, styles.marker2]}>
                        <View style={[styles.markerPin, { backgroundColor: theme.colors.primary }]} />
                    </View>
                    <View style={[styles.marker, styles.marker3]}>
                        <View style={[styles.markerPin, { backgroundColor: theme.colors.secondary }]} />
                    </View>
                </View>
            </View>

            {/* Simple Working Bottom Sheet */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: height * 0.6,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 10,
            }}>
                {/* Handle */}
                <View style={{
                    alignItems: 'center',
                    paddingVertical: 12,
                }}>
                    <View style={{
                        width: 40,
                        height: 4,
                        backgroundColor: '#E0E0E0',
                        borderRadius: 2,
                    }} />
                </View>

                {/* Content */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                    {renderStepContent()}
                </ScrollView>
            </View>

            {successData && (
                <RequestSuccess
                    visible={showSuccess}
                    requestId={successData.requestId}
                    estimatedCost={successData.estimatedCost}
                    onViewSchedule={handleViewSchedule}
                    onClose={handleCloseSuccess}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
    mapBackground: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mapText: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    mapSubtext: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
    },
    marker1: {
        top: '30%',
        left: '25%',
    },
    marker2: {
        top: '45%',
        right: '20%',
    },
    marker3: {
        bottom: '25%',
        left: '40%',
    },
    markerPin: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    bottomSheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    scrollContainer: {
        flex: 1,
    },
    stepContainer: {
        // Reduced horizontal padding since ScrollView now has less padding
        paddingHorizontal: 4,
        paddingVertical: 10,
    },
    stepHeaderContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginHorizontal: -20,
        marginTop: -10,
        marginBottom: 20,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    stepNumberText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 16,
        marginBottom: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        paddingVertical: 0,
    },
    locationList: {
        gap: 15,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    locationIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: theme.colors.secondary + '15',
        borderRadius: 12,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.secondary,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 2,
    },
    locationAddress: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        opacity: 0.7,
        marginTop: 2,
    },
    wasteTypeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        justifyContent: 'space-between',
    },
    wasteTypeCard: {
        width: (Dimensions.get('window').width - 60) / 2,
        aspectRatio: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    wasteTypeIconContainer: {
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wasteIconBackground: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D3FFD5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wasteIcon: {
        width: 28,
        height: 28,
    },
    wasteTypeCardName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    wasteTypeCardDescription: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    quantityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        justifyContent: 'space-between',
    },
    quantityCard: {
        width: (Dimensions.get('window').width - 60) / 2,
        aspectRatio: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    binIcon: {
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    binImage: {
        width: 60,
        height: 60,
    },
    quantityName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    quantityDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    calendarContainer: {
        marginBottom: 24,
    },
    monthHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    calendarHeaderDay: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.textSecondary,
        textAlign: 'center',
        width: 40,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    emptyDay: {
        width: 40,
        height: 40,
    },
    calendarDay: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
    },
    calendarDaySelected: {
        backgroundColor: theme.colors.primary,
    },
    calendarDayDisabled: {
        opacity: 0.3,
    },
    calendarDayText: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    calendarDayTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
    calendarDayTextDisabled: {
        color: theme.colors.textSecondary,
    },
    availabilityDot: {
        position: 'absolute',
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#4CAF50',
    },
    availabilityDotSelected: {
        backgroundColor: 'white',
    },
    timeSlotsContainer: {
        marginBottom: 24,
    },
    availableSlotsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 16,
    },
    timePeriod: {
        marginBottom: 20,
    },
    timePeriodTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textSecondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeSlotsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    timeSlot: {
        backgroundColor: '#E8F5E8',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        minWidth: 80,
        justifyContent: 'center',
    },
    timeSlotDisabled: {
        backgroundColor: '#F5F5F5',
        opacity: 0.6,
    },
    timeSlotSelected: {
        backgroundColor: theme.colors.primary,
    },
    timeSlotText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
    },
    timeSlotTextDisabled: {
        color: theme.colors.textSecondary,
    },
    timeSlotTextSelected: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    nextButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    nextButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
});