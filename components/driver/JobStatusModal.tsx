import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { JobStatus } from '../../types/common';
import { Job } from '../../types/driver';
import { Button, Card } from '../ui';

export interface JobStatusModalProps {
    visible: boolean;
    job: Job | null;
    onClose: () => void;
    onUpdateStatus: (jobId: string, status: JobStatus, notes?: string) => Promise<void>;
}

export const JobStatusModal: React.FC<JobStatusModalProps> = ({
    visible,
    job,
    onClose,
    onUpdateStatus,
}) => {
    const [selectedStatus, setSelectedStatus] = useState<JobStatus | null>(null);
    const [notes, setNotes] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const statusOptions = [
        {
            status: JobStatus.SCHEDULED,
            label: 'Scheduled',
            icon: 'calendar-outline',
            color: theme.colors.info,
            description: 'Job is scheduled and ready to start',
        },
        {
            status: JobStatus.IN_PROGRESS,
            label: 'In Progress',
            icon: 'play-circle-outline',
            color: theme.colors.warning,
            description: 'Currently working on this job',
        },
        {
            status: JobStatus.COMPLETED,
            label: 'Completed',
            icon: 'checkmark-circle-outline',
            color: theme.colors.success,
            description: 'Job has been completed successfully',
        },
        {
            status: JobStatus.CANCELLED,
            label: 'Cancelled',
            icon: 'close-circle-outline',
            color: theme.colors.error,
            description: 'Job has been cancelled',
        },
    ];

    const handleStatusSelect = (status: JobStatus) => {
        setSelectedStatus(status);
    };

    const handleUpdate = async () => {
        if (!job || !selectedStatus) return;

        try {
            setIsUpdating(true);
            await onUpdateStatus(job.id, selectedStatus, notes.trim() || undefined);
            handleClose();
        } catch (error) {
            console.error('Failed to update job status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleClose = () => {
        setSelectedStatus(null);
        setNotes('');
        setIsUpdating(false);
        onClose();
    };

    const canUpdateToStatus = (status: JobStatus): boolean => {
        if (!job) return false;

        // Define allowed status transitions
        const allowedTransitions: Record<JobStatus, JobStatus[]> = {
            [JobStatus.SCHEDULED]: [JobStatus.IN_PROGRESS, JobStatus.CANCELLED],
            [JobStatus.IN_PROGRESS]: [JobStatus.COMPLETED, JobStatus.CANCELLED],
            [JobStatus.COMPLETED]: [], // Completed jobs can't be changed
            [JobStatus.CANCELLED]: [JobStatus.SCHEDULED], // Can reschedule cancelled jobs
        };

        return allowedTransitions[job.status].includes(status);
    };

    const getAvailableStatuses = () => {
        return statusOptions.filter(option =>
            option.status !== job?.status && canUpdateToStatus(option.status)
        );
    };

    if (!job) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Update Job Status</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.content}>
                    {/* Current Job Info */}
                    <Card style={styles.jobInfo}>
                        <Text style={styles.customerName}>{job.customerName}</Text>
                        <Text style={styles.address}>{job.address}</Text>
                        <View style={styles.currentStatusContainer}>
                            <Text style={styles.currentStatusLabel}>Current Status:</Text>
                            <View style={[
                                styles.currentStatusBadge,
                                { backgroundColor: statusOptions.find(s => s.status === job.status)?.color }
                            ]}>
                                <Text style={styles.currentStatusText}>
                                    {statusOptions.find(s => s.status === job.status)?.label}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Status Options */}
                    <View style={styles.statusOptions}>
                        <Text style={styles.sectionTitle}>Select New Status</Text>
                        {getAvailableStatuses().map((option) => (
                            <TouchableOpacity
                                key={option.status}
                                style={[
                                    styles.statusOption,
                                    selectedStatus === option.status && styles.statusOptionSelected,
                                ]}
                                onPress={() => handleStatusSelect(option.status)}
                            >
                                <View style={styles.statusOptionLeft}>
                                    <Ionicons
                                        name={option.icon as any}
                                        size={24}
                                        color={selectedStatus === option.status ? theme.colors.primary : option.color}
                                    />
                                    <View style={styles.statusOptionText}>
                                        <Text style={[
                                            styles.statusOptionLabel,
                                            selectedStatus === option.status && styles.statusOptionLabelSelected,
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <Text style={styles.statusOptionDescription}>
                                            {option.description}
                                        </Text>
                                    </View>
                                </View>
                                {selectedStatus === option.status && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={20}
                                        color={theme.colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Notes Input */}
                    {selectedStatus && (
                        <View style={styles.notesSection}>
                            <Text style={styles.sectionTitle}>
                                Notes {selectedStatus === JobStatus.CANCELLED ? '(Required)' : '(Optional)'}
                            </Text>
                            <TextInput
                                style={styles.notesInput}
                                placeholder={
                                    selectedStatus === JobStatus.CANCELLED
                                        ? 'Please provide a reason for cancellation...'
                                        : 'Add any notes about this status update...'
                                }
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button
                        title="Cancel"
                        onPress={handleClose}
                        variant="outline"
                        style={styles.cancelButton}
                    />
                    <Button
                        title={isUpdating ? 'Updating...' : 'Update Status'}
                        onPress={handleUpdate}
                        variant="primary"
                        disabled={!selectedStatus || isUpdating || (selectedStatus === JobStatus.CANCELLED && !notes.trim())}
                        loading={isUpdating}
                        style={styles.updateButton}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
    },
    placeholder: {
        width: 40, // Same width as close button for centering
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    jobInfo: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    customerName: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    address: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    currentStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    currentStatusLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    currentStatusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    currentStatusText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
    },
    statusOptions: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        marginBottom: theme.spacing.sm,
    },
    statusOptionSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight + '10',
    },
    statusOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    statusOptionText: {
        flex: 1,
    },
    statusOptionLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    statusOptionLabelSelected: {
        color: theme.colors.primary,
    },
    statusOptionDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    notesSection: {
        marginBottom: theme.spacing.lg,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body2,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        minHeight: 80,
    },
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    cancelButton: {
        flex: 1,
    },
    updateButton: {
        flex: 2,
    },
});