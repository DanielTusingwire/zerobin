import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from '../ui';

export interface DateTimePickerProps {
    selectedDate: Date;
    selectedTimeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
    onDateChange: (date: Date) => void;
    onTimeSlotChange: (timeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
}

const TIME_SLOTS = [
    {
        value: 'morning',
        label: 'Morning',
        time: '8AM - 12PM',
        icon: 'sunny-outline',
        color: '#FFB74D',
    },
    {
        value: 'afternoon',
        label: 'Afternoon',
        time: '12PM - 5PM',
        icon: 'partly-sunny-outline',
        color: '#FF8A65',
    },
    {
        value: 'evening',
        label: 'Evening',
        time: '5PM - 8PM',
        icon: 'moon-outline',
        color: '#9575CD',
    },
    {
        value: 'anytime',
        label: 'Anytime',
        time: 'Flexible',
        icon: 'time-outline',
        color: theme.colors.primary,
    },
] as const;

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    selectedDate,
    selectedTimeSlot,
    onDateChange,
    onTimeSlotChange,
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        }
    };

    const getNextAvailableDates = (): Date[] => {
        const dates: Date[] = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) { // Next 14 days
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        return dates;
    };

    const renderDateSelector = () => (
        <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Preferred Date</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowDatePicker(false)}
                        >
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateGrid}>
                        {getNextAvailableDates().map((date, index) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dateCard,
                                        isSelected && styles.dateCardSelected,
                                    ]}
                                    onPress={() => {
                                        onDateChange(date);
                                        setShowDatePicker(false);
                                    }}
                                >
                                    <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </Text>
                                    <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                                        {date.getDate()}
                                    </Text>
                                    <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                    </Text>
                                    {isToday && (
                                        <View style={styles.todayIndicator}>
                                            <Text style={styles.todayText}>Today</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Button
                        title="Cancel"
                        onPress={() => setShowDatePicker(false)}
                        variant="outline"
                        style={styles.cancelButton}
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.title}>Preferred Date & Time</Text>
            </View>

            <Text style={styles.description}>
                When would you like your waste to be collected?
            </Text>

            {/* Date Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Preferred Date</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <View style={styles.dateButtonContent}>
                        <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                        <Text style={styles.dateButtonText}>
                            {formatDate(selectedDate)}
                        </Text>
                        <Text style={styles.dateButtonSubtext}>
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Time Slot Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Preferred Time</Text>
                <View style={styles.timeSlotGrid}>
                    {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.value;
                        return (
                            <TouchableOpacity
                                key={slot.value}
                                style={[
                                    styles.timeSlotCard,
                                    isSelected && styles.timeSlotCardSelected,
                                ]}
                                onPress={() => onTimeSlotChange(slot.value)}
                            >
                                <View style={[styles.timeSlotIcon, { backgroundColor: slot.color + '20' }]}>
                                    <Ionicons
                                        name={slot.icon as any}
                                        size={20}
                                        color={slot.color}
                                    />
                                </View>
                                <View style={styles.timeSlotContent}>
                                    <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotLabelSelected]}>
                                        {slot.label}
                                    </Text>
                                    <Text style={styles.timeSlotTime}>
                                        {slot.time}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {renderDateSelector()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h4,
        color: theme.colors.text,
        flex: 1,
    },
    description: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
    },
    // Date Button Styles
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    dateButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    dateButtonText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    dateButtonSubtext: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginLeft: 'auto',
    },
    // Time Slot Styles
    timeSlotGrid: {
        gap: theme.spacing.sm,
    },
    timeSlotCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        gap: theme.spacing.md,
    },
    timeSlotCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    timeSlotIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeSlotContent: {
        flex: 1,
    },
    timeSlotLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    timeSlotLabelSelected: {
        color: theme.colors.primary,
    },
    timeSlotTime: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
    },
    modalTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    dateCard: {
        width: '22%',
        aspectRatio: 1,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    dateCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    dateDay: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    dateDaySelected: {
        color: theme.colors.primary,
    },
    dateNumber: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    dateNumberSelected: {
        color: theme.colors.primary,
    },
    dateMonth: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    dateMonthSelected: {
        color: theme.colors.primary,
    },
    todayIndicator: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    todayText: {
        ...theme.typography.caption,
        color: theme.colors.buttonText,
        fontSize: 8,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: theme.spacing.md,
    },
});