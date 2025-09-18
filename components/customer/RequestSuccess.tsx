import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from '../ui';

const { width } = Dimensions.get('window');

export interface RequestSuccessProps {
    visible: boolean;
    requestId: string;
    estimatedCost: number;
    onViewSchedule: () => void;
    onClose: () => void;
}

export const RequestSuccess: React.FC<RequestSuccessProps> = ({
    visible,
    requestId,
    estimatedCost,
    onViewSchedule,
    onClose,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const checkmarkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animate container
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Animate checkmark with delay
            setTimeout(() => {
                Animated.spring(checkmarkAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 6,
                    useNativeDriver: true,
                }).start();
            }, 200);
        } else {
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
            checkmarkAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: fadeAnim,
                }
            ]}
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                {/* Success Icon */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            transform: [{ scale: checkmarkAnim }],
                        }
                    ]}
                >
                    <View style={styles.iconBackground}>
                        <Ionicons name="checkmark" size={48} color={theme.colors.buttonText} />
                    </View>
                </Animated.View>

                {/* Success Message */}
                <View style={styles.content}>
                    <Text style={styles.title}>Request Submitted!</Text>
                    <Text style={styles.subtitle}>
                        Your pickup request has been successfully submitted
                    </Text>

                    {/* Request Details */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Request ID:</Text>
                            <Text style={styles.detailValue}>{requestId}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Estimated Cost:</Text>
                            <Text style={styles.detailValue}>${estimatedCost.toFixed(2)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status:</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending Review</Text>
                            </View>
                        </View>
                    </View>

                    {/* Next Steps */}
                    <View style={styles.nextSteps}>
                        <Text style={styles.nextStepsTitle}>What's Next?</Text>
                        <View style={styles.stepsList}>
                            <View style={styles.step}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>1</Text>
                                </View>
                                <Text style={styles.stepText}>
                                    We'll review your request within 2 hours
                                </Text>
                            </View>
                            <View style={styles.step}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>2</Text>
                                </View>
                                <Text style={styles.stepText}>
                                    You'll receive a confirmation email with pickup details
                                </Text>
                            </View>
                            <View style={styles.step}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>3</Text>
                                </View>
                                <Text style={styles.stepText}>
                                    Track your pickup in the Schedule tab
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Button
                            title="View Schedule"
                            onPress={onViewSchedule}
                            size="large"
                            style={styles.primaryButton}
                        />
                        <Button
                            title="Done"
                            onPress={onClose}
                            variant="outline"
                            size="large"
                            style={styles.secondaryButton}
                        />
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: width * 0.9,
        maxWidth: 400,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    iconContainer: {
        marginBottom: theme.spacing.lg,
    },
    iconBackground: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 24,
    },
    detailsCard: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    detailLabel: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
    },
    detailValue: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
    },
    statusBadge: {
        backgroundColor: theme.colors.warning + '20',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.caption,
        color: theme.colors.warning,
        fontWeight: '600',
    },
    nextSteps: {
        width: '100%',
        marginBottom: theme.spacing.xl,
    },
    nextStepsTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    stepsList: {
        gap: theme.spacing.md,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.md,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    stepNumberText: {
        ...theme.typography.caption,
        color: theme.colors.buttonText,
        fontWeight: '600',
    },
    stepText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    actions: {
        width: '100%',
        gap: theme.spacing.md,
    },
    primaryButton: {
        width: '100%',
    },
    secondaryButton: {
        width: '100%',
    },
});