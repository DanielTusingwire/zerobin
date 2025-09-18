import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { RequestStatus, WasteType } from '../../types/common';
import { PickupRequest } from '../../types/customer';
import { Card } from '../ui';

export interface RecentActivityProps {
    pickups: PickupRequest[];
    onViewAll: () => void;
}

const STATUS_CONFIG = {
    [RequestStatus.PENDING]: {
        color: theme.colors.warning,
        icon: 'time-outline',
        label: 'Pending',
    },
    [RequestStatus.CONFIRMED]: {
        color: theme.colors.info,
        icon: 'calendar-outline',
        label: 'Scheduled',
    },
    [RequestStatus.IN_PROGRESS]: {
        color: theme.colors.primary,
        icon: 'car-outline',
        label: 'In Progress',
    },
    [RequestStatus.COMPLETED]: {
        color: theme.colors.success,
        icon: 'checkmark-circle-outline',
        label: 'Completed',
    },
    [RequestStatus.CANCELLED]: {
        color: theme.colors.error,
        icon: 'close-circle-outline',
        label: 'Cancelled',
    },
};

const WASTE_TYPE_ICONS = {
    [WasteType.GENERAL]: 'trash-outline',
    [WasteType.RECYCLABLE]: 'refresh-outline',
    [WasteType.ORGANIC]: 'leaf-outline',
    [WasteType.HAZARDOUS]: 'warning-outline',
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
    pickups,
    onViewAll,
}) => {
    const formatDate = (date: Date): string => {
        const today = new Date();
        const pickupDate = new Date(date);
        const diffTime = Math.abs(today.getTime() - pickupDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return pickupDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getMainWasteType = (wasteTypes: WasteType[]): WasteType => {
        return wasteTypes[0] || WasteType.GENERAL;
    };

    if (pickups.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                </View>
                <Card style={styles.emptyCard}>
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="calendar-outline" size={32} color={theme.colors.textSecondary} />
                        </View>
                        <Text style={styles.emptyTitle}>No recent activity</Text>
                        <Text style={styles.emptySubtitle}>
                            Your pickup requests will appear here
                        </Text>
                    </View>
                </Card>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <Card style={styles.activityCard}>
                {pickups.map((pickup, index) => {
                    const statusConfig = STATUS_CONFIG[pickup.status];
                    const mainWasteType = getMainWasteType(pickup.wasteType);
                    const wasteIcon = WASTE_TYPE_ICONS[mainWasteType];

                    return (
                        <View key={pickup.id} style={styles.activityItem}>
                            <View style={styles.activityLeft}>
                                <View style={[styles.wasteIcon, { backgroundColor: theme.colors.surface }]}>
                                    <Ionicons
                                        name={wasteIcon as any}
                                        size={20}
                                        color={theme.colors.textSecondary}
                                    />
                                </View>
                                <View style={styles.activityInfo}>
                                    <Text style={styles.activityTitle}>
                                        Pickup Request #{pickup.id}
                                    </Text>
                                    <Text style={styles.activityDetails}>
                                        {pickup.quantity} {pickup.quantity === 1 ? 'unit' : 'units'} • {pickup.wasteType.join(', ')}
                                    </Text>
                                    <Text style={styles.activityDate}>
                                        {formatDate(pickup.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.activityRight}>
                                <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '15' }]}>
                                    <Ionicons
                                        name={statusConfig.icon as any}
                                        size={12}
                                        color={statusConfig.color}
                                    />
                                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                        {statusConfig.label}
                                    </Text>
                                </View>
                            </View>

                            {index < pickups.length - 1 && <View style={styles.separator} />}
                        </View>
                    );
                })}
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    viewAllText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    activityCard: {
        padding: theme.spacing.lg,
    },
    activityItem: {
        paddingVertical: theme.spacing.md,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        gap: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    wasteIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    activityDetails: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    activityDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    activityRight: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        gap: theme.spacing.xs,
    },
    statusText: {
        ...theme.typography.caption,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginTop: theme.spacing.md,
    },
    emptyCard: {
        padding: theme.spacing.xl,
    },
    emptyState: {
        alignItems: 'center',
    },
    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});