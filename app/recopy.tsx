import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MapView, { Marker } from 'react-native-maps';
import DateTimeStep from '../components/customer/request-steps/DateTimeStep';
import LocationStep from '../components/customer/request-steps/LocationStep';
import WasteTypeStep from '../components/customer/request-steps/WasteTypeStep';
import { RequestSuccess } from '../components/customer/RequestSuccess';
import { theme } from '../constants/theme';
import { useAppContext, useCustomerContext } from '../contexts';
import { RequestStatus, WasteType } from '../types/common';
import { PickupRequest } from '../types/customer';

type RequestStep = 'location' | 'wasteType' | 'dateTime';

interface RequestData {
  location?: string;
  coordinates?: { latitude: number; longitude: number };
  wasteTypes?: string[];
  date?: Date;
  time?: string;
}

export default function CustomerRequestScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { state: appState } = useAppContext();
  const { createPickupRequest } = useCustomerContext();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get('window');

  const [currentStep, setCurrentStep] = useState<RequestStep>('location');
  const [requestData, setRequestData] = useState<RequestData>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ requestId: string; estimatedCost: number } | null>(null);

  const currentUser = appState.currentUser || {
    id: 'mock-customer-1',
    name: 'Daniel Silva',
    email: 'daniel@example.com',
    role: 'customer' as const,
    address: 'Rua Batista de Castro, 37',
    phone: '+55 11 99999-9999',
  };

  const handleLocationSelect = useCallback((location: string) => {
    // Try to extract coordinates from the string if present
    const match = location.match(/Lat: ([\d.-]+), Lon: ([\d.-]+)/);
    let coordinates: { latitude: number; longitude: number; };
    if (match) {
      coordinates = { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
    }
    setRequestData(prev => ({ ...prev, location, coordinates }));
    setCurrentStep('wasteType');
  }, []);

  const handleWasteTypeToggle = useCallback((type: string) => {
    setSelectedTypes([type]);
    setRequestData(prev => ({ ...prev, wasteTypes: [type] }));
    setTimeout(() => setCurrentStep('dateTime'), 200); // slight delay for UI feedback
  }, []);

  const handleWasteTypeNext = useCallback(() => {
    setRequestData(prev => ({ ...prev, wasteTypes: selectedTypes }));
    setCurrentStep('dateTime');
  }, [selectedTypes]);

  const handleDateTimeSelect = useCallback(
    async (date: Date, time: string) => {
      setSelectedDate(date);
      const finalData = { ...requestData, date };
      setRequestData(finalData);

      if (!currentUser?.id) {
        Alert.alert('Error', 'Please log in to submit a request.');
        return;
      }

      try {
        setIsSubmitting(true);

        const mapWasteTypes = (types: string[]): WasteType[] =>
          types.map(type => {
            switch (type) {
              case 'Organic Waste':
                return WasteType.ORGANIC;
              case 'Plastic Waste':
              case 'Paper & Cardboard':
              case 'Glass Waste':
                return WasteType.RECYCLABLE;
              case 'E-Waste':
                return WasteType.HAZARDOUS;
              default:
                return WasteType.GENERAL;
            }
          });

        const completeRequest: Partial<PickupRequest> = {
          customerId: currentUser.id,
          address: finalData.location || 'Address not set',
          wasteType: mapWasteTypes(finalData.wasteTypes || []),
          quantity: 0,
          preferredDate: finalData.date || new Date(),
          preferredTimeSlot: 'anytime',
          isBulkDisposal: false,
          status: RequestStatus.PENDING,
          urgency: 'medium',
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
    },
    [requestData]
  );

  const handleViewSchedule = useCallback(() => {
    setShowSuccess(false);
    router.push('/(tabs)/customer/schedule');
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  const handleBackPress = useCallback(() => {
    if (currentStep === 'location') {
      router.back();
    } else {
      const stepOrder: RequestStep[] = ['location', 'wasteType', 'dateTime'];
      const currentIndex = stepOrder.indexOf(currentStep);
      if (currentIndex > 0) {
        const previousStep = stepOrder[currentIndex - 1];
        setCurrentStep(previousStep);
      }
    }
  }, [currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 'location':
        return <LocationStep onSelect={handleLocationSelect} adaptiveStyles={{ padding: 20, fontSize: 16, spacing: 12 }} />;
      case 'wasteType':
        return (
          <WasteTypeStep
            selectedTypes={selectedTypes}
            onSelect={handleWasteTypeToggle}
            adaptiveStyles={{ padding: 20, fontSize: 16, spacing: 12 }}
          />
        );
      case 'dateTime':
        return <DateTimeStep selectedDate={selectedDate} onSelectDate={setSelectedDate} adaptiveStyles={{ padding: 20, fontSize: 16, spacing: 12 }} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Map view */}
      <MapView
        style={styles.map}
        region={(() => {
          if (requestData.coordinates) {
            return {
              latitude: requestData.coordinates.latitude,
              longitude: requestData.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
          }
          // Default region (São Paulo)
          return {
            latitude: -23.55052,
            longitude: -46.633308,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
        })()}
      >
        {requestData.coordinates && (
          <Marker
            coordinate={requestData.coordinates}
            title={requestData.location}
          />
        )}
      </MapView>

      {/* Header overlay */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top }]}> 
        <TouchableOpacity style={styles.backButtonOverlay} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Show selected location after Step 1 */}
        {currentStep !== 'location' && requestData.location && (
          <View style={styles.locationDisplay}>
            <Ionicons name="location" size={16} color={theme.colors.secondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {requestData.location}
            </Text>
          </View>
        )}

        <View style={styles.profileButton}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{currentUser.name?.charAt(0) || 'U'}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View
        style={{
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
          paddingBottom: 35,
        }}
      >
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <View style={{ width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 }} />
        </View>
        {/* Only wrap non-list steps in ScrollView, otherwise render directly */}
        {currentStep === 'location' || currentStep === 'dateTime' ? (
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
            {renderStepContent()}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            {renderStepContent()}
          </View>
        )}
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backButtonOverlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  profileButton: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  profileImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.secondary, justifyContent: 'center', alignItems: 'center' },
  profileInitial: { color: 'white', fontSize: 16, fontWeight: '600' },
  map: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 24, color: theme.colors.textSecondary, width: '100%', textAlign: 'center', height: '100%' },
  locationDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
});
