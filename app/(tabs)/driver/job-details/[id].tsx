import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { JobStatusModal, PhotoGallery } from '../../../../components/driver';
import { Header, LoadingSpinner } from '../../../../components/shared';
import { Badge, Button, Card, Separator } from '../../../../components/ui';
import { theme } from '../../../../constants/theme';
import { useDriverContext } from '../../../../contexts';
import { JobStatus, WasteType } from '../../../../types/common';

// Job Details Screen - comprehensive view of a single job
export default function JobDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { state, updateJobStatus, addJobPhoto, deleteJobPhoto } = useDriverContext();

    const [refreshing, setRefreshing] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Find the job
    const job = state.jobs.find(j => j.id === id) ||
        state.todaysJobs.find(j => j.id === id);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // In a real app, this would refresh the specific job data
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Failed to refresh job:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const handleStatusUpdate = useCallback(async (status: JobStatus, notes?: string) => {
        if (!job) return;

        try {
            setIsUpdating(true);
            await updateJobStatus(job.id, status, notes);
            setShowStatusModal(false);

            Alert.alert(
                'Status Updated',
                `Job status has been updated to ${status.toLowerCase()}.`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to update job status:', error);
            Alert.alert(
                'Error',
                'Failed to update job status. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsUpdating(false);
        }
    }, [job, updateJobStatus]);

    const handlePhotoCapture = useCallback(() => {
        if (!job) return;
        router.push(`/(tabs)/driver/photo-capture?jobId=${job.id}`);
    }, [job]);

    const handleDeletePhoto = useCallback(async (photoUri: string) => {
        if (!job) return;

        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteJobPhoto(job.id, photoUri);
                            Alert.alert('Photo Deleted', 'Photo has been removed.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete photo.');
                        }
                    },
                },
            ]
        );
    }, [job, deleteJobPhoto]);

    const handleNavigateToLocation = useCallback(() => {
        if (!job) return;

        Alert.alert(
            'Navigate to Location',
            `Open navigation to ${job.address}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Navigate',
                    onPress: () => {
                        // In a real app, this would open the device's navigation app
                        console.log('Navigate to:', job.coordinates);
                        Alert.alert('Navigation', 'Opening navigation app...');
                    },
                },
            ]
        );
    }, [job]);

    const handleCallCustomer = useCallback(() => {
        if (!job?.customerPhone) return;

        Alert.alert(
            'Call Customer',
            `Call ${job.customerName} at ${job.customerPhone}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call',
                    onPress: () => {
                        // In a real app, this would initiate a phone call
                        console.log('Calling:', job.customerPhone);
                        Alert.alert('Calling', `Calling ${job.customerPhone}...`);
                    },
                },
            ]
        );
    }, [job]);

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

    const formatDateTime = (date: Date): string => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const canUpdateStatus = (currentStatus: JobStatus): boolean => {
        return currentStatus !== JobStatus.COMPLETED && currentStatus !== JobStatus.CANCELLED;
    };

    if (!job) {
        return (
            <View style={styles.container}>
                <Header
                    title="Job Details"
                    leftIcon="arrow-back"
                    onLeftPress={() => router.back()}
                />
                <View style={styles.errorContainer}>
                    <LoadingSpinner message="Job not found" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Job Details"
                subtitle={job.customerName}
                leftIcon="arrow-back"
                onLeftPress={() => router.back()}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {/* Job Header */}
                <Card style={styles.headerCard}>
                    <View style={styles.jobHeader}>
                        <View style={styles.jobHeaderLeft}>
                            <Text style={styles.customerName}>{job.customerName}</Text>
                            <Text style={styles.jobId}>Job #{job.id}</Text>
                        </View>
                        <Badge
                            text={job.status}
                            variant={job.status === JobStatus.COMPLETED ? 'success' :
                                job.status === JobStatus.IN_PROGRESS ? 'warning' :
                                    job.status === JobStatus.CANCELLED ? 'error' : 'info'}
                        />
                    </View>
                </Card>

                {/* Location & Time */}
                <Card style={styles.detailCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location" size={24} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Location & Schedule</Text>
                    </View>

                    <View style={styles.locationInfo}>
                        <Text style={styles.address}>{job.address}</Text>
                        <Text style={styles.scheduledTime}>
                            Scheduled: {formatDateTime(job.scheduledTime)}
                        </Text>
                        {job.completedAt && (
                            <Text style={styles.completedTime}>
                                Completed: {formatDateTime(job.completedAt)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.actionButtons}>
                        <Button
                            title="Navigate"
                            onPress={handleNavigateToLocation}
                            variant="outline"
                            style={styles.actionButton}
                            leftIcon="navigate"
                        />
                        {job.customerPhone && (
                            <Button
                                title="Call"
                                onPress={handleCallCustomer}
                                variant="outline"
                                style={styles.actionButton}
                                leftIcon="call"
                            />
                        )}
                    </View>
                </Card>

                {/* Waste Information */}
                <Card style={styles.detailCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="trash" size={24} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Waste Information</Text>
                    </View>

                    <View style={styles.wasteInfo}>
                        <View style={styles.wasteTypes}>
                            <Text style={styles.infoLabel}>Waste Types:</Text>
                            <View style={styles.wasteTypesList}>
                                {job.wasteType.map((type, index) => (
                                    <Badge
                                        key={index}
                                        text={type}
                                        style={[styles.wasteTypeBadge, { backgroundColor: getWasteTypeColor(type) }]}
                                    />
                                ))}
                            </View>
                        </View>

                        <Separator style={styles.separator} />

                        <View style={styles.volumeInfo}>
                            <View style={styles.volumeItem}>
                                <Text style={styles.infoLabel}>Estimated Volume:</Text>
                                <Text style={styles.infoValue}>{job.estimatedVolume} m³</Text>
                            </View>
                            {job.actualVolume && (
                                <View style={styles.volumeItem}>
                                    <Text style={styles.infoLabel}>Actual Volume:</Text>
                                    <Text style={styles.infoValue}>{job.actualVolume} m³</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.priorityInfo}>
                            <Text style={styles.infoLabel}>Priority:</Text>
                            <Badge
                                text={`${job.priority} priority`}
                                variant={job.priority === 'high' ? 'error' :
                                    job.priority === 'medium' ? 'warning' : 'success'}
                            />
                        </View>
                    </View>
                </Card>

                {/* Special Instructions */}
                {job.specialInstructions && (
                    <Card style={styles.detailCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="information-circle" size={24} color={theme.colors.warning} />
                            <Text style={styles.cardTitle}>Special Instructions</Text>
                        </View>
                        <Text style={styles.instructionsText}>{job.specialInstructions}</Text>
                    </Card>
                )}

                {/* Collection Photos */}
                <PhotoGallery
                    photos={job.photos}
                    jobId={job.id}
                    customerName={job.customerName}
                    onDeletePhoto={handleDeletePhoto}
                    onAddPhoto={handlePhotoCapture}
                    editable={job.status !== JobStatus.COMPLETED}
                />

                {/* Scan Records */}
                {job.scannedCodes.length > 0 && (
                    <Card style={styles.detailCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="qr-code" size={24} color={theme.colors.primary} />
                            <Text style={styles.cardTitle}>Scanned Codes ({job.scannedCodes.length})</Text>
                        </View>
                        <View style={styles.scanList}>
                            {job.scannedCodes.map((code, index) => (
                                <View key={index} style={styles.scanItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                                    <Text style={styles.scanCode}>{code}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                )}

                {/* Notes */}
                {job.notes && (
                    <Card style={styles.detailCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                            <Text style={styles.cardTitle}>Notes</Text>
                        </View>
                        <Text style={styles.notesText}>{job.notes}</Text>
                    </Card>
                )}

                {/* Status Update Button */}
                {canUpdateStatus(job.status) && (
                    <View style={styles.statusUpdateContainer}>
                        <Button
                            title="Update Status"
                            onPress={() => setShowStatusModal(true)}
                            loading={isUpdating}
                            style={styles.statusUpdateButton}
                            leftIcon="refresh"
                        />
                    </View>
                )}
            </ScrollView>

            {/* Status Update Modal */}
            <JobStatusModal
                visible={showStatusModal}
                job={job}
                onClose={() => setShowStatusModal(false)}
                onStatusUpdate={handleStatusUpdate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCard: {
        margin: theme.spacing.md,
        padding: theme.spacing.md,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    jobHeaderLeft: {
        flex: 1,
    },
    customerName: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    jobId: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    detailCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    cardTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
    },
    locationInfo: {
        marginBottom: theme.spacing.md,
    },
    address: {
        ...theme.typography.body1,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    scheduledTime: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    completedTime: {
        ...theme.typography.body2,
        color: theme.colors.success,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    actionButton: {
        flex: 1,
    },
    wasteInfo: {
        gap: theme.spacing.md,
    },
    wasteTypes: {
        gap: theme.spacing.sm,
    },
    infoLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    wasteTypesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    wasteTypeBadge: {
        marginRight: theme.spacing.xs,
    },
    separator: {
        marginVertical: theme.spacing.sm,
    },
    volumeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    volumeItem: {
        flex: 1,
    },
    infoValue: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginTop: theme.spacing.xs,
    },
    priorityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    instructionsText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        lineHeight: 24,
    },
    scanList: {
        gap: theme.spacing.sm,
    },
    scanItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    scanCode: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontFamily: 'monospace',
    },
    notesText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        lineHeight: 24,
    },
    statusUpdateContainer: {
        padding: theme.spacing.md,
    },
    statusUpdateButton: {
        width: '100%',
    },
});