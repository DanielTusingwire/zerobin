import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { WasteType } from '../../types/common';

export interface WasteTypeSelectorProps {
    selectedTypes: WasteType[];
    onSelectionChange: (types: WasteType[]) => void;
    error?: string;
}

const WASTE_TYPE_OPTIONS = [
    {
        type: WasteType.GENERAL,
        label: 'General Waste',
        description: 'Non-recyclable household/office waste',
        icon: 'trash-outline',
        color: theme.colors.wasteGeneral,
        examples: ['Food packaging', 'Tissues', 'Broken items'],
    },
    {
        type: WasteType.RECYCLABLE,
        label: 'Recyclables',
        description: 'Paper, plastic, glass, metal',
        icon: 'refresh-outline',
        color: theme.colors.wasteRecyclable,
        examples: ['Bottles', 'Cans', 'Newspapers'],
    },
    {
        type: WasteType.ORGANIC,
        label: 'Organic Waste',
        description: 'Food scraps, garden waste',
        icon: 'leaf-outline',
        color: theme.colors.wasteOrganic,
        examples: ['Food scraps', 'Yard trimmings', 'Compostables'],
    },
    {
        type: WasteType.HAZARDOUS,
        label: 'Hazardous Waste',
        description: 'Chemicals, batteries, electronics',
        icon: 'warning-outline',
        color: theme.colors.wasteHazardous,
        examples: ['Batteries', 'Paint', 'Electronics'],
    },
];

export const WasteTypeSelector: React.FC<WasteTypeSelectorProps> = ({
    selectedTypes,
    onSelectionChange,
    error,
}) => {
    const toggleWasteType = (wasteType: WasteType) => {
        const newSelection = selectedTypes.includes(wasteType)
            ? selectedTypes.filter(type => type !== wasteType)
            : [...selectedTypes, wasteType];
        onSelectionChange(newSelection);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="layers-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.title}>Waste Types</Text>
                <Text style={styles.required}>*</Text>
            </View>

            <Text style={styles.description}>
                Select all types of waste you need collected
            </Text>

            {error && (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.grid}>
                {WASTE_TYPE_OPTIONS.map((option) => {
                    const isSelected = selectedTypes.includes(option.type);
                    return (
                        <TouchableOpacity
                            key={option.type}
                            style={[
                                styles.card,
                                isSelected && styles.cardSelected,
                                { borderColor: isSelected ? option.color : theme.colors.border },
                            ]}
                            onPress={() => toggleWasteType(option.type)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={28}
                                    color={option.color}
                                />
                            </View>

                            <View style={styles.content}>
                                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                                    {option.label}
                                </Text>
                                <Text style={styles.cardDescription}>
                                    {option.description}
                                </Text>
                                <View style={styles.examples}>
                                    {option.examples.slice(0, 2).map((example, index) => (
                                        <Text key={index} style={styles.example}>
                                            • {example}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            {isSelected && (
                                <View style={styles.selectedIndicator}>
                                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedTypes.length > 0 && (
                <View style={styles.summary}>
                    <Text style={styles.summaryText}>
                        Selected: {selectedTypes.length} waste type{selectedTypes.length > 1 ? 's' : ''}
                    </Text>
                </View>
            )}
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
    required: {
        ...theme.typography.h4,
        color: theme.colors.error,
    },
    description: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    card: {
        flex: 1,
        minWidth: '45%',
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        position: 'relative',
        ...theme.shadows.sm,
    },
    cardSelected: {
        backgroundColor: theme.colors.primary + '08',
        borderColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    content: {
        flex: 1,
    },
    label: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    labelSelected: {
        color: theme.colors.primary,
    },
    cardDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        lineHeight: 16,
    },
    examples: {
        gap: theme.spacing.xs,
    },
    example: {
        ...theme.typography.caption,
        color: theme.colors.textLight,
        fontSize: 10,
    },
    selectedIndicator: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
    },
    summary: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary + '30',
    },
    summaryText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
});