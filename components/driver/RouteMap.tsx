import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Coordinate, JobStatus } from '../../types/common';
import { Job, Route } from '../../types/driver';
import { Card } from '../ui';
// Try to import react-native-maps, fallback to mock if not available
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
let Callout: any = null;
let Region: any = null;

try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Polyline = maps.Polyline;
    Callout = maps.Callout;
    Region = maps.Region;
} catch (error) {
    console.log('react-native-maps not available, using mock implementation');
}

export interface RouteMapProps {
    route: Route | null;
    jobs: Job[];
    onJobPress?: (job: Job) => void;
    onLocationPress?: (coordinate: Coordinate) => void;
    showCurrentLocation?: boolean;
    style?: any;
}

export const RouteMap: React.FC<RouteMapProps> = ({
    route,
    jobs,
    onJobPress,
    onLocationPress,
    showCurrentLocation = true,
    style,
}) => {
    const mapRef = useRef<MapView>(null);
    const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
    const [locationPermission, setLocationPermission] = useState<boolean>(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Request location permission and get current location
    useEffect(() => {
        if (showCurrentLocation) {
            requestLocationPermission();
        }
    }, [showCurrentLocation]);

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                getCurrentLocation();
            } else {
                setLocationPermission(false);
                Alert.alert(
                    'Location Permission',
                    'Location permission is needed to show your current position on the map.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
            setLocationPermission(false);
        }
    };

    const getCurrentLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error('Error getting current location:', error);
            // Use mock location for testing
            setCurrentLocation({
                latitude: 40.7128,
                longitude: -74.0060,
            });
        }
    };

    // Calculate initial region based on jobs or route
    const getInitialRegion = useCallback((): Region => {
        const coordinates = route?.optimizedPath || jobs.map(job => job.coordinates);

        if (coordinates.length === 0) {
            // Default to NYC area if no coordinates
            return {
                latitude: 40.7589,
                longitude: -73.9851,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            };
        }

        if (coordinates.length === 1) {
            return {
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }

        // Calculate bounds for multiple coordinates
        const latitudes = coordinates.map(coord => coord.latitude);
        const longitudes = coordinates.map(coord => coord.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latDelta = (maxLat - minLat) * 1.2; // Add 20% padding
        const lngDelta = (maxLng - minLng) * 1.2;

        return {
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: Math.max(latDelta, 0.01),
            longitudeDelta: Math.max(lngDelta, 0.01),
        };
    }, [route, jobs]);

    // Fit map to show all markers
    const fitToMarkers = useCallback(() => {
        if (!mapRef.current || !mapReady) return;

        const coordinates = route?.optimizedPath || jobs.map(job => job.coordinates);
        if (coordinates.length === 0) return;

        if (coordinates.length === 1) {
            mapRef.current.animateToRegion({
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } else {
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [route, jobs, mapReady]);

    // Get marker color based on job status
    const getMarkerColor = (status: JobStatus): string => {
        switch (status) {
            case JobStatus.SCHEDULED:
                return '#3498db'; // Blue
            case JobStatus.IN_PROGRESS:
                return '#f39c12'; // Orange
            case JobStatus.COMPLETED:
                return '#27ae60'; // Green
            case JobStatus.CANCELLED:
                return '#e74c3c'; // Red
            default:
                return '#95a5a6'; // Gray
        }
    };

    // Get marker icon based on job status
    const getMarkerIcon = (status: JobStatus): string => {
        switch (status) {
            case JobStatus.SCHEDULED:
                return 'time-outline';
            case JobStatus.IN_PROGRESS:
                return 'play-circle-outline';
            case JobStatus.COMPLETED:
                return 'checkmark-circle-outline';
            case JobStatus.CANCELLED:
                return 'close-circle-outline';
            default:
                return 'location-outline';
        }
    };

    const handleMarkerPress = (job: Job) => {
        setSelectedJob(job);
        onJobPress?.(job);
    };

    const handleMapPress = (event: any) => {
        const coordinate = event.nativeEvent.coordinate;
        setSelectedJob(null);
        onLocationPress?.(coordinate);
    };

    const centerOnCurrentLocation = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    // Use MockMapView if react-native-maps is not available
    if (!MapView) {
        return (
            <MockMapView
                route={route}
                jobs={jobs}
                onJobPress={onJobPress}
                onLocationPress={onLocationPress}
                showCurrentLocation={showCurrentLocation}
                style={style}
            />
        );
    }

    return (
        <View style={[styles.container, style]}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={getInitialRegion()}
                onMapReady={() => setMapReady(true)}
                onPress={handleMapPress}
                showsUserLocation={locationPermission && showCurrentLocation}
                showsMyLocationButton={false}
                showsCompass={true}
                showsScale={true}
                toolbarEnabled={false}
            >
                {/* Job markers */}
                {jobs.map((job) => (
                    <Marker
                        key={job.id}
                        coordinate={job.coordinates}
                        pinColor={getMarkerColor(job.status)}
                        onPress={() => handleMarkerPress(job)}
                    >
                        <Callout tooltip>
                            <Card style={styles.callout}>
                                <View style={styles.calloutHeader}>
                                    <Ionicons
                                        name={getMarkerIcon(job.status) as any}
                                        size={20}
                                        color={getMarkerColor(job.status)}
                                    />
                                    <Text style={styles.calloutTitle} numberOfLines={1}>
                                        {job.customerName}
                                    </Text>
                                </View>
                                <Text style={styles.calloutAddress} numberOfLines={2}>
                                    {job.address}
                                </Text>
                                <View style={styles.calloutDetails}>
                                    <Text style={styles.calloutTime}>
                                        {new Date(job.scheduledTime).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </Text>
                                    <View style={styles.calloutWasteTypes}>
                                        {job.wasteType.slice(0, 2).map((type, index) => (
                                            <Text key={index} style={styles.calloutWasteType}>
                                                {type}
                                            </Text>
                                        ))}
                                        {job.wasteType.length > 2 && (
                                            <Text style={styles.calloutWasteType}>
                                                +{job.wasteType.length - 2}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </Card>
                        </Callout>
                    </Marker>
                ))}

                {/* Route polyline */}
                {route && route.optimizedPath.length > 1 && (
                    <Polyline
                        coordinates={route.optimizedPath}
                        strokeColor={theme.colors.primary}
                        strokeWidth={3}
                        strokePattern={[1]}
                    />
                )}

                {/* Current location marker */}
                {currentLocation && showCurrentLocation && (
                    <Marker
                        coordinate={currentLocation}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.currentLocationMarker}>
                            <View style={styles.currentLocationDot} />
                        </View>
                    </Marker>
                )}
            </MapView>

            {/* Map controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={fitToMarkers}
                >
                    <Ionicons name="resize-outline" size={20} color={theme.colors.text} />
                </TouchableOpacity>

                {currentLocation && (
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={centerOnCurrentLocation}
                    >
                        <Ionicons name="locate-outline" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Route info */}
            {route && (
                <View style={styles.routeInfo}>
                    <Card style={styles.routeInfoCard}>
                        <View style={styles.routeInfoHeader}>
                            <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.routeInfoTitle}>Today's Route</Text>
                        </View>
                        <View style={styles.routeInfoDetails}>
                            <View style={styles.routeInfoItem}>
                                <Text style={styles.routeInfoLabel}>Distance</Text>
                                <Text style={styles.routeInfoValue}>{route.totalDistance} km</Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <Text style={styles.routeInfoLabel}>Duration</Text>
                                <Text style={styles.routeInfoValue}>
                                    {Math.round(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <Text style={styles.routeInfoLabel}>Jobs</Text>
                                <Text style={styles.routeInfoValue}>{jobs.length}</Text>
                            </View>
                        </View>
                    </Card>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        top: 50,
        right: 16,
        gap: 8,
    },
    controlButton: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    routeInfo: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    routeInfoCard: {
        padding: theme.spacing.md,
    },
    routeInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.xs,
    },
    routeInfoTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
    },
    routeInfoDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    routeInfoItem: {
        alignItems: 'center',
    },
    routeInfoLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    routeInfoValue: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    callout: {
        minWidth: 200,
        maxWidth: 250,
        padding: theme.spacing.sm,
    },
    calloutHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        gap: theme.spacing.xs,
    },
    calloutTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        flex: 1,
    },
    calloutAddress: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    calloutDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calloutTime: {
        ...theme.typography.caption,
        color: theme.colors.text,
        fontWeight: '500',
    },
    calloutWasteTypes: {
        flexDirection: 'row',
        gap: 4,
    },
    calloutWasteType: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    currentLocationMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.primary + '30',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    currentLocationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
    },
});