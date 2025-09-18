import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { PickupRequest } from '../../types/customer';
import { Card } from '../ui';

export interface ScheduleSummaryProps {
    pickups: PickupRequest[];
    onStatusPress?: (status: RequestStatus) => void;
}

interface SummaryStats {
    total: number;
    upcoming: number;
    inProgress: number;
    completed: number;
    totalCost: number;
    nextPickup?: PickupRequest;
}

export const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({
    pickups,
    onStatusPress,
}) => {
    const stats: SummaryStats = React.useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const upcoming = pickups.filter(p => {
            const pickupDate = new Date(p.preferredDate);
            return pickupDate >= today && p.status === RequestStatus.CONFIRMED;
        });

        const inProgress = pickups.filter(p => p.status === PickupStatus.IN_PROGRESS);
        const completed = pickups.filter(p => p.status === PickupStatus.COMPLETED);

        const totalCost = completed.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);

        const nextPickup = upcoming
            .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0];

        return {
            total: pickups.length,
            upcoming: upcoming.length,
            inProgress: inProgress.length,
            completed: completed.length,
            totalCost,
            nextPickup,
        };
    }, [pickups]);

    const formatDate = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const pickupDate = new Date(date);

        if (pickupDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (pickupDate.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return pickupDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const renderStatCard = (
        icon: string,
        label: string,
        value: string | number,
        color: string,
        onPress?: () => void
    ) => (
        <TouchableOpacity
            style={[styles.statCard, onPress && styles.statCardPressable]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Quick Stats */}
            <View style={styles.statsGrid}>
                {renderStatCard(
                    'calendar-outline',
                    'Total Pickups',
                    stats.total,
                    theme.colors.textSecondary
                )}
                {renderStatCard(
                    'time-outline',
                    'Upcoming',
                    stats.upcoming,
                    theme.colors.info,
                    () => onStatusPress?.(PickupStatus.SCHEDULED)
                )}
                {renderStatCard(
                    'car-outline',
                    'In Progress',
                    stats.inProgress,
                    theme.colors.primary,
                    () => onStatusPress?.(PickupStatus.IN_PROGRESS)
                )}
                {renderStatCard(
                    'checkmark-circle-outline',
                    'Completed',
                    stats.completed,
                    theme.colors.success,
                    () => onStatusPress?.(PickupStatus.COMPLETED)
                )}
            </View>

            {/* Next Pickup Card */}
            {stats.nextPickup && (
                <Card style={styles.nextPickupCard}>
                    <View style={styles.nextPickupHeader}>
                        <View style={styles.nextPickupIcon}>
                            <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.nextPickupTitle}>Next Pickup</Text>
                    </View>

                    <View style={styles.nextPickupContent}>
                        <View style={styles.nextPickupInfo}>
                            <Text style={styles.nextPickupId}>#{stats.nextPickup.id}</Text>
                            <Text style={styles.nextPickupDate}>
                                {formatDate(stats.nextPickup.preferredDate)}
                            </Text>
                            <Text style={styles.nextPickupTime}>
                                {stats.nextPickup.preferredTimeSlot === 'anytime'
                                    ? 'Anytime'
                                    : `${stats.nextPickup.preferredTimeSlot} slot`
                                }
                            </Text>
                        </View>

                        <View style={styles.nextPickupWaste}>
                            <Text style={styles.wasteLabel}>Waste Types:</Text>
                            <View style={styles.wasteTypes}>
                                {stats.nextPickup.wasteType.slice(0, 3).map((type, index) => (
                                    <View key={index} style={styles.wasteTypeChip}>
                                        <Text style={styles.wasteTypeText}>{type}</Text>
                                    </View>
                                ))}
                                {stats.nextPickup.wasteType.length > 3 && (
                                    <View style={styles.wasteTypeChip}>
                                        <Text style={styles.wasteTypeText}>
                                            +{stats.nextPickup.wasteType.length - 3}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </Card>
            )}

            {/* Cost Summary */}
            {stats.totalCost > 0 && (
                <Card style={styles.costCard}>
                    <View style={styles.costHeader}>
                        <Ionicons name="wallet-outline" size={20} color={theme.colors.success} />
                        <Text style={styles.costTitle}>Total Spent</Text>
                    </View>
                    <Text style={styles.costValue}>${stats.totalCost.toFixed(2)}</Text>
                    <Text style={styles.costSubtext}>
                        From {stats.completed} completed pickup{stats.completed !== 1 ? 's' : ''}
                    </Text>
                </Card>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        alignItems: 'center',
        gap: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    statCardPressable: {
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    statValue: {
        ...theme.typography.h3,
        color: theme.colors.text,
        fontWeight: '600',
    },
    statLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    nextPickupCard: {
        padding: theme.spacing.lg,
    },
    nextPickupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    nextPickupIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextPickupTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    nextPickupContent: {
        gap: theme.spacing.md,
    },
    nextPickupInfo: {
        gap: theme.spacing.xs,
    },
    nextPickupId: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    nextPickupDate: {
        ...theme.typography.h4,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    nextPickupTime: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    nextPickupWaste: {
        gap: theme.spacing.xs,
    },
    wasteLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    wasteTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    wasteTypeChip: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.sm,
    },
    wasteTypeText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    costCard: {
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    costHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    costTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    costValue: {
        ...theme.typography.h1,
        color: theme.colors.success,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    costSubtext: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});