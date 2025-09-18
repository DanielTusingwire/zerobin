import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from '../ui';

export interface FeedbackSuccessProps {
    visible: boolean;
    rating: number;
    onViewHistory?: () => void;
    onClose: () => void;
}

const getRatingMessage = (rating: number): { title: string; message: string; icon: string; color: string } => {
    if (rating >= 5) {
        return {
            title: 'Excellent!',
            message: 'Thank you for the perfect rating! We\'re thrilled you had an excellent experience.',
            icon: 'star',
            color: theme.colors.success,
        };
    } else if (rating >= 4) {
        return {
            title: 'Great!',
            message: 'Thank you for the positive feedback! We\'re glad you had a great experience.',
            icon: 'thumbs-up',
            color: theme.colors.success,
        };
    } else if (rating >= 3) {
        return {
            title: 'Thank You!',
            message: 'Thank you for your feedback. We\'ll use it to improve our service.',
            icon: 'chatbubble',
            color: theme.colors.info,
        };
    } else {
        return {
            title: 'We\'ll Do Better',
            message: 'Thank you for your honest feedback. We\'re committed to improving your experience.',
            icon: 'construct',
            color: theme.colors.warning,
        };
    }
};

export const FeedbackSuccess: React.FC<FeedbackSuccessProps> = ({
    visible,
    rating,
    onViewHistory,
    onClose,
}) => {
    const ratingInfo = getRatingMessage(rating);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        {/* Success Icon */}
                        <View style={[
                            styles.iconContainer,
                            { backgroundColor: ratingInfo.color + '20' }
                        ]}>
                            <Ionicons
                                name={ratingInfo.icon as any}
                                size={48}
                                color={ratingInfo.color}
                            />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{ratingInfo.title}</Text>

                        {/* Message */}
                        <Text style={styles.message}>{ratingInfo.message}</Text>

                        {/* Rating Display */}
                        <View style={styles.ratingDisplay}>
                            <Text style={styles.ratingLabel}>Your Rating:</Text>
                            <View style={styles.starsContainer}>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <Ionicons
                                        key={index}
                                        name={index < rating ? 'star' : 'star-outline'}
                                        size={20}
                                        color={index < rating ? theme.colors.warning : theme.colors.border}
                                    />
                                ))}
                                <Text style={styles.ratingValue}>({rating}/5)</Text>
                            </View>
                        </View>

                        {/* Additional Info */}
                        <View style={styles.infoSection}>
                            <View style={styles.infoItem}>
                                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                                <Text style={styles.infoText}>
                                    Your feedback has been submitted
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="people" size={16} color={theme.colors.info} />
                                <Text style={styles.infoText}>
                                    Our team will review your comments
                                </Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
                                <Text style={styles.infoText}>
                                    Help us improve our service quality
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        {onViewHistory && (
                            <Button
                                title="View Feedback History"
                                onPress={onViewHistory}
                                variant="outline"
                                style={styles.actionButton}
                            />
                        )}

                        <Button
                            title="Done"
                            onPress={onClose}
                            style={styles.actionButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    container: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        width: '100%',
        maxWidth: 400,
        ...theme.shadows.lg,
    },
    content: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    message: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.lg,
    },
    ratingDisplay: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
    },
    ratingLabel: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    ratingValue: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.sm,
        fontWeight: '600',
    },
    infoSection: {
        width: '100%',
        gap: theme.spacing.sm,
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
    actions: {
        padding: theme.spacing.lg,
        paddingTop: 0,
        gap: theme.spacing.md,
    },
    actionButton: {
        width: '100%',
    },
});