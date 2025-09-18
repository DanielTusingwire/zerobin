import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Coordinate, JobStatus } from '../../types/common';
import { Job, Route } from '../../types/driver';
import { Card } from '../ui';

export interface MockMapViewProps {
    route: Route | null;
    jobs: Job[];
    onJobPress?: (job: Job) => void;
    onLocationPress?: (coordinate: Coordinate) => void;
    showCurrentLocation?: boolean;
    style?: any;
}

export const MockMapView: React.FC<MockMapViewProps> = ({
    route,
    jobs,
    onJobPress,
    showCurrentLocation = true,
    style,
}) => {
    const getStatusColor = (status: JobStatus): string => {
        switch (status) {
            case JobStatus.SCHEDULED:
                return theme.colors.info;
            case JobStatus.IN_PROGRESS:
                return theme.colors.warning;
            case JobStatus.COMPLETED:
                return theme.colors.success;
            case JobStatus.CANCELLED:
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getStatusIcon = (status: JobStatus): string => {
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

    const formatTime = (date: Date): string => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <View style={[styles.container, style]}>
            {/* Mock Map Header */}
            <View style={styles.mapHeader}>
                <View style={styles.mapHeaderContent}>
                    <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.mapTitle}>Route Map (Development Mode)</Text>
                </View>
                <Text style={styles.mapSubtitle}>
                    {jobs.length} stops • {route?.totalDistance || 0} km
                </Text>
            </View>

            {/* Current Location Indicator */}
            {showCurrentLocation && (
                <Card style={styles.currentLocationCard}>
                    <View style={styles.currentLocationHeader}>
                        <Ionicons name="locate" size={20} color={theme.colors.primary} />
                        <Text style={styles.currentLocationText}>Current Location</Text>
                    </View>
                    <Text style={styles.locationCoords}>
                        40.7128° N, 74.0060° W (Mock Location)
                    </Text>
                </Card>
            )}

            {/* Route Path Visualization */}
            {route && route.optimizedPath.length > 1 && (
                <Card style={styles.routePathCard}>
                    <View style={styles.routePathHeader}>
                        <Ionicons name="git-branch-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.routePathTitle}>Optimized Route Path</Text>
                    </View>
                    <View style={styles.routePathVisualization}>
                        {route.optimizedPath.map((coord, index) => (
                            <View key={index} style={styles.routePathItem}>
                                <View style={styles.routePathDot} />
                                {index < route.optimizedPath.length - 1 && (
                                    <View style={styles.routePathLine} />
                                )}
                            </View>
                        ))}
                    </View>
                    <Text style={styles.routePathInfo}>
                        {route.optimizedPath.length} waypoints • {route.totalDistance} km total
                    </Text>
                </Card>
            )}

            {/* Job Markers List */}
            <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
                <Text style={styles.jobsListTitle}>Job Locations</Text>
                {jobs.map((job, index) => (
                    <TouchableOpacity
                        key={job.id}
                        style={styles.jobMarker}
                        onPress={() => onJobPress?.(job)}
                    >
                        <View style={styles.jobMarkerLeft}>
                            <View style={styles.jobMarkerNumber}>
                                <Text style={styles.jobMarkerNumberText}>{index + 1}</Text>
                            </View>
                            <View
                                style={[
                                    styles.jobMarkerIcon,
                                    { backgroundColor: getStatusColor(job.status) }
                                ]}
                            >
                                <Ionicons
                                    name={getStatusIcon(job.status) as any}
                                    size={16}
                                    color={theme.colors.background}
                                />
                            </View>
                        </View>

                        <View style={styles.jobMarkerContent}>
                            <Text style={styles.jobMarkerTitle} numberOfLines={1}>
                                {job.customerName}
                            </Text>
                            <Text style={styles.jobMarkerAddress} numberOfLines={2}>
                                {job.address}
                            </Text>
                            <View style={styles.jobMarkerDetails}>
                                <Text style={styles.jobMarkerTime}>
                                    {formatTime(job.scheduledTime)}
                                </Text>
                                <View style={styles.jobMarkerWasteTypes}>
                                    {job.wasteType.slice(0, 2).map((type, idx) => (
                                        <Text key={idx} style={styles.jobMarkerWasteType}>
                                            {type}
                                        </Text>
                                    ))}
                                    {job.wasteType.length > 2 && (
                                        <Text style={styles.jobMarkerWasteType}>
                                            +{job.wasteType.length - 2}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text style={styles.jobMarkerCoords}>
                                {job.coordinates.latitude.toFixed(4)}°, {job.coordinates.longitude.toFixed(4)}°
                            </Text>
                        </View>

                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                ))}

                {jobs.length === 0 && (
                    <View style={styles.emptyJobs}>
                        <Ionicons name="location-outline" size={48} color={theme.colors.textSecondary} />
                        <Text style={styles.emptyJobsText}>No job locations to display</Text>
                    </View>
                )}
            </ScrollView>

            {/* Development Notice */}
            <View style={styles.devNotice}>
                <Ionicons name="information-circle-outline" size={16} color={theme.colors.warning} />
                <Text style={styles.devNoticeText}>
                    Interactive map will be available in production build
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    mapHeader: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    mapHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        gap: theme.spacing.sm,
    },
    mapTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
    },
    mapSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    currentLocationCard: {
        margin: theme.spacing.md,
        padding: theme.spacing.md,
    },
    currentLocationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        gap: theme.spacing.xs,
    },
    currentLocationText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    locationCoords: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    routePathCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.md,
    },
    routePathHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    routePathTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    routePathVisualization: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    },
    routePathItem: {
        alignItems: 'center',
        flex: 1,
    },
    routePathDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
    },
    routePathLine: {
        position: 'absolute',
        top: 4,
        left: '50%',
        right: '-50%',
        height: 2,
        backgroundColor: theme.colors.primary,
        opacity: 0.5,
    },
    routePathInfo: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    jobsList: {
        flex: 1,
        padding: theme.spacing.md,
    },
    jobsListTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    jobMarker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    jobMarkerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    jobMarkerNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobMarkerNumberText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
        fontSize: 10,
    },
    jobMarkerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobMarkerContent: {
        flex: 1,
    },
    jobMarkerTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    jobMarkerAddress: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    jobMarkerDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    jobMarkerTime: {
        ...theme.typography.caption,
        color: theme.colors.text,
        fontWeight: '500',
    },
    jobMarkerWasteTypes: {
        flexDirection: 'row',
        gap: 4,
    },
    jobMarkerWasteType: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    jobMarkerCoords: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontSize: 10,
    },
    emptyJobs: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    emptyJobsText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
    },
    devNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.warning + '20',
        gap: theme.spacing.xs,
    },
    devNoticeText: {
        ...theme.typography.caption,
        color: theme.colors.warning,
    },
});