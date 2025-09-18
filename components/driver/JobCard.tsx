import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { JobStatus, WasteType } from '../../types/common';
import { Job } from '../../types/driver';
import { Card } from '../ui';

export interface JobCardProps {
    job: Job;
    onPress?: (job: Job) => void;
    onStatusPress?: (job: Job) => void;
    onPhotoPress?: (job: Job) => void;
    showDistance?: boolean;
    distance?: number;
}

export const JobCard: React.FC<JobCardProps> = ({
    job,
    onPress,
    onStatusPress,
    onPhotoPress,
    showDistance = false,
    distance,
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

    const getStatusText = (status: JobStatus): string => {
        switch (status) {
            case JobStatus.SCHEDULED:
                return 'Scheduled';
            case JobStatus.IN_PROGRESS:
                return 'In Progress';
            case JobStatus.COMPLETED:
                return 'Completed';
            case JobStatus.CANCELLED:
                return 'Cancelled';
            default:
                return status;
        }
    };

    const getPriorityColor = (priority: Job['priority']): string => {
        switch (priority) {
            case 'high':
                return theme.colors.error;
            case 'medium':
                return theme.colors.warning;
            case 'low':
                return theme.colors.success;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getWasteTypeColor = (wasteType: WasteType): string => {
        switch (wasteType) {
            case WasteType.GENERAL:
                return theme.colors.wasteGeneral;
            case WasteType.RECYCLABLE:
                return theme.colors.wasteRecyclable;
            case WasteType.ORGANIC:
                return theme.colors.wasteOrganic;
            case WasteType.HAZARDOUS:
                return theme.colors.wasteHazardous;
            default:
                return theme.colors.textSecondary;
        }
    };

    const formatTime = (date: Date): string => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date): string => {
        const today = new Date();
        const jobDate = new Date(date);

        if (jobDate.toDateString() === today.toDateString()) {
            return 'Today';
        }

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (jobDate.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        return jobDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card style={styles.card} onPress={() => onPress?.(job)}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.customerName} numberOfLines={1}>
                        {job.customerName}
                    </Text>
                    <View style={styles.timeContainer}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                        <Text style={styles.timeText}>
                            {formatDate(job.scheduledTime)} at {formatTime(job.scheduledTime)}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}
                        onPress={() => onStatusPress?.(job)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.statusText}>{getStatusText(job.status)}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.addressContainer}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.addressText} numberOfLines={2}>
                    {job.address}
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.wasteTypesContainer}>
                    <Text style={styles.detailLabel}>Waste Types:</Text>
                    <View style={styles.wasteTypesList}>
                        {job.wasteType.map((type, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.wasteTypeBadge,
                                    { backgroundColor: getWasteTypeColor(type) }
                                ]}
                            >
                                <Text style={styles.wasteTypeText}>{type}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.volumeContainer}>
                    <Ionicons name="cube-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.volumeText}>
                        {job.actualVolume || job.estimatedVolume} m³
                        {job.actualVolume && job.actualVolume !== job.estimatedVolume && (
                            <Text style={styles.estimatedText}> (est. {job.estimatedVolume} m³)</Text>
                        )}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <View style={styles.priorityContainer}>
                        <View
                            style={[
                                styles.priorityIndicator,
                                { backgroundColor: getPriorityColor(job.priority) }
                            ]}
                        />
                        <Text style={styles.priorityText}>{job.priority} priority</Text>
                    </View>

                    {showDistance && distance !== undefined && (
                        <View style={styles.distanceContainer}>
                            <Ionicons name="navigate-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.distanceText}>{distance.toFixed(1)} km away</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footerRight}>
                    {job.photos.length > 0 && (
                        <TouchableOpacity
                            style={styles.photoIndicator}
                            onPress={() => onPhotoPress?.(job)}
                        >
                            <Ionicons name="camera" size={16} color={theme.colors.primary} />
                            <Text style={styles.photoCount}>{job.photos.length}</Text>
                        </TouchableOpacity>
                    )}

                    {job.scannedCodes.length > 0 && (
                        <View style={styles.scanIndicator}>
                            <Ionicons name="qr-code" size={16} color={theme.colors.primary} />
                            <Text style={styles.scanCount}>{job.scannedCodes.length}</Text>
                        </View>
                    )}

                    {job.status === JobStatus.IN_PROGRESS && (
                        <TouchableOpacity
                            style={styles.quickPhotoButton}
                            onPress={() => onPhotoPress?.(job)}
                        >
                            <Ionicons name="camera-outline" size={16} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {job.specialInstructions && (
                <View style={styles.instructionsContainer}>
                    <Ionicons name="information-circle-outline" size={16} color={theme.colors.warning} />
                    <Text style={styles.instructionsText} numberOfLines={2}>
                        {job.specialInstructions}
                    </Text>
                </View>
            )}

            {job.notes && job.status === JobStatus.COMPLETED && (
                <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText} numberOfLines={2}>
                        {job.notes}
                    </Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    headerLeft: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    customerName: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    timeText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    addressText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    detailsContainer: {
        marginBottom: theme.spacing.md,
    },
    wasteTypesContainer: {
        marginBottom: theme.spacing.sm,
    },
    detailLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    wasteTypesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    wasteTypeBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    wasteTypeText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    volumeText: {
        ...theme.typography.body2,
        color: theme.colors.text,
    },
    estimatedText: {
        color: theme.colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flex: 1,
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    priorityText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textTransform: 'capitalize',
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    distanceText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    photoIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    photoCount: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    scanIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    scanCount: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    quickPhotoButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primaryLight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary + '40',
    },
    instructionsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        marginTop: theme.spacing.sm,
        gap: theme.spacing.xs,
    },
    instructionsText: {
        ...theme.typography.caption,
        color: theme.colors.text,
        flex: 1,
    },
    notesContainer: {
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
    },
    notesLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    notesText: {
        ...theme.typography.caption,
        color: theme.colors.text,
    },
});