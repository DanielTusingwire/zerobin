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
import { Feedback, PickupRequest } from '../../types/customer';
import { Button, Card, Input } from '../ui';
import { StarRating } from './StarRating';

export interface FeedbackFormProps {
    pickup: PickupRequest;
    onSubmit: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => void;
    loading?: boolean;
}

interface FeedbackData {
    rating: number;
    comments: string;
    categories: {
        timeliness: number;
        professionalism: number;
        cleanliness: number;
        communication: number;
    };
    wouldRecommend: boolean;
    followUpRequired: boolean;
}

const CATEGORY_INFO = [
    {
        key: 'timeliness' as const,
        label: 'Timeliness',
        description: 'Arrived on time and completed work promptly',
        icon: 'time-outline',
    },
    {
        key: 'professionalism' as const,
        label: 'Professionalism',
        description: 'Courteous, respectful, and professional behavior',
        icon: 'person-outline',
    },
    {
        key: 'cleanliness' as const,
        label: 'Cleanliness',
        description: 'Left the area clean and tidy after pickup',
        icon: 'sparkles-outline',
    },
    {
        key: 'communication' as const,
        label: 'Communication',
        description: 'Clear communication and updates throughout',
        icon: 'chatbubble-outline',
    },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
    pickup,
    onSubmit,
    loading = false,
}) => {
    const [formData, setFormData] = useState<FeedbackData>({
        rating: 0,
        comments: '',
        categories: {
            timeliness: 0,
            professionalism: 0,
            cleanliness: 0,
            communication: 0,
        },
        wouldRecommend: false,
        followUpRequired: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (formData.rating === 0) {
            newErrors.rating = 'Please provide an overall rating';
        }

        // Check if at least one category is rated
        const categoryRatings = Object.values(formData.categories);
        if (categoryRatings.every(rating => rating === 0)) {
            newErrors.categories = 'Please rate at least one category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please complete all required fields.');
            return;
        }

        const feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'> = {
            customerId: pickup.customerId,
            jobId: pickup.id, // Using pickup ID as job ID for now
            pickupId: pickup.id,
            driverId: pickup.assignedDriverId || 'unknown',
            rating: formData.rating,
            comments: formData.comments.trim() || undefined,
            submittedAt: new Date(),
            categories: formData.categories,
            wouldRecommend: formData.wouldRecommend,
            followUpRequired: formData.followUpRequired,
        };

        onSubmit(feedback);
    };

    const updateCategoryRating = (category: keyof FeedbackData['categories'], rating: number) => {
        setFormData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [category]: rating,
            },
        }));

        // Clear category error when user makes a selection
        if (errors.categories) {
            setErrors(prev => {
                const { categories, ...rest } = prev;
                return rest;
            });
        }
    };

    const renderPickupSummary = () => (
        <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.summaryTitle}>Pickup Summary</Text>
            </View>

            <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pickup ID:</Text>
                    <Text style={styles.summaryValue}>#{pickup.id}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date:</Text>
                    <Text style={styles.summaryValue}>
                        {new Date(pickup.completedDate || pickup.preferredDate).toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Waste Types:</Text>
                    <Text style={styles.summaryValue}>
                        {pickup.wasteType.join(', ')}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Quantity:</Text>
                    <Text style={styles.summaryValue}>
                        {pickup.quantity} {pickup.quantity === 1 ? 'unit' : 'units'}
                    </Text>
                </View>

                {pickup.actualCost && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Cost:</Text>
                        <Text style={styles.summaryValue}>
                            ${pickup.actualCost.toFixed(2)}
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );

    const renderOverallRating = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Overall Rating</Text>
                <Text style={styles.required}>*</Text>
            </View>
            <Text style={styles.sectionDescription}>
                How would you rate your overall experience?
            </Text>

            {errors.rating && (
                <Text style={styles.errorText}>{errors.rating}</Text>
            )}

            <View style={styles.ratingContainer}>
                <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) => {
                        setFormData(prev => ({ ...prev, rating }));
                        if (errors.rating) {
                            setErrors(prev => {
                                const { rating, ...rest } = prev;
                                return rest;
                            });
                        }
                    }}
                    size="large"
                    showLabel
                />
            </View>
        </Card>
    );

    const renderCategoryRatings = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="list-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Detailed Ratings</Text>
                <Text style={styles.required}>*</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Rate specific aspects of the service
            </Text>

            {errors.categories && (
                <Text style={styles.errorText}>{errors.categories}</Text>
            )}

            <View style={styles.categoriesContainer}>
                {CATEGORY_INFO.map((category) => (
                    <View key={category.key} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                            <View style={styles.categoryIcon}>
                                <Ionicons
                                    name={category.icon as any}
                                    size={20}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryLabel}>{category.label}</Text>
                                <Text style={styles.categoryDescription}>
                                    {category.description}
                                </Text>
                            </View>
                        </View>

                        <StarRating
                            rating={formData.categories[category.key]}
                            onRatingChange={(rating) => updateCategoryRating(category.key, rating)}
                            size="medium"
                        />
                    </View>
                ))}
            </View>
        </Card>
    );

    const renderComments = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="chatbubble-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Comments</Text>
            </View>
            <Text style={styles.sectionDescription}>
                Share any additional feedback or suggestions (optional)
            </Text>

            <Input
                placeholder="Tell us about your experience..."
                value={formData.comments}
                onChangeText={(text) => setFormData(prev => ({ ...prev, comments: text }))}
                multiline
                numberOfLines={4}
                leftIcon="document-text-outline"
                style={styles.commentsInput}
            />
        </Card>
    );

    const renderAdditionalQuestions = () => (
        <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Additional Questions</Text>
            </View>

            <View style={styles.questionsContainer}>
                <TouchableOpacity
                    style={StyleSheet.flatten([
                        styles.questionItem,
                        formData.wouldRecommend && styles.questionItemSelected,
                    ])}
                    onPress={() => setFormData(prev => ({ ...prev, wouldRecommend: !prev.wouldRecommend }))}
                >
                    <Ionicons
                        name={formData.wouldRecommend ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={formData.wouldRecommend ? theme.colors.primary : theme.colors.textSecondary}
                    />
                    <View style={styles.questionContent}>
                        <Text style={StyleSheet.flatten([
                            styles.questionLabel,
                            formData.wouldRecommend && styles.questionLabelSelected,
                        ])}>
                            Would you recommend our service?
                        </Text>
                        <Text style={styles.questionDescription}>
                            Help others discover our waste collection service
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={StyleSheet.flatten([
                        styles.questionItem,
                        formData.followUpRequired && styles.questionItemSelected,
                    ])}
                    onPress={() => setFormData(prev => ({ ...prev, followUpRequired: !prev.followUpRequired }))}
                >
                    <Ionicons
                        name={formData.followUpRequired ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={formData.followUpRequired ? theme.colors.primary : theme.colors.textSecondary}
                    />
                    <View style={styles.questionContent}>
                        <Text style={StyleSheet.flatten([
                            styles.questionLabel,
                            formData.followUpRequired && styles.questionLabelSelected,
                        ])}>
                            Do you need follow-up contact?
                        </Text>
                        <Text style={styles.questionDescription}>
                            Check if you need us to contact you about this pickup
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Rate Your Experience</Text>
                <Text style={styles.subtitle}>
                    Your feedback helps us improve our service
                </Text>
            </View>

            {renderPickupSummary()}
            {renderOverallRating()}
            {renderCategoryRatings()}
            {renderComments()}
            {renderAdditionalQuestions()}

            <View style={styles.submitSection}>
                <Button
                    title="Submit Feedback"
                    onPress={handleSubmit}
                    loading={loading}
                    size="large"
                    style={styles.submitButton}
                />
                <Text style={styles.submitNote}>
                    Thank you for taking the time to provide feedback!
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
    summaryCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.lg,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    summaryTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    summaryContent: {
        gap: theme.spacing.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    summaryValue: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
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
    ratingContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    categoriesContainer: {
        gap: theme.spacing.lg,
    },
    categoryItem: {
        gap: theme.spacing.md,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryInfo: {
        flex: 1,
    },
    categoryLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    categoryDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 16,
    },
    commentsInput: {
        minHeight: 100,
    },
    questionsContainer: {
        gap: theme.spacing.md,
    },
    questionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.sm,
    },
    questionItemSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10',
    },
    questionContent: {
        flex: 1,
    },
    questionLabel: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    questionLabelSelected: {
        color: theme.colors.primary,
    },
    questionDescription: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 16,
    },
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