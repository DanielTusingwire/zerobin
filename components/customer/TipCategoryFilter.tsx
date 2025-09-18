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
import { WasteType } from '../../types/common';
import { TipCategory } from '../../types/customer';

export interface TipCategoryFilterProps {
    categories: TipCategory[];
    selectedCategory: WasteType | 'all';
    onCategoryChange: (category: WasteType | 'all') => void;
    tipCounts: {
        all: number;
        [WasteType.GENERAL]: number;
        [WasteType.RECYCLABLE]: number;
        [WasteType.ORGANIC]: number;
        [WasteType.HAZARDOUS]: number;
    };
}

const ALL_CATEGORY = {
    id: 'all',
    name: 'All Tips',
    wasteType: 'all' as const,
    description: 'View all waste sorting tips',
    iconName: 'list-outline',
    color: theme.colors.textSecondary,
    tipCount: 0,
};

const WASTE_TYPE_COLORS = {
    [WasteType.GENERAL]: theme.colors.wasteGeneral,
    [WasteType.RECYCLABLE]: theme.colors.wasteRecyclable,
    [WasteType.ORGANIC]: theme.colors.wasteOrganic,
    [WasteType.HAZARDOUS]: theme.colors.wasteHazardous,
};

export const TipCategoryFilter: React.FC<TipCategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
    tipCounts,
}) => {
    const allCategories = [
        { ...ALL_CATEGORY, tipCount: tipCounts.all },
        ...categories,
    ];

    const renderCategoryCard = (category: typeof allCategories[0]) => {
        const isSelected = selectedCategory === category.wasteType;
        const count = category.wasteType === 'all'
            ? tipCounts.all
            : tipCounts[category.wasteType as WasteType] || 0;

        const color = category.wasteType === 'all'
            ? theme.colors.textSecondary
            : WASTE_TYPE_COLORS[category.wasteType as WasteType];

        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.categoryCard,
                    isSelected && styles.categoryCardSelected,
                    isSelected && { borderColor: color },
                ]}
                onPress={() => onCategoryChange(category.wasteType)}
            >
                <View style={[
                    styles.categoryIcon,
                    { backgroundColor: color + '20' },
                    isSelected && { backgroundColor: color + '30' },
                ]}>
                    <Ionicons
                        name={category.iconName as any}
                        size={24}
                        color={color}
                    />
                </View>

                <View style={styles.categoryInfo}>
                    <Text style={[
                        styles.categoryName,
                        isSelected && styles.categoryNameSelected,
                        isSelected && { color: color },
                    ]}>
                        {category.name}
                    </Text>

                    <Text style={styles.categoryDescription} numberOfLines={2}>
                        {category.description}
                    </Text>

                    <View style={styles.categoryStats}>
                        <View style={[
                            styles.tipCount,
                            isSelected && { backgroundColor: color },
                        ]}>
                            <Text style={[
                                styles.tipCountText,
                                isSelected && { color: theme.colors.background },
                            ]}>
                                {count} tip{count !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                </View>

                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color={color} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Browse by Category</Text>
                <Text style={styles.subtitle}>
                    Choose a waste type to see specific sorting tips
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {allCategories.map(renderCategoryCard)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    title: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    categoriesContainer: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.md,
    },
    categoryCard: {
        width: 160,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        position: 'relative',
        ...theme.shadows.sm,
    },
    categoryCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
        ...theme.shadows.md,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    categoryInfo: {
        flex: 1,
        gap: theme.spacing.sm,
    },
    categoryName: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    categoryNameSelected: {
        color: theme.colors.primary,
    },
    categoryDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 16,
        marginBottom: theme.spacing.sm,
    },
    categoryStats: {
        marginTop: 'auto',
    },
    tipCount: {
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.textSecondary + '20',
        borderRadius: theme.borderRadius.round,
    },
    tipCountText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 10,
    },
    selectedIndicator: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
    },
});