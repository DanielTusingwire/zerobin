import * as Haptics from 'expo-haptics';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    clamp,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Type definitions
export interface SnapPoint {
    height: number;
    label: string;
    contentMode: 'compact' | 'standard' | 'expanded';
    priority: number; // Higher priority snap points are preferred when multiple are close
    magneticRange: number; // Distance within which this snap point attracts the modal
}

export interface ModalState {
    currentHeight: number;
    targetHeight: number;
    isAnimating: boolean;
    isDragging: boolean;
    velocity: number;
}

export interface AnimationConfig {
    springConfig: {
        damping: number;
        stiffness: number;
        mass: number;
    };
    snapThreshold: number;
    velocityThreshold: number;
}

export interface ContentAdaptationContext {
    currentMode: 'compact' | 'standard' | 'expanded';
    availableHeight: number;
    contentHeight: number;
    isScrollable: boolean;
    dragProgress: number; // 0-1 progress through height range

    // Enhanced adaptation properties
    adaptiveStyles: {
        padding: number;
        fontSize: number;
        spacing: number;
        borderRadius: number;
        opacity: number;
    };

    // Layout helpers
    shouldShowHeader: boolean;
    shouldShowFooter: boolean;
    maxContentHeight: number;
    scrollEnabled: boolean;

    // Responsive breakpoints
    isCompact: boolean;
    isStandard: boolean;
    isExpanded: boolean;

    // Animation state
    isTransitioning: boolean;
    transitionProgress: number; // 0-1 progress between modes
}

export interface InteractiveBottomSheetProps {
    children: React.ReactNode | ((context: ContentAdaptationContext) => React.ReactNode);
    minHeight: number;
    maxHeight: number;
    initialHeight: number;
    onHeightChange?: (height: number) => void;
    onContentModeChange?: (mode: 'compact' | 'standard' | 'expanded') => void;
    snapPoints?: number[];
    enableRubberBand?: boolean; // Enable rubber band effect for over-drag
    rubberBandFactor?: number; // Strength of rubber band effect (0-1)
    enableHapticFeedback?: boolean; // Enable haptic feedback for interactions
    handleVariant?: 'default' | 'pill' | 'line' | 'dots'; // Different handle visual styles
    enableContentAdaptation?: boolean; // Enable automatic content adaptation
    contentPadding?: number; // Padding around content area
    style?: ViewStyle;
    handleStyle?: ViewStyle;
    contentStyle?: ViewStyle;
}

export interface InteractiveBottomSheetRef {
    animateToSnapPoint: (snapPointIndex: number, animationType?: 'gentle' | 'snappy' | 'bouncy' | 'smooth') => void;
    getCurrentHeight: () => number;
    getSnapPoints: () => SnapPoint[];
    isAnimating: () => boolean;
}

// Enhanced animation configurations for different scenarios
const ANIMATION_CONFIGS = {
    // Gentle spring for user-initiated drags
    gentle: {
        damping: 50,
        stiffness: 200,
        mass: 0.3,
    },
    // Snappy spring for quick gestures
    snappy: {
        damping: 40,
        stiffness: 300,
        mass: 0.2,
    },
    // Bouncy spring for high-velocity gestures
    bouncy: {
        damping: 30,
        stiffness: 250,
        mass: 0.4,
    },
    // Smooth spring for programmatic animations
    smooth: {
        damping: 60,
        stiffness: 180,
        mass: 0.25,
    },
};

// Default animation configuration
const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
    springConfig: ANIMATION_CONFIGS.gentle,
    snapThreshold: 50,
    velocityThreshold: 500,
};

// Default snap points (as percentages of screen height)
const DEFAULT_SNAP_POINTS = [0.3, 0.7, 0.9];

// Rubber band configuration
const RUBBER_BAND_CONFIG = {
    defaultFactor: 0.3, // Default rubber band resistance
    maxOverdrag: 100, // Maximum pixels of overdrag allowed
    snapBackThreshold: 20, // Threshold for snapping back to bounds
};

// Haptic feedback configuration
const HAPTIC_CONFIG = {
    dragStart: 'impactLight' as const,
    snapPoint: 'impactMedium' as const,
    overDrag: 'impactHeavy' as const,
    snapBack: 'notificationSuccess' as const,
};

// Visual feedback configuration
const VISUAL_FEEDBACK_CONFIG = {
    handleColors: {
        default: '#E0E0E0',
        active: '#A0A0A0',
        overDrag: '#FF6B6B',
        snapPoint: '#4CAF50',
    },
    animations: {
        quick: { damping: 15, stiffness: 400, mass: 0.1 },
        smooth: { damping: 25, stiffness: 300, mass: 0.2 },
        bouncy: { damping: 12, stiffness: 500, mass: 0.1 },
    },
};

// Content adaptation configuration
const CONTENT_ADAPTATION_CONFIG = {
    modes: {
        compact: {
            threshold: 0.4, // Below 40% of height range
            contentPadding: 12,
            fontSize: 0.9, // 90% of normal size
            spacing: 0.8, // 80% of normal spacing
            borderRadius: 8,
            opacity: 0.95,
            showHeader: false,
            showFooter: false,
            maxLines: 3, // Limit text lines in compact mode
            scrollEnabled: false,
        },
        standard: {
            threshold: 0.7, // Between 40% and 70% of height range
            contentPadding: 16,
            fontSize: 1.0, // Normal size
            spacing: 1.0, // Normal spacing
            borderRadius: 12,
            opacity: 1.0,
            showHeader: true,
            showFooter: true,
            maxLines: -1, // No limit
            scrollEnabled: true,
        },
        expanded: {
            threshold: 1.0, // Above 70% of height range
            contentPadding: 20,
            fontSize: 1.1, // 110% of normal size
            spacing: 1.2, // 120% of normal spacing
            borderRadius: 16,
            opacity: 1.0,
            showHeader: true,
            showFooter: true,
            maxLines: -1, // No limit
            scrollEnabled: true,
        },
    },
    transitions: {
        duration: 200,
        easing: 'ease-out',
        staggerDelay: 50, // Delay between different property animations
    },
    breakpoints: {
        compactMaxHeight: 300,
        standardMaxHeight: 600,
        expandedMinHeight: 600,
    },
};

/**
 * InteractiveBottomSheet - A draggable bottom sheet component
 * 
 * Features:
 * - Smooth drag gestures with physics-based animations
 * - Configurable snap points
 * - Height change callbacks
 * - Customizable styling
 * - Imperative API for external control
 */
export const InteractiveBottomSheet = forwardRef<InteractiveBottomSheetRef, InteractiveBottomSheetProps>(({
    children,
    minHeight,
    maxHeight,
    initialHeight,
    onHeightChange,
    onContentModeChange,
    snapPoints = DEFAULT_SNAP_POINTS,
    enableRubberBand = true,
    rubberBandFactor = RUBBER_BAND_CONFIG.defaultFactor,
    enableHapticFeedback = true,
    handleVariant = 'default',
    enableContentAdaptation = true,
    contentPadding = 16,
    style,
    handleStyle,
    contentStyle,
}, ref) => {
    // Shared values for animations
    const translateY = useSharedValue(0);
    const modalHeight = useSharedValue(initialHeight);
    const isGestureActive = useSharedValue(false);
    const isOverDragging = useSharedValue(false);
    const isNearSnapPoint = useSharedValue(false);
    const dragProgress = useSharedValue(0); // 0-1 progress of current drag

    // Content adaptation shared values
    const contentMode = useSharedValue<'compact' | 'standard' | 'expanded'>('standard');
    const availableContentHeight = useSharedValue(initialHeight - 60); // Subtract handle area
    const adaptivePadding = useSharedValue(contentPadding);
    const adaptiveFontScale = useSharedValue(1.0);
    const adaptiveSpacing = useSharedValue(1.0);
    const adaptiveBorderRadius = useSharedValue(12);
    const adaptiveOpacity = useSharedValue(1.0);
    const isTransitioning = useSharedValue(false);
    const transitionProgress = useSharedValue(0);
    const scrollEnabled = useSharedValue(true);
    const maxContentHeight = useSharedValue(initialHeight - 60);

    // Refs for state management
    const modalStateRef = useRef<ModalState>({
        currentHeight: initialHeight,
        targetHeight: initialHeight,
        isAnimating: false,
        isDragging: false,
        velocity: 0,
    });

    // Convert snap points to absolute heights with enhanced configuration
    const absoluteSnapPoints: SnapPoint[] = snapPoints.map((point, index) => {
        const height = Math.max(minHeight, Math.min(maxHeight, SCREEN_HEIGHT * point));
        let contentMode: 'compact' | 'standard' | 'expanded' = 'standard';
        let priority = 1; // Default priority
        let magneticRange = DEFAULT_ANIMATION_CONFIG.snapThreshold;

        // Configure content modes and priorities
        if (index === 0) {
            contentMode = 'compact';
            priority = 2; // Higher priority for minimum height
            magneticRange = 60; // Larger magnetic range for minimum
        } else if (index === snapPoints.length - 1) {
            contentMode = 'expanded';
            priority = 2; // Higher priority for maximum height
            magneticRange = 60; // Larger magnetic range for maximum
        } else if (snapPoints.length === 3 && index === 1) {
            // Middle snap point gets standard mode and higher priority
            contentMode = 'standard';
            priority = 3; // Highest priority for middle/standard position
            magneticRange = 80; // Largest magnetic range for standard position
        }

        return {
            height,
            label: `${Math.round(point * 100)}%`,
            contentMode,
            priority,
            magneticRange,
        };
    });

    // Haptic feedback functions
    const triggerHapticFeedback = (type: keyof typeof HAPTIC_CONFIG) => {
        if (!enableHapticFeedback) return;

        try {
            switch (type) {
                case 'dragStart':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;
                case 'snapPoint':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;
                case 'overDrag':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    break;
                case 'snapBack':
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    break;
            }
        } catch (error) {
            // Haptic feedback not available, silently continue
        }
    };

    // Content adaptation functions
    const updateContentMode = (height: number) => {
        if (!enableContentAdaptation) return;

        const heightRange = maxHeight - minHeight;
        const currentRange = height - minHeight;
        const progress = Math.max(0, Math.min(1, currentRange / heightRange));

        let newMode: 'compact' | 'standard' | 'expanded' = 'standard';
        let config = CONTENT_ADAPTATION_CONFIG.modes.standard;
        let transitionDelay = 0;

        // Determine mode based on height thresholds
        if (progress < CONTENT_ADAPTATION_CONFIG.modes.compact.threshold) {
            newMode = 'compact';
            config = CONTENT_ADAPTATION_CONFIG.modes.compact;
        } else if (progress >= CONTENT_ADAPTATION_CONFIG.modes.expanded.threshold) {
            newMode = 'expanded';
            config = CONTENT_ADAPTATION_CONFIG.modes.expanded;
        }

        // Calculate transition progress between modes
        let modeTransitionProgress = 0;
        if (newMode === 'compact') {
            modeTransitionProgress = progress / CONTENT_ADAPTATION_CONFIG.modes.compact.threshold;
        } else if (newMode === 'expanded') {
            const expandedStart = CONTENT_ADAPTATION_CONFIG.modes.expanded.threshold;
            modeTransitionProgress = (progress - expandedStart) / (1 - expandedStart);
        } else {
            const standardStart = CONTENT_ADAPTATION_CONFIG.modes.compact.threshold;
            const standardEnd = CONTENT_ADAPTATION_CONFIG.modes.expanded.threshold;
            modeTransitionProgress = (progress - standardStart) / (standardEnd - standardStart);
        }

        // Set transition state
        const wasTransitioning = isTransitioning.value;
        const modeChanged = contentMode.value !== newMode;

        if (modeChanged && !wasTransitioning) {
            isTransitioning.value = true;
        }

        // Update shared values with staggered animations for smooth transitions
        const animationConfig = {
            duration: CONTENT_ADAPTATION_CONFIG.transitions.duration,
        };

        // Core properties
        contentMode.value = newMode;
        availableContentHeight.value = height - 60; // Subtract handle and padding
        maxContentHeight.value = Math.max(100, height - 120); // Reserve space for handle and padding
        transitionProgress.value = modeTransitionProgress;

        // Animated properties with staggered timing
        adaptivePadding.value = withTiming(config.contentPadding, animationConfig);

        adaptiveFontScale.value = withTiming(config.fontSize, {
            ...animationConfig,
            duration: animationConfig.duration + transitionDelay,
        });
        transitionDelay += CONTENT_ADAPTATION_CONFIG.transitions.staggerDelay;

        adaptiveSpacing.value = withTiming(config.spacing, {
            ...animationConfig,
            duration: animationConfig.duration + transitionDelay,
        });
        transitionDelay += CONTENT_ADAPTATION_CONFIG.transitions.staggerDelay;

        adaptiveBorderRadius.value = withTiming(config.borderRadius, {
            ...animationConfig,
            duration: animationConfig.duration + transitionDelay,
        });
        transitionDelay += CONTENT_ADAPTATION_CONFIG.transitions.staggerDelay;

        adaptiveOpacity.value = withTiming(config.opacity, {
            ...animationConfig,
            duration: animationConfig.duration + transitionDelay,
        });

        // Update scroll behavior
        scrollEnabled.value = config.scrollEnabled;

        // Complete transition after all animations
        if (modeChanged) {
            setTimeout(() => {
                isTransitioning.value = false;
            }, animationConfig.duration + transitionDelay + 50);
        }

        // Notify parent component of mode change
        if (onContentModeChange && modeChanged) {
            onContentModeChange(newMode);
        }
    };

    // Initialize modal position and content mode
    useEffect(() => {
        const initialPosition = SCREEN_HEIGHT - initialHeight;
        translateY.value = initialPosition;
        modalHeight.value = initialHeight;
        updateContentMode(initialHeight);
    }, [initialHeight, translateY, modalHeight]);



    // Enhanced snap point finding with velocity-based prediction and magnetic ranges
    const findNearestSnapPoint = (currentHeight: number, velocity: number): SnapPoint => {
        const { velocityThreshold } = DEFAULT_ANIMATION_CONFIG;

        // Predict where the modal would end up based on velocity
        const velocityFactor = Math.min(Math.abs(velocity) / 1000, 2); // Cap at 2x
        const predictedHeight = currentHeight + (velocity < 0 ? velocityFactor * 100 : -velocityFactor * 100);

        // Find snap points within magnetic range of current or predicted position
        const candidateSnapPoints = absoluteSnapPoints.filter(point => {
            const distanceToCurrent = Math.abs(point.height - currentHeight);
            const distanceToPredicted = Math.abs(point.height - predictedHeight);
            return distanceToCurrent <= point.magneticRange || distanceToPredicted <= point.magneticRange;
        });

        // If we have candidates, choose based on priority and distance
        if (candidateSnapPoints.length > 0) {
            // High velocity: prefer direction-based selection
            if (Math.abs(velocity) > velocityThreshold) {
                const isMovingUp = velocity < 0;
                const directionCandidates = candidateSnapPoints.filter(point => {
                    return isMovingUp ? point.height > currentHeight : point.height < currentHeight;
                });

                if (directionCandidates.length > 0) {
                    // Choose highest priority candidate in the direction of movement
                    return directionCandidates.reduce((best, current) => {
                        if (current.priority > best.priority) return current;
                        if (current.priority === best.priority) {
                            // Same priority: choose closer to predicted position
                            const currentDistance = Math.abs(current.height - predictedHeight);
                            const bestDistance = Math.abs(best.height - predictedHeight);
                            return currentDistance < bestDistance ? current : best;
                        }
                        return best;
                    });
                }
            }

            // Low velocity or no directional candidates: choose by priority and distance
            return candidateSnapPoints.reduce((best, current) => {
                if (current.priority > best.priority) return current;
                if (current.priority === best.priority) {
                    // Same priority: choose closer to current position
                    const currentDistance = Math.abs(current.height - currentHeight);
                    const bestDistance = Math.abs(best.height - currentHeight);
                    return currentDistance < bestDistance ? current : best;
                }
                return best;
            });
        }

        // No candidates in magnetic range: find closest by distance
        return absoluteSnapPoints.reduce((closest, current) => {
            const currentDistance = Math.abs(current.height - currentHeight);
            const closestDistance = Math.abs(closest.height - currentHeight);
            return currentDistance < closestDistance ? current : closest;
        });
    };

    // Enhanced animation system with adaptive physics and interruption handling
    const animateToHeight = (targetHeight: number, velocity = 0, animationType: 'gentle' | 'snappy' | 'bouncy' | 'smooth' = 'gentle') => {
        // Stop any ongoing animations to prevent conflicts
        if (modalStateRef.current.isAnimating) {
            // Animation interruption - use current position as starting point
            const currentPosition = translateY.value;
            const currentHeight = SCREEN_HEIGHT - currentPosition;
            modalStateRef.current.currentHeight = currentHeight;
        }

        // Select appropriate spring configuration based on velocity and animation type
        let springConfig = ANIMATION_CONFIGS[animationType];

        // Adaptive physics based on velocity for more natural feel
        const absVelocity = Math.abs(velocity);
        if (absVelocity > 1000) {
            // High velocity - use bouncy spring with reduced damping
            springConfig = {
                ...ANIMATION_CONFIGS.bouncy,
                damping: Math.max(20, ANIMATION_CONFIGS.bouncy.damping - absVelocity * 0.01),
            };
        } else if (absVelocity > 500) {
            // Medium velocity - use snappy spring
            springConfig = ANIMATION_CONFIGS.snappy;
        } else if (absVelocity < 100) {
            // Low velocity - use smooth spring with higher damping
            springConfig = {
                ...ANIMATION_CONFIGS.smooth,
                damping: Math.min(80, ANIMATION_CONFIGS.smooth.damping + (100 - absVelocity) * 0.2),
            };
        }

        // Update state tracking
        modalStateRef.current.isAnimating = true;
        modalStateRef.current.targetHeight = targetHeight;
        modalStateRef.current.velocity = velocity;

        const targetTranslateY = SCREEN_HEIGHT - targetHeight;

        // Enhanced spring animation with velocity consideration and overshoot protection
        const springOptions = {
            ...springConfig,
            velocity: Math.max(-2000, Math.min(2000, velocity * 0.1)), // Clamp velocity for stability
            overshootClamping: false, // Allow natural spring overshoot
            restDisplacementThreshold: 0.1,
            restSpeedThreshold: 0.1,
        };

        // Animate position with completion callback
        translateY.value = withSpring(targetTranslateY, springOptions, (finished) => {
            if (finished) {
                runOnJS(() => {
                    modalStateRef.current.isAnimating = false;
                    modalStateRef.current.currentHeight = targetHeight;
                    modalStateRef.current.velocity = 0;
                    updateContentMode(targetHeight);
                    onHeightChange?.(targetHeight);
                })();
            }
        });

        // Animate height in parallel for smooth visual feedback
        modalHeight.value = withSpring(targetHeight, springOptions);
    };

    // Programmatic animation method for external control
    const animateToSnapPoint = (snapPointIndex: number, animationType: 'gentle' | 'snappy' | 'bouncy' | 'smooth' = 'smooth') => {
        if (snapPointIndex >= 0 && snapPointIndex < absoluteSnapPoints.length) {
            const targetHeight = absoluteSnapPoints[snapPointIndex].height;
            animateToHeight(targetHeight, 0, animationType);
        }
    };

    // Expose imperative API
    useImperativeHandle(ref, () => ({
        animateToSnapPoint,
        getCurrentHeight: () => modalStateRef.current.currentHeight,
        getSnapPoints: () => absoluteSnapPoints,
        isAnimating: () => modalStateRef.current.isAnimating,
    }));

    // Enhanced gesture handling with animation interruption and haptic feedback
    const panGesture = Gesture.Pan()
        .onStart(() => {
            'worklet';
            isGestureActive.value = true;
            dragProgress.value = 0;

            runOnJS(() => {
                modalStateRef.current.isDragging = true;
                triggerHapticFeedback('dragStart');

                // If an animation is running, interrupt it and use current position
                if (modalStateRef.current.isAnimating) {
                    modalStateRef.current.isAnimating = false;
                    const currentHeight = SCREEN_HEIGHT - translateY.value;
                    modalStateRef.current.currentHeight = currentHeight;
                }
            })();
        })
        .onUpdate((event) => {
            'worklet';
            // Calculate new position based on gesture
            const rawTranslateY = event.translationY + (SCREEN_HEIGHT - modalStateRef.current.currentHeight);

            // Apply rubber band effect for over-drag scenarios (worklet version)
            let newTranslateY = rawTranslateY;
            if (enableRubberBand) {
                const minPosition = SCREEN_HEIGHT - maxHeight;
                const maxPosition = SCREEN_HEIGHT - minHeight;

                if (rawTranslateY < minPosition) {
                    // Over-dragging upward (beyond max height)
                    const overdrag = minPosition - rawTranslateY;
                    const dampedOverdrag = overdrag * rubberBandFactor;
                    const clampedOverdrag = Math.min(dampedOverdrag, RUBBER_BAND_CONFIG.maxOverdrag);
                    newTranslateY = minPosition - clampedOverdrag;
                } else if (rawTranslateY > maxPosition) {
                    // Over-dragging downward (beyond min height)
                    const overdrag = rawTranslateY - maxPosition;
                    const dampedOverdrag = overdrag * rubberBandFactor;
                    const clampedOverdrag = Math.min(dampedOverdrag, RUBBER_BAND_CONFIG.maxOverdrag);
                    newTranslateY = maxPosition + clampedOverdrag;
                }
            } else {
                // No rubber band: hard clamp
                newTranslateY = clamp(rawTranslateY, SCREEN_HEIGHT - maxHeight, SCREEN_HEIGHT - minHeight);
            }

            // Track over-drag state for visual feedback
            const wasOverDragging = isOverDragging.value;
            const nowOverDragging = rawTranslateY < (SCREEN_HEIGHT - maxHeight) || rawTranslateY > (SCREEN_HEIGHT - minHeight);
            isOverDragging.value = nowOverDragging;

            // Trigger haptic feedback when entering over-drag
            if (!wasOverDragging && nowOverDragging) {
                runOnJS(() => triggerHapticFeedback('overDrag'))();
            }

            // Update position
            translateY.value = newTranslateY;

            // Calculate corresponding height and drag progress
            const newHeight = SCREEN_HEIGHT - newTranslateY;
            modalHeight.value = newHeight;

            // Calculate drag progress (0-1) for visual feedback
            const totalRange = maxHeight - minHeight;
            const currentRange = newHeight - minHeight;
            dragProgress.value = clamp(currentRange / totalRange, 0, 1);

            // Update content adaptation in real-time during drag
            if (enableContentAdaptation) {
                runOnJS(() => updateContentMode(newHeight))();
            }

            // Check if near snap point for visual feedback
            const currentHeight = newHeight;
            let nearSnapPoint = false;
            for (const snapPoint of absoluteSnapPoints) {
                if (Math.abs(snapPoint.height - currentHeight) < snapPoint.magneticRange) {
                    nearSnapPoint = true;
                    break;
                }
            }
            isNearSnapPoint.value = nearSnapPoint;

            // Store velocity for snap calculation
            runOnJS(() => {
                modalStateRef.current.velocity = event.velocityY;
            })();
        })
        .onEnd((event) => {
            'worklet';
            isGestureActive.value = false;

            // Calculate current height from position
            const currentHeight = SCREEN_HEIGHT - translateY.value;
            const currentPosition = translateY.value;

            // Check if we need to snap back from over-drag
            const minPosition = SCREEN_HEIGHT - maxHeight;
            const maxPosition = SCREEN_HEIGHT - minHeight;
            const isCurrentlyOverDragging = currentPosition < minPosition || currentPosition > maxPosition;

            // Reset visual feedback states (these should be outside runOnJS since they're worklet values)
            isGestureActive.value = false;
            isOverDragging.value = false;
            isNearSnapPoint.value = false;

            runOnJS(() => {
                modalStateRef.current.isDragging = false;

                if (isCurrentlyOverDragging && enableRubberBand) {
                    // Snap back to bounds with appropriate animation
                    let targetHeight: number;
                    let animationType: 'gentle' | 'snappy' | 'bouncy' | 'smooth' = 'snappy';

                    if (currentPosition < minPosition) {
                        // Over-dragged upward: snap to max height
                        targetHeight = maxHeight;
                        animationType = 'bouncy'; // Bouncy animation for snap-back
                    } else {
                        // Over-dragged downward: snap to min height
                        targetHeight = minHeight;
                        animationType = 'bouncy'; // Bouncy animation for snap-back
                    }

                    triggerHapticFeedback('snapBack');
                    animateToHeight(targetHeight, event.velocityY * 0.5, animationType);
                } else {
                    // Normal snap to nearest snap point
                    const nearestSnapPoint = findNearestSnapPoint(currentHeight, event.velocityY);
                    triggerHapticFeedback('snapPoint');
                    animateToHeight(nearestSnapPoint.height, event.velocityY);
                }
            })();
        });

    // Enhanced animated styles with sophisticated visual feedback
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            height: modalHeight.value,
        };
    });

    const animatedHandleStyle = useAnimatedStyle(() => {
        // Multi-state visual feedback system
        const baseScale = 1;
        const activeScale = 1.15;
        const overDragScale = 1.3;
        const snapPointScale = 1.25;

        // Determine current scale based on state priority
        let targetScale = baseScale;
        if (isOverDragging.value) {
            targetScale = overDragScale;
        } else if (isNearSnapPoint.value && isGestureActive.value) {
            targetScale = snapPointScale;
        } else if (isGestureActive.value) {
            targetScale = activeScale;
        }

        const scale = withSpring(targetScale, VISUAL_FEEDBACK_CONFIG.animations.quick);

        // Dynamic width based on drag progress and state
        const baseWidth = 40;
        const maxWidth = 60;
        const progressWidth = interpolate(dragProgress.value, [0, 1], [baseWidth, baseWidth + 8]);
        const stateWidth = isGestureActive.value ? Math.max(progressWidth, 48) : baseWidth;
        const width = withSpring(stateWidth, VISUAL_FEEDBACK_CONFIG.animations.smooth);

        // Height animation for pill variant
        const baseHeight = handleVariant === 'pill' ? 6 : 4;
        const activeHeight = handleVariant === 'pill' ? 8 : 5;
        const height = withSpring(
            isGestureActive.value ? activeHeight : baseHeight,
            VISUAL_FEEDBACK_CONFIG.animations.smooth
        );

        // Opacity with subtle breathing effect during drag
        const baseOpacity = 1;
        const activeOpacity = 0.9;
        const breathingOpacity = isGestureActive.value
            ? interpolate(Math.sin(Date.now() * 0.003), [-1, 1], [0.7, 0.9])
            : baseOpacity;
        const opacity = withSpring(
            isGestureActive.value ? breathingOpacity : baseOpacity,
            VISUAL_FEEDBACK_CONFIG.animations.quick
        );

        return {
            transform: [{ scale }],
            opacity,
            width,
            height,
        };
    });

    // Enhanced shadow and elevation animation during drag
    const animatedShadowStyle = useAnimatedStyle(() => {
        const shadowOpacity = withSpring(isGestureActive.value ? 0.25 : 0.1, {
            damping: 25,
            stiffness: 200,
            mass: 0.2,
        });

        const shadowRadius = withSpring(isGestureActive.value ? 15 : 8, {
            damping: 25,
            stiffness: 200,
            mass: 0.2,
        });

        const elevation = withSpring(isGestureActive.value ? 15 : 10, {
            damping: 25,
            stiffness: 200,
            mass: 0.2,
        });

        return {
            shadowOpacity,
            shadowRadius,
            elevation,
        };
    });

    // Enhanced color animation with multiple states
    const animatedHandleColorStyle = useAnimatedStyle(() => {
        // Determine color based on current state priority
        let targetColor = VISUAL_FEEDBACK_CONFIG.handleColors.default;

        if (isOverDragging.value) {
            targetColor = VISUAL_FEEDBACK_CONFIG.handleColors.overDrag;
        } else if (isNearSnapPoint.value && isGestureActive.value) {
            targetColor = VISUAL_FEEDBACK_CONFIG.handleColors.snapPoint;
        } else if (isGestureActive.value) {
            targetColor = VISUAL_FEEDBACK_CONFIG.handleColors.active;
        }

        // Smooth color interpolation
        const backgroundColor = withSpring(targetColor, VISUAL_FEEDBACK_CONFIG.animations.smooth);

        // Add subtle gradient effect for pill variant
        const borderRadius = withSpring(
            handleVariant === 'pill' ? 10 : 2,
            VISUAL_FEEDBACK_CONFIG.animations.smooth
        );

        return {
            backgroundColor,
            borderRadius,
        };
    });

    // Additional visual elements for enhanced feedback
    const animatedIndicatorStyle = useAnimatedStyle(() => {
        // Progress indicator that shows drag progress
        const indicatorOpacity = withSpring(
            isGestureActive.value ? 0.3 : 0,
            VISUAL_FEEDBACK_CONFIG.animations.quick
        );

        const indicatorWidth = interpolate(
            dragProgress.value,
            [0, 1],
            [20, 80]
        );

        return {
            opacity: indicatorOpacity,
            width: indicatorWidth,
            height: 2,
            backgroundColor: VISUAL_FEEDBACK_CONFIG.handleColors.snapPoint,
            borderRadius: 1,
            marginTop: 2,
        };
    });

    // Render different handle variants
    const renderHandle = () => {
        switch (handleVariant) {
            case 'pill':
                return (
                    <Animated.View style={[styles.handlePill, animatedHandleStyle, animatedHandleColorStyle]} />
                );
            case 'line':
                return (
                    <Animated.View style={[styles.handleLine, animatedHandleStyle, animatedHandleColorStyle]} />
                );
            case 'dots':
                return (
                    <View style={styles.handleDotsContainer}>
                        <Animated.View style={[styles.handleDot, animatedHandleColorStyle]} />
                        <Animated.View style={[styles.handleDot, animatedHandleColorStyle]} />
                        <Animated.View style={[styles.handleDot, animatedHandleColorStyle]} />
                    </View>
                );
            default:
                return (
                    <View>
                        <Animated.View style={[styles.handle, animatedHandleStyle, animatedHandleColorStyle]} />
                        <Animated.View style={[animatedIndicatorStyle]} />
                    </View>
                );
        }
    };

    // Content adaptation animated styles
    const animatedContentStyle = useAnimatedStyle(() => {
        if (!enableContentAdaptation) {
            return {
                padding: contentPadding,
                maxHeight: maxContentHeight.value,
            };
        }

        return {
            padding: adaptivePadding.value,
            borderRadius: adaptiveBorderRadius.value,
            opacity: adaptiveOpacity.value,
            maxHeight: maxContentHeight.value,
            transform: [
                { scale: adaptiveFontScale.value }
            ],
        };
    });

    // Create enhanced content adaptation context
    const getContentContext = (): ContentAdaptationContext => {
        const currentModeValue = contentMode.value;
        const config = CONTENT_ADAPTATION_CONFIG.modes[currentModeValue];

        return {
            currentMode: currentModeValue,
            availableHeight: availableContentHeight.value,
            contentHeight: modalHeight.value,
            isScrollable: scrollEnabled.value && availableContentHeight.value < (modalHeight.value - 100),
            dragProgress: dragProgress.value,

            // Enhanced adaptation properties
            adaptiveStyles: {
                padding: adaptivePadding.value,
                fontSize: adaptiveFontScale.value,
                spacing: adaptiveSpacing.value,
                borderRadius: adaptiveBorderRadius.value,
                opacity: adaptiveOpacity.value,
            },

            // Layout helpers
            shouldShowHeader: config.showHeader,
            shouldShowFooter: config.showFooter,
            maxContentHeight: maxContentHeight.value,
            scrollEnabled: scrollEnabled.value,

            // Responsive breakpoints
            isCompact: currentModeValue === 'compact',
            isStandard: currentModeValue === 'standard',
            isExpanded: currentModeValue === 'expanded',

            // Animation state
            isTransitioning: isTransitioning.value,
            transitionProgress: transitionProgress.value,
        };
    };

    return (
        <Animated.View style={[styles.container, style, animatedContainerStyle, animatedShadowStyle]}>
            {/* Enhanced Drag Handle */}
            <GestureDetector gesture={panGesture}>
                <View style={[styles.handleContainer, handleStyle]}>
                    {renderHandle()}
                </View>
            </GestureDetector>

            {/* Adaptive Content */}
            <Animated.View style={[styles.content, contentStyle, animatedContentStyle]}>
                {typeof children === 'function' ? children(getContentContext()) : children}
            </Animated.View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    handlePill: {
        width: 50,
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
    },
    handleLine: {
        width: 60,
        height: 2,
        backgroundColor: '#E0E0E0',
        borderRadius: 1,
    },
    handleDotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 24,
    },
    handleDot: {
        width: 6,
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    content: {
        flex: 1,
    },
});

// Add display name for debugging
InteractiveBottomSheet.displayName = 'InteractiveBottomSheet';