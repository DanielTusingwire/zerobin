import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { WasteType } from '../../types/common';
import { WasteTip } from '../../types/customer';
import { Badge, Button } from '../ui';

export interface TipDetailProps {
    tip: WasteTip | null;
    visible: boolean;
    onClose: () => void;
    onHelpful?: (tip: WasteTip) => void;
    onNotHelpful?: (tip: WasteTip) => void;
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
        description: 'Easy to follow, no special knowledge required',
    },
    intermediate: {
        label: 'Intermediate',
        color: theme.colors.warning,
        icon: 'help-circle-outline',
        description: 'Some experience with waste sorting helpful',
    },
    advanced: {
        label: 'Advanced',
        color: theme.colors.error,
        icon: 'alert-circle-outline',
        description: 'Requires careful attention and specific knowledge',
    },
};

export const TipDetail: React.FC<TipDetailProps> = ({
    tip,
    visible,
    onClose,
    onHelpful,
    onNotHelpful,
}) => {
    if (!tip) return null;

    const wasteTypeColor = WASTE_TYPE_COLORS[tip.category];
    const wasteTypeIcon = WASTE_TYPE_ICONS[tip.category];
    const difficultyConfig = DIFFICULTY_CONFIG[tip.difficulty];

    const formatLastUpdated = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const helpfulPercentage = tip.helpful + tip.notHelpful > 0
        ? Math.round((tip.helpful / (tip.helpful + tip.notHelpful)) * 100)
        : 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Waste Sorting Tip</Text>
                    </View>

                    <View style={styles.headerRight}>
                        {tip.isLocal && (
                            <Badge
                                text="Local"
                                variant="info"
                                style={styles.localBadge}
                            />
                        )}
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Image */}
                    {tip.imageUrl && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: tip.imageUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <View style={styles.imageOverlay}>
                                <View style={styles.readTime}>
                                    <Ionicons name="time-outline" size={14} color={theme.colors.background} />
                                    <Text style={styles.readTimeText}>
                                        {tip.estimatedReadTime} min read
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Title and Category */}
                    <View style={styles.titleSection}>
                        <View style={styles.categoryHeader}>
                            <View style={[styles.categoryIcon, { backgroundColor: wasteTypeColor + '20' }]}>
                                <Ionicons
                                    name={wasteTypeIcon as any}
                                    size={24}
                                    color={wasteTypeColor}
                                />
                            </View>
                            <Badge
                                text={tip.category}
                                style={[styles.categoryBadge, { backgroundColor: wasteTypeColor + '20' }]}
                                textStyle={{ color: wasteTypeColor }}
                            />
                        </View>

                        <Text style={styles.title}>{tip.title}</Text>
                    </View>

                    {/* Difficulty and Stats */}
                    <View style={styles.metaSection}>
                        <View style={styles.difficultyContainer}>
                            <View style={[styles.difficultyIcon, { backgroundColor: difficultyConfig.color + '20' }]}>
                                <Ionicons
                                    name={difficultyConfig.icon as any}
                                    size={16}
                                    color={difficultyConfig.color}
                                />
                            </View>
                            <View style={styles.difficultyInfo}>
                                <Text style={[styles.difficultyLabel, { color: difficultyConfig.color }]}>
                                    {difficultyConfig.label}
                                </Text>
                                <Text style={styles.difficultyDescription}>
                                    {difficultyConfig.description}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.statText}>{tip.views} views</Text>
                            </View>

                            {helpfulPercentage > 0 && (
                                <View style={styles.statItem}>
                                    <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.success} />
                                    <Text style={styles.statText}>{helpfulPercentage}% found helpful</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Instructions</Text>
                        <Text style={styles.description}>{tip.description}</Text>
                    </View>

                    {/* Tags */}
                    {tip.tags.length > 0 && (
                        <View style={styles.tagsSection}>
                            <Text style={styles.sectionTitle}>Related Topics</Text>
                            <View style={styles.tags}>
                                {tip.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>#{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Additional Info */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Additional Information</Text>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.infoText}>
                                    Last updated: {formatLastUpdated(tip.lastUpdated)}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.infoText}>
                                    {tip.isLocal ? 'Local recycling guidelines' : 'General guidelines'}
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="book-outline" size={16} color={theme.colors.textSecondary} />
                                <Text style={styles.infoText}>
                                    Difficulty: {difficultyConfig.label}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Helpful Section */}
                    {(onHelpful || onNotHelpful) && (
                        <View style={styles.helpfulSection}>
                            <Text style={styles.sectionTitle}>Was this helpful?</Text>
                            <Text style={styles.helpfulDescription}>
                                Your feedback helps us improve our tips and create better content.
                            </Text>

                            <View style={styles.helpfulButtons}>
                                {onHelpful && (
                                    <Button
                                        title={`Yes, helpful (${tip.helpful})`}
                                        onPress={() => onHelpful(tip)}
                                        variant="outline"
                                        style={[styles.helpfulButton, styles.yesButton]}
                                        leftIcon="thumbs-up-outline"
                                    />
                                )}

                                {onNotHelpful && (
                                    <Button
                                        title={`Not helpful (${tip.notHelpful})`}
                                        onPress={() => onNotHelpful(tip)}
                                        variant="outline"
                                        style={[styles.helpfulButton, styles.noButton]}
                                        leftIcon="thumbs-down-outline"
                                    />
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal >
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    closeButton: {
        padding: theme.spacing.sm,
        marginLeft: -theme.spacing.sm,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    headerRight: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    localBadge: {
        alignSelf: 'flex-end',
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        backgroundColor: theme.colors.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
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
    titleSection: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        fontWeight: '600',
        lineHeight: 32,
    },
    metaSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    difficultyContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
    },
    difficultyIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    difficultyInfo: {
        flex: 1,
    },
    difficultyLabel: {
        ...theme.typography.body1,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    difficultyDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    statText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    descriptionSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
    },
    description: {
        ...theme.typography.body1,
        color: theme.colors.text,
        lineHeight: 24,
    },
    tagsSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    tag: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.md,
    },
    tagText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    infoSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    infoGrid: {
        gap: theme.spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    infoText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    helpfulSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.lg,
    },
    helpfulDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: theme.spacing.lg,
    },
    helpfulButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    helpfulButton: {
        flex: 1,
    },
    yesButton: {
        borderColor: theme.colors.success,
    },
    noButton: {
        borderColor: theme.colors.error,
    },
});