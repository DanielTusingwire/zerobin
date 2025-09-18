import { RequestStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FeedbackForm, FeedbackItem, FeedbackSuccess } from '../../../components/customer';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { Button, Card } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useAppContext, useCustomerContext } from '../../../contexts';
import { Feedback, PickupRequest } from '../../../types/customer';

// Customer Feedback Screen - comprehensive feedback and rating system
export default function CustomerFeedbackScreen() {
    const { state: appState } = useAppContext();
    const { state: customerState, submitFeedback, loadFeedback } = useCustomerContext();

    const [refreshing, setRefreshing] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successRating, setSuccessRating] = useState(0);

    // Get completed pickups that don't have feedback yet
    const availableForFeedback = useMemo(() => {
        const completedPickups = customerState.pickupRequests.filter(
            pickup => pickup.status === RequestStatus.COMPLETED
        );

        const feedbackPickupIds = new Set(customerState.feedback.map(f => f.pickupId));

        return completedPickups.filter(pickup => !feedbackPickupIds.has(pickup.id));
    }, [customerState.pickupRequests, customerState.feedback]);

    // Calculate feedback statistics
    const feedbackStats = useMemo(() => {
        const feedback = customerState.feedback;
        if (feedback.length === 0) {
            return {
                averageRating: 0,
                totalFeedback: 0,
                recommendationRate: 0,
                categoryAverages: {
                    timeliness: 0,
                    professionalism: 0,
                    cleanliness: 0,
                    communication: 0,
                },
            };
        }

        const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
        const recommendations = feedback.filter(f => f.wouldRecommend).length;

        const categoryTotals = feedback.reduce(
            (acc, f) => ({
                timeliness: acc.timeliness + f.categories.timeliness,
                professionalism: acc.professionalism + f.categories.professionalism,
                cleanliness: acc.cleanliness + f.categories.cleanliness,
                communication: acc.communication + f.categories.communication,
            }),
            { timeliness: 0, professionalism: 0, cleanliness: 0, communication: 0 }
        );

        return {
            averageRating: totalRating / feedback.length,
            totalFeedback: feedback.length,
            recommendationRate: (recommendations / feedback.length) * 100,
            categoryAverages: {
                timeliness: categoryTotals.timeliness / feedback.length,
                professionalism: categoryTotals.professionalism / feedback.length,
                cleanliness: categoryTotals.cleanliness / feedback.length,
                communication: categoryTotals.communication / feedback.length,
            },
        };
    }, [customerState.feedback]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadFeedback();
        } catch (error) {
            console.error('Failed to refresh feedback:', error);
        } finally {
            setRefreshing(false);
        }
    }, [loadFeedback]);

    const handleStartFeedback = useCallback((pickup: PickupRequest) => {
        setSelectedPickup(pickup);
        setShowFeedbackForm(true);
    }, []);

    const handleSubmitFeedback = useCallback(async (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setSubmittingFeedback(true);
            await submitFeedback(feedbackData);

            setSuccessRating(feedbackData.rating);
            setShowFeedbackForm(false);
            setSelectedPickup(null);
            setShowSuccess(true);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            Alert.alert(
                'Submission Failed',
                'There was an error submitting your feedback. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setSubmittingFeedback(false);
        }
    }, [submitFeedback]);

    const handleFeedbackPress = useCallback((feedback: Feedback) => {
        // TODO: Navigate to detailed feedback view or allow editing
        Alert.alert(
            'Feedback Details',
            `Rating: ${feedback.rating}/5\nSubmitted: ${new Date(feedback.submittedAt).toLocaleDateString()}`,
            [{ text: 'OK' }]
        );
    }, []);

    const handleViewHistory = useCallback(() => {
        setShowSuccess(false);
        // Already showing history, just close the success modal
    }, []);

    const handleCloseSuccess = useCallback(() => {
        setShowSuccess(false);
    }, []);

    const renderFeedbackStats = () => (
        <Card style={styles.statsCard}>
            <View style={styles.statsHeader}>
                <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.statsTitle}>Your Feedback Summary</Text>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {feedbackStats.averageRating.toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>Avg Rating</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {feedbackStats.totalFeedback}
                    </Text>
                    <Text style={styles.statLabel}>Total Reviews</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {feedbackStats.recommendationRate.toFixed(0)}%
                    </Text>
                    <Text style={styles.statLabel}>Recommend</Text>
                </View>
            </View>
        </Card>
    );

    const renderAvailablePickups = () => {
        if (availableForFeedback.length === 0) return null;

        return (
            <Card style={styles.availableCard}>
                <View style={styles.availableHeader}>
                    <Ionicons name="star-outline" size={24} color={theme.colors.warning} />
                    <Text style={styles.availableTitle}>Rate Recent Pickups</Text>
                </View>
                <Text style={styles.availableDescription}>
                    Share your experience with these completed pickups
                </Text>

                <View style={styles.availableList}>
                    {availableForFeedback.slice(0, 3).map((pickup) => (
                        <TouchableOpacity
                            key={pickup.id}
                            style={styles.availableItem}
                            onPress={() => handleStartFeedback(pickup)}
                        >
                            <View style={styles.availableItemLeft}>
                                <Text style={styles.availableItemId}>#{pickup.id}</Text>
                                <Text style={styles.availableItemDate}>
                                    {new Date(pickup.completedDate || pickup.preferredDate).toLocaleDateString()}
                                </Text>
                                <Text style={styles.availableItemWaste}>
                                    {pickup.wasteType.join(', ')}
                                </Text>
                            </View>

                            <View style={styles.availableItemRight}>
                                <Button
                                    title="Rate"
                                    size="small"
                                    variant="outline"
                                    onPress={() => handleStartFeedback(pickup)}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {availableForFeedback.length > 3 && (
                    <Text style={styles.moreAvailable}>
                        +{availableForFeedback.length - 3} more pickup{availableForFeedback.length - 3 !== 1 ? 's' : ''} available for rating
                    </Text>
                )}
            </Card>
        );
    };

    const renderFeedbackItem = useCallback(({ item }: { item: Feedback }) => (
        <FeedbackItem
            feedback={item}
            onPress={handleFeedbackPress}
            showPickupInfo={true}
        />
    ), [handleFeedbackPress]);

    const renderEmptyState = () => (
        <EmptyState
            icon="star-outline"
            title="No Feedback Yet"
            message="Complete a pickup to leave your first review"
            actionTitle="View Schedule"
            onActionPress={() => router.push('/(tabs)/customer/schedule')}
        />
    );

    const renderHeader = () => (
        <View>
            {feedbackStats.totalFeedback > 0 && renderFeedbackStats()}
            {renderAvailablePickups()}

            {customerState.feedback.length > 0 && (
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Feedback History</Text>
                    <Text style={styles.historySubtitle}>
                        Your previous reviews and ratings
                    </Text>
                </View>
            )}
        </View>
    );

    if (customerState.feedbackLoading && !refreshing) {
        return (
            <View style={styles.container}>
                <Header title="Feedback" />
                <LoadingSpinner message="Loading your feedback..." />
            </View>
        );
    }

    if (showFeedbackForm && selectedPickup) {
        return (
            <View style={styles.container}>
                <Header
                    title="Rate Experience"
                    leftIcon="arrow-back"
                    onLeftPress={() => {
                        setShowFeedbackForm(false);
                        setSelectedPickup(null);
                    }}
                />
                <FeedbackForm
                    pickup={selectedPickup}
                    onSubmit={handleSubmitFeedback}
                    loading={submittingFeedback}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Feedback"
                subtitle={`${customerState.feedback.length} review${customerState.feedback.length !== 1 ? 's' : ''}`}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <FlatList
                data={customerState.feedback}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    customerState.feedback.length === 0 && styles.emptyListContent,
                ]}
            />

            <FeedbackSuccess
                visible={showSuccess}
                rating={successRating}
                onViewHistory={handleViewHistory}
                onClose={handleCloseSuccess}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        paddingBottom: theme.spacing.xl,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    statsCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.lg,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    statsTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    statLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    availableCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.lg,
    },
    availableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    availableTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    availableDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    availableList: {
        gap: theme.spacing.md,
    },
    availableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    availableItemLeft: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    availableItemId: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    availableItemDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    availableItemWaste: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        textTransform: 'capitalize',
    },
    availableItemRight: {
        marginLeft: theme.spacing.md,
    },
    moreAvailable: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
        fontStyle: 'italic',
    },
    historyHeader: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    historyTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    historySubtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
});