import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { JobCard, JobFilterOptions, JobFilters } from '../../../components/driver';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { FloatingActionButton, Input } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useAppContext, useDriverContext } from '../../../contexts';
import { Job } from '../../../types/driver';

// Driver Jobs Screen - displays list of scheduled pickups with filtering and search
export default function DriverJobsScreen() {
    const { state: driverState, loadJobs, refreshAll, setJobStatusFilter, setSearchQuery } = useDriverContext();
    const { state: appState } = useAppContext();

    const [showFilters, setShowFilters] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [filters, setFilters] = useState<JobFilterOptions>({
        status: 'all',
        wasteTypes: [],
        priority: 'all',
        dateRange: 'all',
        sortBy: 'time',
        sortOrder: 'asc',
        searchQuery: '',
    });

    // Load jobs when component mounts
    useEffect(() => {
        if (appState.currentUser?.role === 'driver') {
            loadJobs();
        }
    }, [appState.currentUser]);

    // Update search query with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(localSearchQuery);
            setFilters(prev => ({ ...prev, searchQuery: localSearchQuery }));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [localSearchQuery, setSearchQuery]);

    const handleRefresh = useCallback(async () => {
        try {
            await refreshAll();
        } catch (error) {
            console.error('Failed to refresh jobs:', error);
        }
    }, [refreshAll]);

    const handleJobPress = useCallback((job: Job) => {
        // Navigate to job details screen
        router.push(`/(tabs)/driver/job-details/${job.id}`);
    }, []);

    const handlePhotoPress = useCallback((job: Job) => {
        // Navigate to photo capture screen
        router.push(`/(tabs)/driver/photo-capture?jobId=${job.id}`);
    }, []);

    const handleStatusPress = useCallback((job: Job) => {
        // Quick status update or navigate to status update screen
        console.log('Status pressed for job:', job.id);
    }, []);

    const handleFiltersApply = useCallback((newFilters: JobFilterOptions) => {
        setFilters(newFilters);
        setJobStatusFilter(newFilters.status);
    }, [setJobStatusFilter]);

    const getFilteredAndSortedJobs = useCallback((): Job[] => {
        let filteredJobs = [...driverState.jobs];

        // Apply status filter
        if (filters.status !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.status === filters.status);
        }

        // Apply waste type filter
        if (filters.wasteTypes.length > 0) {
            filteredJobs = filteredJobs.filter(job =>
                job.wasteType.some(type => filters.wasteTypes.includes(type))
            );
        }

        // Apply priority filter
        if (filters.priority !== 'all') {
            filteredJobs = filteredJobs.filter(job => job.priority === filters.priority);
        }

        // Apply date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);

            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.scheduledTime);

                switch (filters.dateRange) {
                    case 'today':
                        return jobDate >= today && jobDate < tomorrow;
                    case 'tomorrow':
                        const dayAfterTomorrow = new Date(tomorrow);
                        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
                        return jobDate >= tomorrow && jobDate < dayAfterTomorrow;
                    case 'week':
                        return jobDate >= today && jobDate < weekEnd;
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filteredJobs = filteredJobs.filter(job =>
                job.customerName.toLowerCase().includes(query) ||
                job.address.toLowerCase().includes(query) ||
                job.id.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        filteredJobs.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'time':
                    comparison = new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'customer':
                    comparison = a.customerName.localeCompare(b.customerName);
                    break;
                case 'distance':
                    // For now, sort by address as a proxy for distance
                    comparison = a.address.localeCompare(b.address);
                    break;
                default:
                    comparison = 0;
            }

            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return filteredJobs;
    }, [driverState.jobs, filters]);

    const filteredJobs = getFilteredAndSortedJobs();

    const getActiveFiltersCount = (): number => {
        let count = 0;
        if (filters.status !== 'all') count++;
        if (filters.wasteTypes.length > 0) count++;
        if (filters.priority !== 'all') count++;
        if (filters.dateRange !== 'all') count++;
        if (filters.searchQuery.trim()) count++;
        return count;
    };

    const renderJobCard = useCallback(({ item }: { item: Job }) => (
        <JobCard
            job={item}
            onPress={handleJobPress}
            onStatusPress={handleStatusPress}
            onPhotoPress={handlePhotoPress}
            showDistance={false} // TODO: Calculate actual distance
        />
    ), [handleJobPress, handleStatusPress, handlePhotoPress]);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Input
                placeholder="Search jobs by customer, address, or ID"
                value={localSearchQuery}
                onChangeText={setLocalSearchQuery}
                leftIcon="search"
                style={styles.searchInput}
            />

            <TouchableOpacity
                style={[
                    styles.filterButton,
                    getActiveFiltersCount() > 0 && styles.filterButtonActive
                ]}
                onPress={() => setShowFilters(true)}
            >
                <Ionicons
                    name="filter"
                    size={20}
                    color={getActiveFiltersCount() > 0 ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[
                    styles.filterButtonText,
                    getActiveFiltersCount() > 0 && styles.filterButtonTextActive
                ]}>
                    Filter
                    {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => {
        if (driverState.jobsLoading) {
            return <LoadingSpinner message="Loading jobs..." />;
        }

        const hasActiveFilters = getActiveFiltersCount() > 0;

        return (
            <EmptyState
                icon="clipboard-outline"
                title={hasActiveFilters ? "No Jobs Match Filters" : "No Jobs Available"}
                message={
                    hasActiveFilters
                        ? "Try adjusting your filters to see more jobs."
                        : "You don't have any scheduled pickups. Check back later or refresh to see new assignments."
                }
                actionTitle={hasActiveFilters ? "Clear Filters" : "Refresh Jobs"}
                onActionPress={hasActiveFilters ? () => {
                    const resetFilters: JobFilterOptions = {
                        status: 'all',
                        wasteTypes: [],
                        priority: 'all',
                        dateRange: 'all',
                        sortBy: 'time',
                        sortOrder: 'asc',
                        searchQuery: '',
                    };
                    setFilters(resetFilters);
                    setLocalSearchQuery('');
                } : handleRefresh}
            />
        );
    };

    if (driverState.isLoading && driverState.jobs.length === 0) {
        return (
            <View style={styles.container}>
                <Header
                    title="Jobs"
                    subtitle={`${driverState.todaysJobs.length} jobs today`}
                />
                <LoadingSpinner message="Loading your jobs..." />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Jobs"
                subtitle={`${filteredJobs.length} of ${driverState.jobs.length} jobs`}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <FlatList
                data={filteredJobs}
                renderItem={renderJobCard}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={[
                    styles.listContent,
                    filteredJobs.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={driverState.jobsLoading}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            />

            <FloatingActionButton
                icon="add"
                onPress={() => {
                    // TODO: Navigate to create job screen or show quick actions
                    console.log('FAB pressed');
                }}
                position="bottom-right"
            />

            <JobFilters
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleFiltersApply}
                currentFilters={filters}
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
        padding: theme.spacing.md,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        gap: theme.spacing.xs,
    },
    filterButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight + '20',
    },
    filterButtonText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    filterButtonTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});