import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Feedback } from '../../types/customer';
import { Badge, Card } from '../ui';
import { StarRating } from './StarRating';

export interface FeedbackItemProps {
    feedback: Feedback;
    onPress?: (feedback: Feedback) => void;
    showPickupInfo?: boolean;
}

const CATEGORY_ICONS = {
    timeliness: 'time-outline',
    professionalism: 'person-outline',
    cleanliness: 'sparkles-outline',
    communication: 'chatbubble-outline',
};

const CATEGORY_LABELS = {
    timeliness: 'Timeliness',
    professionalism: 'Professionalism',
    cleanliness: 'Cleanliness',
    communication: 'Communication',
};

export const FeedbackItem: React.FC<FeedbackItemProps> = ({
    feedback,
    onPress,
    showPickupInfo = true,
}) => {
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getOverallRatingColor = (rating: number): string => {
        if (rating >= 4.5) return theme.colors.success;
        if (rating >= 3.5) return theme.colors.warning;
        if (rating >= 2.5) return theme.colors.info;
        return theme.colors.error;
    };

    const renderCategoryRatings = () => {
        const categories = Object.entries(feedback.categories) as [keyof typeof feedback.categories, number][];

        return (
            <View style={styles.categoriesSection}>
                <Text style={styles.categoriesTitle}>Category Ratings</Text>
                <View style={styles.categoriesGrid}>
                    {categories.map(([category, rating]) => (
                        <View key={category} style={styles.categoryItem}>
                            <View style={styles.categoryHeader}>
                                <Ionicons
                                    name={CATEGORY_ICONS[category] as any}
                                    size={14}
                                    color={theme.colors.primary}
                                />
                                <Text style={styles.categoryLabel}>
                                    {CATEGORY_LABELS[category]}
                                </Text>
                            </View>
                            <StarRating
                                rating={rating}
                                size="small"
                                readonly
                            />
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <Card style={styles.container}>
            <TouchableOpacity
                style={styles.content}
                onPress={() => onPress?.(feedback)}
                activeOpacity={onPress ? 0.7 : 1}
                disabled={!onPress}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[
                            styles.ratingIndicator,
                            { backgroundColor: getOverallRatingColor(feedback.rating) + '20' }
                        ]}>
                            <Ionicons
                                name="star"
                                size={16}
                                color={getOverallRatingColor(feedback.rating)}
                            />
                            <Text style={[
                                styles.ratingValue,
                                { color: getOverallRatingColor(feedback.rating) }
                            ]}>
                                {feedback.rating}
                            </Text>
                        </View>

                        <View style={styles.headerInfo}>
                            <Text style={styles.feedbackId}>Feedback #{feedback.id}</Text>
                            <Text style={styles.submittedDate}>
                                {formatDate(feedback.submittedAt)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        {feedback.wouldRecommend && (
                            <Badge
                                text="Recommends"
                                variant="success"
                                style={styles.recommendBadge}
                            />
                        )}
                        {feedback.followUpRequired && (
                            <Badge
                                text="Follow-up"
                                variant="warning"
                                style={styles.followUpBadge}
                            />
                        )}
                    </View>
                </View>

                {/* Pickup Info */}
                {showPickupInfo && (
                    <View style={styles.pickupInfo}>
                        <View style={styles.pickupInfoItem}>
                            <Ionicons name="receipt-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.pickupInfoText}>
                                Pickup #{feedback.pickupId}
                            </Text>
                        </View>

                        <View style={styles.pickupInfoItem}>
                            <Ionicons name="person-outline" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.pickupInfoText}>
                                Driver ID: {feedback.driverId}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Overall Rating */}
                <View style={styles.overallRating}>
                    <Text style={styles.overallRatingLabel}>Overall Experience</Text>
                    <StarRating
                        rating={feedback.rating}
                        size="medium"
                        readonly
                        showLabel
                    />
                </View>

                {/* Category Ratings */}
                {renderCategoryRatings()}

                {/* Comments */}
                {feedback.comments && (
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Comments</Text>
                        <Text style={styles.commentsText} numberOfLines={3}>
                            {feedback.comments}
                        </Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        {feedback.wouldRecommend && (
                            <View style={styles.recommendInfo}>
                                <Ionicons name="thumbs-up" size={14} color={theme.colors.success} />
                                <Text style={styles.recommendText}>
                                    Would recommend service
                                </Text>
                            </View>
                        )}
                    </View>

                    {onPress && (
                        <View style={styles.footerRight}>
                            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
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
    ratingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.round,
        gap: theme.spacing.xs,
    },
    ratingValue: {
        ...theme.typography.caption,
        fontWeight: '700',
    },
    headerInfo: {
        flex: 1,
    },
    feedbackId: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    submittedDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    headerRight: {
        alignItems: 'flex-end',
        gap: theme.spacing.xs,
    },
    recommendBadge: {
        alignSelf: 'flex-end',
    },
    followUpBadge: {
        alignSelf: 'flex-end',
    },
    pickupInfo: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
    },
    pickupInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    pickupInfoText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    overallRating: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    overallRatingLabel: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    categoriesSection: {
        marginBottom: theme.spacing.lg,
    },
    categoriesTitle: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    categoryItem: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    categoryLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    commentsSection: {
        marginBottom: theme.spacing.md,
    },
    commentsTitle: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    commentsText: {
        ...theme.typography.body2,
        color: theme.colors.text,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flex: 1,
    },
    recommendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    recommendText: {
        ...theme.typography.caption,
        color: theme.colors.success,
        fontWeight: '600',
    },
    footerRight: {
        padding: theme.spacing.xs,
    },
});