import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { ContentAdaptationContext } from './InteractiveBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AdaptiveContentProps {
    context: ContentAdaptationContext;
    title?: string;
    children?: React.ReactNode;
    showExamples?: boolean;
}

/**
 * AdaptiveContent - A component that demonstrates content adaptation
 * Features:
 * - Responsive layout based on modal height
 * - Adaptive typography and spacing
 * - Conditional content rendering
 * - Smooth transitions between modes
 * - Scroll behavior management
 */
export const AdaptiveContent: React.FC<AdaptiveContentProps> = ({
    context,
    title = "Adaptive Content Demo",
    children,
    showExamples = true,
}) => {
    const {
        currentMode,
        adaptiveStyles,
        shouldShowHeader,
        shouldShowFooter,
        maxContentHeight,
        scrollEnabled,
        isCompact,
        isStandard,
        isExpanded,
        isTransitioning,
        transitionProgress,
        dragProgress,
        availableHeight,
    } = context;

    // Animated styles based on context
    const animatedHeaderStyle = useAnimatedStyle(() => {
        const opacity = shouldShowHeader ? 1 : 0;
        const scale = interpolate(
            adaptiveStyles.fontSize,
            [0.9, 1.0, 1.1],
            [0.95, 1.0, 1.05]
        );

        return {
            opacity: withTiming(opacity, { duration: 200 }),
            transform: [{ scale: withTiming(scale, { duration: 200 }) }],
        };
    });

    const animatedContentStyle = useAnimatedStyle(() => {
        return {
            paddingHorizontal: withTiming(adaptiveStyles.padding, { duration: 200 }),
            paddingVertical: withTiming(adaptiveStyles.padding * 0.75, { duration: 200 }),
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            fontSize: withTiming(16 * adaptiveStyles.fontSize, { duration: 200 }),
            lineHeight: withTiming(24 * adaptiveStyles.fontSize, { duration: 200 }),
            marginBottom: withTiming(12 * adaptiveStyles.spacing, { duration: 200 }),
        };
    });

    const animatedFooterStyle = useAnimatedStyle(() => {
        const opacity = shouldShowFooter ? 1 : 0;
        return {
            opacity: withTiming(opacity, { duration: 200 }),
            height: withTiming(shouldShowFooter ? 60 : 0, { duration: 200 }),
        };
    });

    // Content based on mode
    const getContentForMode = () => {
        if (isCompact) {
            return (
                <View>
                    <Text style={styles.compactTitle}>Quick Summary</Text>
                    <Text style={styles.compactText}>
                        Essential information displayed in compact format.
                        Only the most important details are shown.
                    </Text>
                </View>
            );
        }

        if (isExpanded) {
            return (
                <View>
                    <Text style={styles.expandedTitle}>Detailed Information</Text>
                    <Text style={styles.expandedText}>
                        In expanded mode, we can show comprehensive details,
                        multiple sections, and rich content. This mode provides
                        the full experience with all available information.
                    </Text>

                    <View style={styles.featureGrid}>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureTitle}>Feature 1</Text>
                            <Text style={styles.featureDescription}>
                                Detailed description of the first feature with
                                comprehensive information.
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <Text style={styles.featureTitle}>Feature 2</Text>
                            <Text style={styles.featureDescription}>
                                Another feature with full details and
                                explanatory content.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>85%</Text>
                            <Text style={styles.statLabel}>Progress</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>42</Text>
                            <Text style={styles.statLabel}>Items</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Days</Text>
                        </View>
                    </View>
                </View>
            );
        }

        // Standard mode
        return (
            <View>
                <Text style={styles.standardTitle}>Standard Content</Text>
                <Text style={styles.standardText}>
                    This is the standard view with balanced information density.
                    It provides a good overview without overwhelming the user.
                </Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.buttonText}>Primary Action</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.buttonText}>Secondary</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ContentWrapper = scrollEnabled ? ScrollView : View;
    const contentWrapperProps = scrollEnabled ? {
        showsVerticalScrollIndicator: false,
        bounces: true,
        style: { maxHeight: maxContentHeight },
    } : {
        style: { maxHeight: maxContentHeight },
    };

    return (
        <View style={styles.container}>
            {/* Adaptive Header */}
            {shouldShowHeader && (
                <Animated.View style={[styles.header, animatedHeaderStyle]}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={styles.modeIndicator}>
                        <Text style={[styles.modeText, currentMode === 'compact' && styles.activeModeText]}>
                            Compact
                        </Text>
                        <Text style={[styles.modeText, currentMode === 'standard' && styles.activeModeText]}>
                            Standard
                        </Text>
                        <Text style={[styles.modeText, currentMode === 'expanded' && styles.activeModeText]}>
                            Expanded
                        </Text>
                    </View>
                </Animated.View>
            )}

            {/* Adaptive Content */}
            <Animated.View style={[styles.content, animatedContentStyle]}>
                <ContentWrapper {...contentWrapperProps}>
                    {/* Mode-specific content */}
                    {getContentForMode()}

                    {/* Custom children */}
                    {children}

                    {/* Development examples */}
                    {showExamples && (
                        <View style={styles.examplesSection}>
                            <Text style={styles.examplesTitle}>Adaptation Examples</Text>

                            <Animated.View style={[styles.exampleCard, animatedTextStyle]}>
                                <Text style={styles.exampleLabel}>Current Mode:</Text>
                                <Text style={[styles.exampleValue, { color: getModeColor(currentMode) }]}>
                                    {currentMode.toUpperCase()}
                                </Text>
                            </Animated.View>

                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleLabel}>Available Height:</Text>
                                <Text style={styles.exampleValue}>{Math.round(availableHeight)}px</Text>
                            </View>

                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleLabel}>Drag Progress:</Text>
                                <Text style={styles.exampleValue}>{Math.round(dragProgress * 100)}%</Text>
                            </View>

                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleLabel}>Scroll Enabled:</Text>
                                <Text style={[styles.exampleValue, { color: scrollEnabled ? '#4CAF50' : '#F44336' }]}>
                                    {scrollEnabled ? 'YES' : 'NO'}
                                </Text>
                            </View>

                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleLabel}>Transitioning:</Text>
                                <Text style={[styles.exampleValue, { color: isTransitioning ? '#FF9800' : '#4CAF50' }]}>
                                    {isTransitioning ? 'YES' : 'NO'}
                                </Text>
                            </View>

                            <View style={styles.adaptiveStylesCard}>
                                <Text style={styles.exampleLabel}>Adaptive Styles:</Text>
                                <Text style={styles.styleValue}>Padding: {adaptiveStyles.padding}px</Text>
                                <Text style={styles.styleValue}>Font Scale: {adaptiveStyles.fontSize.toFixed(2)}</Text>
                                <Text style={styles.styleValue}>Spacing: {adaptiveStyles.spacing.toFixed(2)}</Text>
                                <Text style={styles.styleValue}>Border Radius: {adaptiveStyles.borderRadius}px</Text>
                                <Text style={styles.styleValue}>Opacity: {adaptiveStyles.opacity.toFixed(2)}</Text>
                            </View>
                        </View>
                    )}
                </ContentWrapper>
            </Animated.View>

            {/* Adaptive Footer */}
            {shouldShowFooter && (
                <Animated.View style={[styles.footer, animatedFooterStyle]}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerButtonText}>Action</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerText}>
                        Mode: {currentMode} • Height: {Math.round(availableHeight)}px
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};

const getModeColor = (mode: string) => {
    switch (mode) {
        case 'compact': return '#FF9800';
        case 'standard': return '#2196F3';
        case 'expanded': return '#4CAF50';
        default: return '#666';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    modeIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modeText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    activeModeText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },

    // Compact mode styles
    compactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF9800',
        marginBottom: 8,
    },
    compactText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },

    // Standard mode styles
    standardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196F3',
        marginBottom: 12,
    },
    standardText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#607D8B',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },

    // Expanded mode styles
    expandedTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 16,
    },
    expandedText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 20,
    },
    featureGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    featureCard: {
        flex: 1,
        backgroundColor: '#F0F8F0',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#E8F5E8',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    // Examples section
    examplesSection: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    examplesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    exampleCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    exampleLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    exampleValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    adaptiveStylesCard: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    styleValue: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },

    // Footer styles
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    footerButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
    },
});