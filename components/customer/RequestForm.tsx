import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { WasteType } from '../../types/common';
import { PickupRequest } from '../../types/customer';
import { Button, Card, Input } from '../ui';

export interface RequestFormProps {
    onSubmit: (request: Partial<PickupRequest>) => void;
    loading?: boolean;
}

interface FormData {
    wasteTypes: WasteType[];
    quantity: string;
    preferredDate: Date;
    preferredTimeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
    isBulkDisposal: boolean;
    urgency: 'low' | 'medium' | 'high';
    notes: string;
    contactPerson: string;
    contactPhone: string;
}

const WASTE_TYPE_OPTIONS = [
    {
        type: WasteType.GENERAL,
        label: 'General Waste',
        description: 'Non-recyclable household/office waste',
        icon: 'trash-outline',
        color: theme.colors.wasteGeneral,
    },
    {
        type: WasteType.RECYCLABLE,
        label: 'Recyclables',
        description: 'Paper, plastic, glass, metal',
        icon: 'refresh-outline',
        color: theme.colors.wasteRecyclable,
    },
    {
        type: WasteType.ORGANIC,
        label: 'Organic Waste',
        description: 'Food scraps, garden waste',
        icon: 'leaf-outline',
        color: theme.colors.wasteOrganic,
    },
    {
        type: WasteType.HAZARDOUS,
        label: 'Hazardous Waste',
        description: 'Chemicals, batteries, electronics',
        icon: 'warning-outline',
        color: theme.colors.wasteHazardous,
    },
];

const TIME_SLOTS = [
    { value: 'morning', label: 'Morning (8AM - 12PM)', icon: 'sunny-outline' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)', icon: 'partly-sunny-outline' },
    { value: 'evening', label: 'Evening (5PM - 8PM)', icon: 'moon-outline' },
    { value: 'anytime', label: 'Anytime', icon: 'time-outline' },
] as const;

const URGENCY_LEVELS = [
    { value: 'low', label: 'Standard', description: 'Within 3-5 days', color: theme.colors.success },
    { value: 'medium', label: 'Priority', description: 'Within 1-2 days', color: theme.colors.warning },
    { value: 'high', label: 'Urgent', description: 'Same day/next day', color: theme.colors.error },
] as const;

export const RequestForm: React.FC<RequestFormProps> = ({
    onSubmit,
    loading = false,
}) => {
    const [formData, setFormData] = useState<FormData>({
        wasteTypes: [],
        quantity: '',
        preferredDate: new Date(),
        preferredTimeSlot: 'anytime',
        isBulkDisposal: false,
        urgency: 'low',
        notes: '',
        contactPerson: '',
        contactPhone: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const toggleWasteType = (wasteType: WasteType) => {
        setFormData(prev => ({
            ...prev,
            wasteTypes: prev.wasteTypes.includes(wasteType)
                ? prev.wasteTypes.filter(type => type !== wasteType)
                : [...prev.wasteTypes, wasteType],
        }));
        // Clear error when user makes selection
        if (errors.wasteTypes) {
            setErrors(prev => ({ ...prev, wasteTypes: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (formData.wasteTypes.length === 0) {
            newErrors.wasteTypes = 'Please select at least one waste type';
        }

        if (!formData.quantity.trim()) {
            newErrors.quantity = 'Please enter the estimated quantity';
        } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Please enter a valid quantity';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = 'Contact person is required';
        }

        if (!formData.contactPhone.trim()) {
            newErrors.contactPhone = 'Contact phone is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactPhone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.contactPhone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fix the errors before submitting.');
            return;
        }

        const request: Partial<PickupRequest> = {
            wasteType: formData.wasteTypes,
            quantity: Number(formData.quantity),
            preferredDate: formData.preferredDate,
            preferredTimeSlot: formData.preferredTimeSlot,
            isBulkDisposal: formData.isBulkDisposal,
            urgency: formData.urgency,
            notes: formData.notes.trim() || undefined,
            contactPerson: formData.contactPerson.trim(),
            contactPhone: formData.contactPhone.trim(),
        };

        onSubmit(request);
    };

    const renderWasteTypeSelector = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="layers-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Waste Types</Text>
                <Text style={styles.required}>*</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Select all types of waste you need collected
            </Text>

            {errors.wasteTypes && (
                <Text style={styles.errorText}>{errors.wasteTypes}</Text>
            )}

            <View style={styles.wasteTypeGrid}>
                {WASTE_TYPE_OPTIONS.map((option) => {
                    const isSelected = formData.wasteTypes.includes(option.type);
                    return (
                        <TouchableOpacity
                            key={option.type}
                            style={[
                                styles.wasteTypeCard,
                                isSelected && styles.wasteTypeCardSelected,
                                { borderColor: option.color },
                            ]}
                            onPress={() => toggleWasteType(option.type)}
                        >
                            <View style={[styles.wasteTypeIcon, { backgroundColor: option.color + '20' }]}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color={option.color}
                                />
                            </View>
                            <Text style={[styles.wasteTypeLabel, isSelected && styles.wasteTypeLabelSelected]}>
                                {option.label}
                            </Text>
                            <Text style={styles.wasteTypeDescription}>
                                {option.description}
                            </Text>
                            {isSelected && (
                                <View style={styles.selectedIndicator}>
                                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Card>
    );

    const renderQuantityInput = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Estimated Quantity</Text>
                <Text style={styles.required}>*</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Approximate volume in cubic meters or number of bags
            </Text>

            <Input
                placeholder="e.g., 2.5 or 10 bags"
                value={formData.quantity}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
                keyboardType="numeric"
                error={errors.quantity}
                leftIcon="cube-outline"
            />

            <TouchableOpacity
                style={[styles.bulkToggle, formData.isBulkDisposal && styles.bulkToggleActive]}
                onPress={() => setFormData(prev => ({ ...prev, isBulkDisposal: !prev.isBulkDisposal }))}
            >
                <Ionicons
                    name={formData.isBulkDisposal ? "checkbox" : "square-outline"}
                    size={20}
                    color={formData.isBulkDisposal ? theme.colors.primary : theme.colors.textSecondary}
                />
                <View style={styles.bulkToggleContent}>
                    <Text style={[styles.bulkToggleLabel, formData.isBulkDisposal && styles.bulkToggleLabelActive]}>
                        Bulk Disposal
                    </Text>
                    <Text style={styles.bulkToggleDescription}>
                        Large volume waste requiring special handling
                    </Text>
                </View>
            </TouchableOpacity>
        </Card>
    );

    const renderTimeSlotSelector = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Preferred Time</Text>
            </View>
            <Text style={styles.sectionDescription}>
                When would you prefer the pickup to happen?
            </Text>

            <View style={styles.timeSlotGrid}>
                {TIME_SLOTS.map((slot) => {
                    const isSelected = formData.preferredTimeSlot === slot.value;
                    return (
                        <TouchableOpacity
                            key={slot.value}
                            style={[
                                styles.timeSlotCard,
                                isSelected && styles.timeSlotCardSelected,
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, preferredTimeSlot: slot.value }))}
                        >
                            <Ionicons
                                name={slot.icon as any}
                                size={20}
                                color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                            />
                            <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotLabelSelected]}>
                                {slot.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Card>
    );

    const renderUrgencySelector = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="flash-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Urgency Level</Text>
            </View>
            <Text style={styles.sectionDescription}>
                How quickly do you need this pickup?
            </Text>

            <View style={styles.urgencyGrid}>
                {URGENCY_LEVELS.map((level) => {
                    const isSelected = formData.urgency === level.value;
                    return (
                        <TouchableOpacity
                            key={level.value}
                            style={[
                                styles.urgencyCard,
                                isSelected && styles.urgencyCardSelected,
                                { borderColor: level.color },
                            ]}
                            onPress={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                        >
                            <View style={[styles.urgencyIndicator, { backgroundColor: level.color }]} />
                            <View style={styles.urgencyContent}>
                                <Text style={[styles.urgencyLabel, isSelected && styles.urgencyLabelSelected]}>
                                    {level.label}
                                </Text>
                                <Text style={styles.urgencyDescription}>
                                    {level.description}
                                </Text>
                            </View>
                            {isSelected && (
                                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Card>
    );

    const renderContactInfo = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <Text style={styles.required}>*</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Who should we contact for this pickup?
            </Text>

            <Input
                placeholder="Contact person name"
                value={formData.contactPerson}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contactPerson: text }))}
                error={errors.contactPerson}
                leftIcon="person-outline"
                style={styles.contactInput}
            />

            <Input
                placeholder="Phone number"
                value={formData.contactPhone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, contactPhone: text }))}
                keyboardType="phone-pad"
                error={errors.contactPhone}
                leftIcon="call-outline"
            />
        </Card>
    );

    const renderNotesSection = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Additional Notes</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Any special instructions or additional information
            </Text>

            <Input
                placeholder="Special instructions, access codes, etc."
                value={formData.notes}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                multiline
                numberOfLines={3}
                leftIcon="document-text-outline"
            />
        </Card>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Request Pickup</Text>
                <Text style={styles.subtitle}>
                    Fill out the form below to schedule your waste collection
                </Text>
            </View>

            {renderWasteTypeSelector()}
            {renderQuantityInput()}
            {renderTimeSlotSelector()}
            {renderUrgencySelector()}
            {renderContactInfo()}
            {renderNotesSection()}

            <View style={styles.submitSection}>
                <Button
                    title="Submit Request"
                    onPress={handleSubmit}
                    loading={loading}
                    size="large"
                    style={styles.submitButton}
                />
                <Text style={styles.submitNote}>
                    You'll receive a confirmation with your request ID and estimated cost
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    sectionCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        flex: 1,
    },
    required: {
        ...theme.typography.h4,
        color: theme.colors.error,
    },
    sectionDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginBottom: theme.spacing.sm,
    },
    // Waste Type Styles
    wasteTypeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    wasteTypeCard: {
        flex: 1,
        minWidth: '45%',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        position: 'relative',
    },
    wasteTypeCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    wasteTypeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    wasteTypeLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    wasteTypeLabelSelected: {
        color: theme.colors.primary,
    },
    wasteTypeDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 16,
    },
    selectedIndicator: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
    },
    // Bulk Toggle Styles
    bulkToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    bulkToggleActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    bulkToggleContent: {
        flex: 1,
    },
    bulkToggleLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    bulkToggleLabelActive: {
        color: theme.colors.primary,
    },
    bulkToggleDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
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
        gap: theme.spacing.sm,
    },
    timeSlotCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    timeSlotLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        flex: 1,
    },
    timeSlotLabelSelected: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    // Urgency Styles
    urgencyGrid: {
        gap: theme.spacing.sm,
    },
    urgencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        gap: theme.spacing.sm,
    },
    urgencyCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    urgencyIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    urgencyContent: {
        flex: 1,
    },
    urgencyLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    urgencyLabelSelected: {
        color: theme.colors.primary,
    },
    urgencyDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    // Contact Styles
    contactInput: {
        marginBottom: theme.spacing.md,
    },
    // Submit Styles
    submitSection: {
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    submitButton: {
        marginBottom: theme.spacing.md,
    },
    submitNote: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});