import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { RouteMap } from '../../../components/driver/RouteMap';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { Button, Card, FloatingActionButton } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useAppContext, useDriverContext } from '../../../contexts';
import { Job, Route } from '../../../types/driver';

// Driver Routes Screen - displays optimized route map with job markers
export default function DriverRoutesScreen() {
    const { state: driverState, loadRoutes, loadActiveRoute, updateRouteStatus, refreshAll } = useDriverContext();
    const { state: appState } = useAppContext();

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showRouteDetails, setShowRouteDetails] = useState(false);

    // Load routes when component mounts
    useEffect(() => {
        if (appState.currentUser?.role === 'driver') {
            loadRoutes();
            loadActiveRoute();
        }
    }, [appState.currentUser]);

    const handleRefresh = useCallback(async () => {
        try {
            await refreshAll();
        } catch (error) {
            console.error('Failed to refresh routes:', error);
        }
    }, [refreshAll]);

    const handleJobPress = useCallback((job: Job) => {
        setSelectedJob(job);
        // TODO: Navigate to job details screen when implemented
        // router.push(`/job-details/${job.id}`);
        console.log('Job pressed:', job.id);
    }, []);

    const handleStartRoute = useCallback(async () => {
        if (!driverState.activeRoute) return;

        try {
            await updateRouteStatus(driverState.activeRoute.id, 'active');
            Alert.alert(
                'Route Started',
                'Your route has been activated. Safe driving!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to start route. Please try again.',
                [{ text: 'OK' }]
            );
        }
    }, [driverState.activeRoute, updateRouteStatus]);

    const handleCompleteRoute = useCallback(async () => {
        if (!driverState.activeRoute) return;

        Alert.alert(
            'Complete Route',
            'Are you sure you want to mark this route as completed?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Complete',
                    style: 'default',
                    onPress: async () => {
                        try {
                            await updateRouteStatus(driverState.activeRoute!.id, 'completed');
                            Alert.alert(
                                'Route Completed',
                                'Great job! Your route has been marked as completed.',
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                'Failed to complete route. Please try again.',
                                [{ text: 'OK' }]
                            );
                        }
                    },
                },
            ]
        );
    }, [driverState.activeRoute, updateRouteStatus]);

    const getRouteStatusColor = (status: Route['status']): string => {
        switch (status) {
            case 'planned':
                return theme.colors.info;
            case 'active':
                return theme.colors.warning;
            case 'completed':
                return theme.colors.success;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getRouteStatusText = (status: Route['status']): string => {
        switch (status) {
            case 'planned':
                return 'Planned';
            case 'active':
                return 'Active';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    const renderRouteActions = () => {
        if (!driverState.activeRoute) return null;

        const { status } = driverState.activeRoute;

        return (
            <View style={styles.routeActions}>
                {status === 'planned' && (
                    <Button
                        title="Start Route"
                        onPress={handleStartRoute}
                        variant="primary"
                        fullWidth
                    />
                )}
                {status === 'active' && (
                    <Button
                        title="Complete Route"
                        onPress={handleCompleteRoute}
                        variant="primary"
                        fullWidth
                    />
                )}
                {status === 'completed' && (
                    <View style={styles.completedMessage}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                        <Text style={styles.completedText}>Route Completed</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderRouteStats = () => {
        if (!driverState.activeRoute) return null;

        const route = driverState.activeRoute;
        const completedJobs = driverState.jobs.filter(job => job.status === 'completed').length;
        const totalJobs = driverState.jobs.length;

        return (
            <Card style={styles.statsCard}>
                <Text style={styles.statsTitle}>Route Progress</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedJobs}/{totalJobs}</Text>
                        <Text style={styles.statLabel}>Jobs</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{route.totalDistance} km</Text>
                        <Text style={styles.statLabel}>Distance</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {Math.round(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m
                        </Text>
                        <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={[styles.statusBadge, { backgroundColor: getRouteStatusColor(route.status) }]}>
                            <Text style={styles.statusText}>{getRouteStatusText(route.status)}</Text>
                        </View>
                        <Text style={styles.statLabel}>Status</Text>
                    </View>
                </View>
            </Card>
        );
    };

    if (driverState.routesLoading && !driverState.activeRoute) {
        return (
            <View style={styles.container}>
                <Header
                    title="Route Map"
                    subtitle="Loading your route..."
                />
                <LoadingSpinner message="Loading route data..." />
            </View>
        );
    }

    if (!driverState.activeRoute && !driverState.routesLoading) {
        return (
            <View style={styles.container}>
                <Header
                    title="Route Map"
                    subtitle="No active route"
                    rightIcon="refresh"
                    onRightPress={handleRefresh}
                />
                <EmptyState
                    icon="map-outline"
                    title="No Active Route"
                    message="You don't have an active route assigned. Check back later or contact dispatch for route assignments."
                    actionTitle="Refresh Routes"
                    onActionPress={handleRefresh}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Route Map"
                subtitle={`${driverState.jobs.length} stops today`}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <View style={styles.mapContainer}>
                <RouteMap
                    route={driverState.activeRoute}
                    jobs={driverState.jobs}
                    onJobPress={handleJobPress}
                    showCurrentLocation={true}
                    style={styles.map}
                />
            </View>

            {showRouteDetails && (
                <ScrollView
                    style={styles.detailsContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={driverState.routesLoading}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                >
                    {renderRouteStats()}
                    {renderRouteActions()}
                </ScrollView>
            )}

            <FloatingActionButton
                icon={showRouteDetails ? "map" : "list"}
                onPress={() => setShowRouteDetails(!showRouteDetails)}
                position="bottom-right"
                style={styles.fab}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    detailsContainer: {
        maxHeight: '40%',
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    statsCard: {
        margin: theme.spacing.md,
        padding: theme.spacing.md,
    },
    statsTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...theme.typography.h3,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.xs,
    },
    statusText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
    },
    routeActions: {
        padding: theme.spacing.md,
    },
    completedMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.success + '20',
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.sm,
    },
    completedText: {
        ...theme.typography.body1,
        color: theme.colors.success,
        fontWeight: '600',
    },
    fab: {
        backgroundColor: theme.colors.primary,
    },
});