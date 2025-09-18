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
import { RequestStatus } from '@/types/common';

export interface ScheduleFiltersProps {
    selectedStatus: RequestStatus | 'all';
    onStatusChange: (status: RequestStatus | 'all') => void;
    selectedTimeframe: 'all' | 'upcoming' | 'past' | 'today' | 'week';
    onTimeframeChange: (timeframe: 'all' | 'upcoming' | 'past' | 'today' | 'week') => void;
    counts: {
        all: number;
        scheduled: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        upcoming: number;
        past: number;
        today: number;
        week: number;
    };
}

const STATUS_FILTERS = [
    {
        key: 'all' as const,
        label: 'All',
        icon: 'list-outline',
        color: theme.colors.textSecondary,
    },
    {
        key: RequestStatus.CONFIRMED,
        label: 'Scheduled',
        icon: 'calendar-outline',
        color: theme.colors.info,
    },
    {
        key: RequestStatus.IN_PROGRESS,
        label: 'In Progress',
        icon: 'car-outline',
        color: theme.colors.primary,
    },
    {
        key: RequestStatus.COMPLETED,
        label: 'Completed',
        icon: 'checkmark-circle-outline',
        color: theme.colors.success,
    },
    {
        key: RequestStatus.CANCELLED,
        label: 'Cancelled',
        icon: 'close-circle-outline',
        color: theme.colors.error,
    },
];

const TIMEFRAME_FILTERS = [
    {
        key: 'all' as const,
        label: 'All Time',
        icon: 'infinite-outline',
    },
    {
        key: 'today' as const,
        label: 'Today',
        icon: 'today-outline',
    },
    {
        key: 'week' as const,
        label: 'This Week',
        icon: 'calendar-outline',
    },
    {
        key: 'upcoming' as const,
        label: 'Upcoming',
        icon: 'arrow-forward-outline',
    },
    {
        key: 'past' as const,
        label: 'Past',
        icon: 'arrow-back-outline',
    },
];

export const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
    selectedStatus,
    onStatusChange,
    selectedTimeframe,
    onTimeframeChange,
    counts,
}) => {
    const getStatusCount = (status: RequestStatus | 'all'): number => {
        switch (status) {
            case 'all': return counts.all;
            case RequestStatus.CONFIRMED: return counts.scheduled;
            case RequestStatus.IN_PROGRESS: return counts.inProgress;
            case RequestStatus.COMPLETED: return counts.completed;
            case RequestStatus.CANCELLED: return counts.cancelled;
            default: return 0;
        }
    };

    const getTimeframeCount = (timeframe: 'all' | 'upcoming' | 'past' | 'today' | 'week'): number => {
        return counts[timeframe] || 0;
    };

    return (
        <View style={styles.container}>
            {/* Status Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Status</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {STATUS_FILTERS.map((filter) => {
                        const isSelected = selectedStatus === filter.key;
                        const count = getStatusCount(filter.key);

                        return (
                            <TouchableOpacity
                                key={filter.key}
                                style={[
                                    styles.filterChip,
                                    isSelected && styles.filterChipSelected,
                                    isSelected && { borderColor: filter.color },
                                ]}
                                onPress={() => onStatusChange(filter.key)}
                            >
                                <View style={[
                                    styles.filterIcon,
                                    isSelected && { backgroundColor: filter.color + '20' }
                                ]}>
                                    <Ionicons
                                        name={filter.icon as any}
                                        size={16}
                                        color={isSelected ? filter.color : theme.colors.textSecondary}
                                    />
                                </View>
                                <Text style={[
                                    styles.filterLabel,
                                    isSelected && styles.filterLabelSelected,
                                    isSelected && { color: filter.color }
                                ]}>
                                    {filter.label}
                                </Text>
                                {count > 0 && (
                                    <View style={[
                                        styles.countBadge,
                                        isSelected && { backgroundColor: filter.color }
                                    ]}>
                                        <Text style={[
                                            styles.countText,
                                            isSelected && { color: theme.colors.buttonText }
                                        ]}>
                                            {count}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Timeframe Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Time Period</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {TIMEFRAME_FILTERS.map((filter) => {
                        const isSelected = selectedTimeframe === filter.key;
                        const count = getTimeframeCount(filter.key);

                        return (
                            <TouchableOpacity
                                key={filter.key}
                                style={[
                                    styles.filterChip,
                                    isSelected && styles.filterChipSelected,
                                ]}
                                onPress={() => onTimeframeChange(filter.key)}
                            >
                                <View style={[
                                    styles.filterIcon,
                                    isSelected && { backgroundColor: theme.colors.primary + '20' }
                                ]}>
                                    <Ionicons
                                        name={filter.icon as any}
                                        size={16}
                                        color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                                    />
                                </View>
                                <Text style={[
                                    styles.filterLabel,
                                    isSelected && styles.filterLabelSelected,
                                ]}>
                                    {filter.label}
                                </Text>
                                {count > 0 && (
                                    <View style={[
                                        styles.countBadge,
                                        isSelected && { backgroundColor: theme.colors.primary }
                                    ]}>
                                        <Text style={[
                                            styles.countText,
                                            isSelected && { color: theme.colors.buttonText }
                                        ]}>
                                            {count}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
        marginHorizontal: theme.spacing.md,
    },
    filtersContainer: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        gap: theme.spacing.xs,
        minHeight: 40,
    },
    filterChipSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    filterIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    filterLabelSelected: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    countBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
    },
    countText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
        fontSize: 10,
    },
});