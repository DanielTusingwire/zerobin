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
import { Badge, Card } from '../ui';

export interface ScheduleItemProps {
    pickup: PickupRequest;
    onPress?: (pickup: PickupRequest) => void;
    onCancel?: (pickup: PickupRequest) => void;
    onReschedule?: (pickup: PickupRequest) => void;
}

const STATUS_CONFIG = {
    [RequestStatus.PENDING]: {
        color: theme.colors.warning,
        icon: 'time-outline',
        label: 'Pending',
        description: 'Pickup request is awaiting confirmation',
    },
    [RequestStatus.CONFIRMED]: {
        color: theme.colors.info,
        icon: 'calendar-outline',
        label: 'Scheduled',
        description: 'Pickup is confirmed and scheduled',
    },
    [RequestStatus.IN_PROGRESS]: {
        color: theme.colors.primary,
        icon: 'car-outline',
        label: 'In Progress',
        description: 'Driver is on the way or collecting',
    },
    [RequestStatus.COMPLETED]: {
        color: theme.colors.success,
        icon: 'checkmark-circle-outline',
        label: 'Completed',
        description: 'Pickup has been completed',
    },
    [RequestStatus.CANCELLED]: {
        color: theme.colors.error,
        icon: 'close-circle-outline',
        label: 'Cancelled',
        description: 'Pickup has been cancelled',
    },
};

const WASTE_TYPE_ICONS = {
    [WasteType.GENERAL]: 'trash-outline',
    [WasteType.RECYCLABLE]: 'refresh-outline',
    [WasteType.ORGANIC]: 'leaf-outline',
    [WasteType.HAZARDOUS]: 'warning-outline',
};

const WASTE_TYPE_COLORS = {
    [WasteType.GENERAL]: theme.colors.wasteGeneral,
    [WasteType.RECYCLABLE]: theme.colors.wasteRecyclable,
    [WasteType.ORGANIC]: theme.colors.wasteOrganic,
    [WasteType.HAZARDOUS]: theme.colors.wasteHazardous,
};

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
    pickup,
    onPress,
    onCancel,
    onReschedule,
}) => {
    const statusConfig = STATUS_CONFIG[pickup.status];

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

    const formatTime = (date: Date): string => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getTimeSlotLabel = (timeSlot: string): string => {
        switch (timeSlot) {
            case 'morning': return 'Morning (8AM-12PM)';
            case 'afternoon': return 'Afternoon (12PM-5PM)';
            case 'evening': return 'Evening (5PM-8PM)';
            case 'anytime': return 'Anytime';
            default: return timeSlot;
        }
    };

    const canCancel = pickup.status === RequestStatus.PENDING || pickup.status === RequestStatus.CONFIRMED;
    const canReschedule = pickup.status === RequestStatus.PENDING || pickup.status === RequestStatus.CONFIRMED;
    const isUpcoming = pickup.status === RequestStatus.PENDING || pickup.status === RequestStatus.CONFIRMED || pickup.status === RequestStatus.IN_PROGRESS;

    return (
        <Card style={StyleSheet.flatten([styles.container, isUpcoming && styles.upcomingContainer])}>
            <TouchableOpacity
                style={styles.content}
                onPress={() => onPress?.(pickup)}
                activeOpacity={0.7}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]}>
                            <Ionicons
                                name={statusConfig.icon as any}
                                size={16}
                                color={theme.colors.background}
                            />
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.requestId}>#{pickup.id}</Text>
                            <Badge
                                text={statusConfig.label}
                                style={StyleSheet.flatten([styles.statusBadge, { backgroundColor: statusConfig.color + '20' }])}
                                textStyle={{ color: statusConfig.color }}
                            />
                        </View>
                    </View>

                    {pickup.estimatedCost && (
                        <View style={styles.costContainer}>
                            <Text style={styles.costLabel}>Cost</Text>
                            <Text style={styles.costValue}>${pickup.estimatedCost.toFixed(2)}</Text>
                        </View>
                    )}
                </View>

                {/* Date & Time */}
                <View style={styles.dateTimeSection}>
                    <View style={styles.dateTimeItem}>
                        <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                        <Text style={styles.dateText}>{formatDate(pickup.preferredDate)}</Text>
                    </View>

                    <View style={styles.dateTimeItem}>
                        <Ionicons name="time" size={16} color={theme.colors.primary} />
                        <Text style={styles.timeText}>
                            {getTimeSlotLabel(pickup.preferredTimeSlot)}
                        </Text>
                    </View>
                </View>

                {/* Waste Types */}
                <View style={styles.wasteSection}>
                    <Text style={styles.sectionLabel}>Waste Types:</Text>
                    <View style={styles.wasteTypes}>
                        {pickup.wasteType.map((type, index) => (
                            <View key={index} style={styles.wasteTypeItem}>
                                <Ionicons
                                    name={WASTE_TYPE_ICONS[type] as any}
                                    size={14}
                                    color={WASTE_TYPE_COLORS[type]}
                                />
                                <Text style={[styles.wasteTypeText, { color: WASTE_TYPE_COLORS[type] }]}>
                                    {type}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quantity & Address */}
                <View style={styles.detailsSection}>
                    <View style={styles.detailItem}>
                        <Ionicons name="cube-outline" size={14} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText}>
                            {pickup.quantity} {pickup.quantity === 1 ? 'unit' : 'units'}
                            {pickup.isBulkDisposal && ' (Bulk)'}
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {pickup.address}
                        </Text>
                    </View>
                </View>

                {/* Urgency & Contact */}
                {(pickup.urgency !== 'low' || pickup.contactPerson) && (
                    <View style={styles.additionalInfo}>
                        {pickup.urgency !== 'low' && (
                            <Badge
                                text={`${pickup.urgency} priority`}
                                variant={pickup.urgency === 'high' ? 'error' : 'warning'}
                                style={styles.urgencyBadge}
                            />
                        )}

                        {pickup.contactPerson && (
                            <View style={styles.contactInfo}>
                                <Ionicons name="person-outline" size={12} color={theme.colors.textSecondary} />
                                <Text style={styles.contactText}>
                                    {pickup.contactPerson}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Notes */}
                {pickup.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText} numberOfLines={2}>
                            {pickup.notes}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Action Buttons */}
            {(canCancel || canReschedule) && (
                <View style={styles.actions}>
                    {canReschedule && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rescheduleButton]}
                            onPress={() => onReschedule?.(pickup)}
                        >
                            <Ionicons name="calendar-outline" size={16} color={theme.colors.info} />
                            <Text style={[styles.actionButtonText, { color: theme.colors.info }]}>
                                Reschedule
                            </Text>
                        </TouchableOpacity>
                    )}

                    {canCancel && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => onCancel?.(pickup)}
                        >
                            <Ionicons name="close-outline" size={16} color={theme.colors.error} />
                            <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: 0,
        overflow: 'hidden',
    },
    upcomingContainer: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    content: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.sm,
    },
    statusIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    requestId: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    statusBadge: {
        alignSelf: 'flex-start',
    },
    costContainer: {
        alignItems: 'flex-end',
    },
    costLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    costValue: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    dateTimeSection: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    dateText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    timeText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    wasteSection: {
        marginBottom: theme.spacing.md,
    },
    sectionLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
    },
    wasteTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    wasteTypeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
    },
    wasteTypeText: {
        ...theme.typography.caption,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    detailsSection: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    detailText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    additionalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    urgencyBadge: {
        alignSelf: 'flex-start',
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    contactText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    notesSection: {
        marginBottom: theme.spacing.sm,
    },
    notesLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    notesText: {
        ...theme.typography.body2,
        color: theme.colors.text,
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        gap: theme.spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        gap: theme.spacing.xs,
    },
    rescheduleButton: {
        borderColor: theme.colors.info + '40',
        backgroundColor: theme.colors.info + '10',
    },
    cancelButton: {
        borderColor: theme.colors.error + '40',
        backgroundColor: theme.colors.error + '10',
    },
    actionButtonText: {
        ...theme.typography.body2,
        fontWeight: '600',
    },
});