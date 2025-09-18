import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { WasteType } from '../../types/common';
import { WasteTip } from '../../types/customer';
import { Badge, Card } from '../ui';

export interface TipCardProps {
    tip: WasteTip;
    onPress?: (tip: WasteTip) => void;
    onHelpful?: (tip: WasteTip) => void;
    onNotHelpful?: (tip: WasteTip) => void;
    compact?: boolean;
}

const WASTE_TYPE_COLORS = {
    [WasteType.GENERAL]: theme.colors.wasteGeneral,
    [WasteType.RECYCLABLE]: theme.colors.wasteRecyclable,
    [WasteType.ORGANIC]: theme.colors.wasteOrganic,
    [WasteType.HAZARDOUS]: theme.colors.wasteHazardous,
};

const WASTE_TYPE_ICONS = {
    [WasteType.GENERAL]: 'trash-outline',
    [WasteType.RECYCLABLE]: 'refresh-outline',
    [WasteType.ORGANIC]: 'leaf-outline',
    [WasteType.HAZARDOUS]: 'warning-outline',
};

const DIFFICULTY_CONFIG = {
    beginner: {
        label: 'Beginner',
        color: theme.colors.success,
        icon: 'checkmark-circle-outline',
    },
    intermediate: {
        label: 'Intermediate',
        color: theme.colors.warning,
        icon: 'help-circle-outline',
    },
    advanced: {
        label: 'Advanced',
        color: theme.colors.error,
        icon: 'alert-circle-outline',
    },
};

export const TipCard: React.FC<TipCardProps> = ({
    tip,
    onPress,
    onHelpful,
    onNotHelpful,
    compact = false,
}) => {
    const wasteTypeColor = WASTE_TYPE_COLORS[tip.category];
    const wasteTypeIcon = WASTE_TYPE_ICONS[tip.category];
    const difficultyConfig = DIFFICULTY_CONFIG[tip.difficulty];

    const formatLastUpdated = (date: Date): string => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Updated yesterday';
        if (diffDays < 7) return `Updated ${diffDays} days ago`;
        if (diffDays < 30) return `Updated ${Math.ceil(diffDays / 7)} weeks ago`;
        return `Updated ${Math.ceil(diffDays / 30)} months ago`;
    };

    const helpfulPercentage = tip.helpful + tip.notHelpful > 0
        ? Math.round((tip.helpful / (tip.helpful + tip.notHelpful)) * 100)
        : 0;

    return (
        <Card style={StyleSheet.flatten([styles.container, compact && styles.compactContainer])}>
            <TouchableOpacity
                style={styles.content}
                onPress={() => onPress?.(tip)}
                activeOpacity={onPress ? 0.7 : 1}
                disabled={!onPress}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.categoryIcon, { backgroundColor: wasteTypeColor + '20' }]}>
                            <Ionicons
                                name={wasteTypeIcon as any}
                                size={20}
                                color={wasteTypeColor}
                            />
                        </View>

                        <View style={styles.headerInfo}>
                            <Text style={styles.title} numberOfLines={compact ? 2 : 3}>
                                {tip.title}
                            </Text>
                            <View style={styles.metadata}>
                                <Badge
                                    text={tip.category}
                                    style={StyleSheet.flatten([styles.categoryBadge, { backgroundColor: wasteTypeColor + '20' }])}
                                    textStyle={{ color: wasteTypeColor }}
                                />
                                {tip.isLocal && (
                                    <Badge
                                        text="Local"
                                        variant="info"
                                        style={styles.localBadge}
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <Badge
                            text={difficultyConfig.label}
                            style={StyleSheet.flatten([styles.difficultyBadge, { backgroundColor: difficultyConfig.color + '20' }])}
                            textStyle={{ color: difficultyConfig.color }}
                        />
                    </View>
                </View>

                {/* Image */}
                {tip.imageUrl && !compact && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: tip.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay}>
                            <View style={styles.readTime}>
                                <Ionicons name="time-outline" size={12} color={theme.colors.background} />
                                <Text style={styles.readTimeText}>
                                    {tip.estimatedReadTime} min read
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text
                        style={styles.description}
                        numberOfLines={compact ? 2 : 4}
                    >
                        {tip.description}
                    </Text>
                </View>

                {/* Tags */}
                {tip.tags.length > 0 && !compact && (
                    <View style={styles.tagsContainer}>
                        <View style={styles.tags}>
                            {tip.tags.slice(0, 3).map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>#{tag}</Text>
                                </View>
                            ))}
                            {tip.tags.length > 3 && (
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>+{tip.tags.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statsLeft}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.statText}>{tip.views}</Text>
                        </View>

                        {helpfulPercentage > 0 && (
                            <View style={styles.statItem}>
                                <Ionicons name="thumbs-up-outline" size={14} color={theme.colors.success} />
                                <Text style={styles.statText}>{helpfulPercentage}% helpful</Text>
                            </View>
                        )}

                        <Text style={styles.lastUpdated}>
                            {formatLastUpdated(tip.lastUpdated)}
                        </Text>
                    </View>

                    {onPress && (
                        <View style={styles.statsRight}>
                            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* Action Buttons */}
            {(onHelpful || onNotHelpful) && !compact && (
                <View style={styles.actions}>
                    <Text style={styles.actionsLabel}>Was this helpful?</Text>
                    <View style={styles.actionButtons}>
                        {onHelpful && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.helpfulButton]}
                                onPress={() => onHelpful(tip)}
                            >
                                <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.success} />
                                <Text style={[styles.actionButtonText, { color: theme.colors.success }]}>
                                    Yes ({tip.helpful})
                                </Text>
                            </TouchableOpacity>
                        )}

                        {onNotHelpful && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.notHelpfulButton]}
                                onPress={() => onNotHelpful(tip)}
                            >
                                <Ionicons name="thumbs-down-outline" size={16} color={theme.colors.error} />
                                <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
                                    No ({tip.notHelpful})
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
    compactContainer: {
        margin: theme.spacing.sm,
        marginTop: 0,
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
        alignItems: 'flex-start',
        flex: 1,
        gap: theme.spacing.sm,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        gap: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        lineHeight: 22,
    },
    metadata: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        flexWrap: 'wrap',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
    },
    localBadge: {
        alignSelf: 'flex-start',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    difficultyBadge: {
        alignSelf: 'flex-end',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160,
        backgroundColor: theme.colors.surface,
    },
    imageOverlay: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
    },
    readTime: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: theme.borderRadius.round,
        gap: theme.spacing.xs,
    },
    readTimeText: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
    },
    descriptionContainer: {
        marginBottom: theme.spacing.md,
    },
    description: {
        ...theme.typography.body2,
        color: theme.colors.text,
        lineHeight: 20,
    },
    tagsContainer: {
        marginBottom: theme.spacing.md,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    tag: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.sm,
    },
    tagText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        flex: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    statText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    lastUpdated: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    statsRight: {
        padding: theme.spacing.xs,
    },
    actions: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    actionsLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
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
    helpfulButton: {
        borderColor: theme.colors.success + '40',
        backgroundColor: theme.colors.success + '10',
    },
    notHelpfulButton: {
        borderColor: theme.colors.error + '40',
        backgroundColor: theme.colors.error + '10',
    },
    actionButtonText: {
        ...theme.typography.body2,
        fontWeight: '600',
    },
});