import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';
import { ScheduleFilters, ScheduleItem, ScheduleSummary } from '../../../components/customer';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { FloatingActionButton } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useAppContext, useCustomerContext } from '../../../contexts';
import { PickupStatus } from '../../../types/common';
import { PickupRequest } from '../../../types/customer';

// Customer Schedule Screen - comprehensive pickup schedule management
export default function CustomerScheduleScreen() {
    const { state: appState } = useAppContext();
    const { state: customerState, loadPickupRequests, updatePickupRequest } = useCustomerContext();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<PickupStatus | 'all'>('all');
    const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'upcoming' | 'past' | 'today' | 'week'>('all');

    // Filter and sort pickups
    const filteredPickups = useMemo(() => {
        let filtered = [...customerState.pickupRequests];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(pickup => pickup.status === selectedStatus);
        }

        // Filter by timeframe
        switch (selectedTimeframe) {
            case 'today':
                filtered = filtered.filter(pickup => {
                    const pickupDate = new Date(pickup.preferredDate);
                    return pickupDate.toDateString() === today.toDateString();
                });
                break;
            case 'week':
                filtered = filtered.filter(pickup => {
                    const pickupDate = new Date(pickup.preferredDate);
                    return pickupDate >= today && pickupDate <= weekFromNow;
                });
                break;
            case 'upcoming':
                filtered = filtered.filter(pickup => {
                    const pickupDate = new Date(pickup.preferredDate);
                    return pickupDate >= today && (pickup.status === PickupStatus.SCHEDULED || pickup.status === PickupStatus.IN_PROGRESS);
                });
                break;
            case 'past':
                filtered = filtered.filter(pickup => {
                    const pickupDate = new Date(pickup.preferredDate);
                    return pickupDate < today || pickup.status === PickupStatus.COMPLETED || pickup.status === PickupStatus.CANCELLED;
                });
                break;
        }

        // Sort by date (upcoming first, then by date)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.preferredDate);
            const dateB = new Date(b.preferredDate);

            // Prioritize upcoming pickups
            const isUpcomingA = a.status === PickupStatus.SCHEDULED || a.status === PickupStatus.IN_PROGRESS;
            const isUpcomingB = b.status === PickupStatus.SCHEDULED || b.status === PickupStatus.IN_PROGRESS;

            if (isUpcomingA && !isUpcomingB) return -1;
            if (!isUpcomingA && isUpcomingB) return 1;

            // Then sort by date
            return dateA.getTime() - dateB.getTime();
        });
    }, [customerState.pickupRequests, selectedStatus, selectedTimeframe]);

    // Calculate counts for filters
    const filterCounts = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
            all: customerState.pickupRequests.length,
            scheduled: customerState.pickupRequests.filter(p => p.status === PickupStatus.SCHEDULED).length,
            inProgress: customerState.pickupRequests.filter(p => p.status === PickupStatus.IN_PROGRESS).length,
            completed: customerState.pickupRequests.filter(p => p.status === PickupStatus.COMPLETED).length,
            cancelled: customerState.pickupRequests.filter(p => p.status === PickupStatus.CANCELLED).length,
            today: customerState.pickupRequests.filter(p => {
                const pickupDate = new Date(p.preferredDate);
                return pickupDate.toDateString() === today.toDateString();
            }).length,
            week: customerState.pickupRequests.filter(p => {
                const pickupDate = new Date(p.preferredDate);
                return pickupDate >= today && pickupDate <= weekFromNow;
            }).length,
            upcoming: customerState.pickupRequests.filter(p => {
                const pickupDate = new Date(p.preferredDate);
                return pickupDate >= today && (p.status === PickupStatus.SCHEDULED || p.status === PickupStatus.IN_PROGRESS);
            }).length,
            past: customerState.pickupRequests.filter(p => {
                const pickupDate = new Date(p.preferredDate);
                return pickupDate < today || p.status === PickupStatus.COMPLETED || p.status === PickupStatus.CANCELLED;
            }).length,
        };
    }, [customerState.pickupRequests]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadPickupRequests();
        } catch (error) {
            console.error('Failed to refresh pickups:', error);
        } finally {
            setRefreshing(false);
        }
    }, [loadPickupRequests]);

    const handlePickupPress = useCallback((pickup: PickupRequest) => {
        // TODO: Navigate to pickup details screen
        Alert.alert(
            'Pickup Details',
            `Pickup #${pickup.id}\nStatus: ${pickup.status}\nDate: ${new Date(pickup.preferredDate).toLocaleDateString()}`,
            [{ text: 'OK' }]
        );
    }, []);

    const handleCancelPickup = useCallback(async (pickup: PickupRequest) => {
        Alert.alert(
            'Cancel Pickup',
            `Are you sure you want to cancel pickup #${pickup.id}?\n\nThis action cannot be undone.`,
            [
                { text: 'Keep Pickup', style: 'cancel' },
                {
                    text: 'Cancel Pickup',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await updatePickupRequest(pickup.id, { status: PickupStatus.CANCELLED });
                            Alert.alert(
                                'Pickup Cancelled',
                                'Your pickup has been successfully cancelled.',
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                'Failed to cancel pickup. Please try again.',
                                [{ text: 'OK' }]
                            );
                        }
                    },
                },
            ]
        );
    }, [updatePickupRequest]);

    const handleReschedulePickup = useCallback((pickup: PickupRequest) => {
        // TODO: Navigate to reschedule screen or show reschedule modal
        Alert.alert(
            'Reschedule Pickup',
            'Reschedule functionality will be available in a future update.',
            [{ text: 'OK' }]
        );
    }, []);

    const handleNewRequest = useCallback(() => {
        router.push('/(tabs)/customer/request');
    }, []);

    const renderPickupItem = useCallback(({ item }: { item: PickupRequest }) => (
        <ScheduleItem
            pickup={item}
            onPress={handlePickupPress}
            onCancel={handleCancelPickup}
            onReschedule={handleReschedulePickup}
        />
    ), [handlePickupPress, handleCancelPickup, handleReschedulePickup]);

    const renderEmptyState = () => {
        let title = 'No Pickups Found';
        let subtitle = 'You haven\'t scheduled any pickups yet.';
        let actionText = 'Schedule First Pickup';

        if (selectedStatus !== 'all' || selectedTimeframe !== 'all') {
            title = 'No Matching Pickups';
            subtitle = 'Try adjusting your filters to see more results.';
            actionText = 'Clear Filters';
        }

        return (
            <EmptyState
                icon="calendar-outline"
                title={title}
                subtitle={subtitle}
                actionText={actionText}
                onAction={selectedStatus !== 'all' || selectedTimeframe !== 'all'
                    ? () => {
                        setSelectedStatus('all');
                        setSelectedTimeframe('all');
                    }
                    : handleNewRequest
                }
            />
        );
    };

    const renderHeader = () => (
        <View>
            <ScheduleSummary
                pickups={customerState.pickupRequests}
                onStatusPress={(status) => {
                    setSelectedStatus(status);
                    setSelectedTimeframe('all');
                }}
            />
            <ScheduleFilters
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                counts={filterCounts}
            />
        </View>
    );

    if (customerState.requestsLoading && !refreshing) {
        return (
            <View style={styles.container}>
                <Header title="Schedule" />
                <LoadingSpinner message="Loading your schedule..." />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Schedule"
                subtitle={`${filteredPickups.length} pickup${filteredPickups.length !== 1 ? 's' : ''}`}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <FlatList
                data={filteredPickups}
                renderItem={renderPickupItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    filteredPickups.length === 0 && styles.emptyListContent,
                ]}
            />

            <FloatingActionButton
                icon="add"
                onPress={handleNewRequest}
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
    listContent: {
        paddingBottom: 100, // Space for FAB
    },
    emptyListContent: {
        flexGrow: 1,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
    },
});