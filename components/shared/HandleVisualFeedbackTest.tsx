import React, { useRef, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { InteractiveBottomSheet, InteractiveBottomSheetRef } from './InteractiveBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type HandleVariant = 'default' | 'pill' | 'line' | 'dots';

/**
 * Test component to demonstrate enhanced drag handle visual feedback
 * Features tested:
 * - Different handle variants (default, pill, line, dots)
 * - Multi-state visual feedback (active, over-drag, near snap point)
 * - Haptic feedback integration
 * - Progressive visual changes during drag
 * - State-based color transitions
 */
export const HandleVisualFeedbackTest: React.FC = () => {
    const bottomSheetRef = useRef<InteractiveBottomSheetRef>(null);
    const [handleVariant, setHandleVariant] = useState<HandleVariant>('default');
    const [enableHapticFeedback, setEnableHapticFeedback] = useState(true);
    const [enableRubberBand, setEnableRubberBand] = useState(true);

    const handleVariantChange = (variant: HandleVariant) => {
        setHandleVariant(variant);
    };

    const handleSnapPointTest = (snapPointIndex: number) => {
        bottomSheetRef.current?.animateToSnapPoint(snapPointIndex, 'smooth');
    };

    const handleHeightChange = (height: number) => {
        const percentage = Math.round((height / SCREEN_HEIGHT) * 100);
        console.log(`Handle feedback test - Height: ${height}px (${percentage}%)`);
    };

    const variants: { key: HandleVariant; label: string; description: string }[] = [
        {
            key: 'default',
            label: 'Default',
            description: 'Classic handle with progress indicator'
        },
        {
            key: 'pill',
            label: 'Pill',
            description: 'Rounded pill shape with smooth scaling'
        },
        {
            key: 'line',
            label: 'Line',
            description: 'Thin line with width animation'
        },
        {
            key: 'dots',
            label: 'Dots',
            description: 'Three dots with synchronized feedback'
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Handle Visual Feedback Test</Text>
                <Text style={styles.subtitle}>Test enhanced drag handle interactions and visual states</Text>

                {/* Handle Variant Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Handle Variants</Text>
                    <View style={styles.variantGrid}>
                        {variants.map((variant) => (
                            <TouchableOpacity
                                key={variant.key}
                                style={[
                                    styles.variantButton,
                                    handleVariant === variant.key && styles.variantButtonActive
                                ]}
                                onPress={() => handleVariantChange(variant.key)}
                            >
                                <Text style={[
                                    styles.variantButtonText,
                                    handleVariant === variant.key && styles.variantButtonTextActive
                                ]}>
                                    {variant.label}
                                </Text>
                                <Text style={styles.variantDescription}>
                                    {variant.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Configuration Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Configuration</Text>

                    <View style={styles.configRow}>
                        <Text style={styles.configLabel}>Haptic Feedback:</Text>
                        <Switch
                            value={enableHapticFeedback}
                            onValueChange={setEnableHapticFeedback}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={enableHapticFeedback ? '#f5dd4b' : '#f4f3f4'}
                        />
                    </View>

                    <View style={styles.configRow}>
                        <Text style={styles.configLabel}>Rubber Band Effect:</Text>
                        <Switch
                            value={enableRubberBand}
                            onValueChange={setEnableRubberBand}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={enableRubberBand ? '#f5dd4b' : '#f4f3f4'}
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.snapButton]}
                            onPress={() => handleSnapPointTest(0)}
                        >
                            <Text style={styles.actionButtonText}>30%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.snapButton]}
                            onPress={() => handleSnapPointTest(1)}
                        >
                            <Text style={styles.actionButtonText}>70%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.snapButton]}
                            onPress={() => handleSnapPointTest(2)}
                        >
                            <Text style={styles.actionButtonText}>90%</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Visual Feedback Guide */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visual Feedback States</Text>
                    <View style={styles.feedbackGuide}>
                        <View style={styles.feedbackItem}>
                            <View style={[styles.feedbackIndicator, { backgroundColor: '#E0E0E0' }]} />
                            <Text style={styles.feedbackText}>Default - Resting state</Text>
                        </View>
                        <View style={styles.feedbackItem}>
                            <View style={[styles.feedbackIndicator, { backgroundColor: '#A0A0A0' }]} />
                            <Text style={styles.feedbackText}>Active - During drag</Text>
                        </View>
                        <View style={styles.feedbackItem}>
                            <View style={[styles.feedbackIndicator, { backgroundColor: '#4CAF50' }]} />
                            <Text style={styles.feedbackText}>Near Snap Point - Magnetic attraction</Text>
                        </View>
                        <View style={styles.feedbackItem}>
                            <View style={[styles.feedbackIndicator, { backgroundColor: '#FF6B6B' }]} />
                            <Text style={styles.feedbackText}>Over-drag - Beyond bounds</Text>
                        </View>
                    </View>
                </View>

                {/* Test Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Test Instructions</Text>
                    <View style={styles.instructions}>
                        <Text style={styles.instructionText}>• Try different handle variants to see unique animations</Text>
                        <Text style={styles.instructionText}>• Drag slowly to see progressive width changes</Text>
                        <Text style={styles.instructionText}>• Drag quickly to trigger velocity-based feedback</Text>
                        <Text style={styles.instructionText}>• Drag beyond bounds to see over-drag visual state</Text>
                        <Text style={styles.instructionText}>• Notice color changes when near snap points</Text>
                        <Text style={styles.instructionText}>• Feel haptic feedback at different interaction points</Text>
                    </View>
                </View>
            </ScrollView>

            <InteractiveBottomSheet
                ref={bottomSheetRef}
                minHeight={SCREEN_HEIGHT * 0.2}
                maxHeight={SCREEN_HEIGHT * 0.95}
                initialHeight={SCREEN_HEIGHT * 0.4}
                onHeightChange={handleHeightChange}
                snapPoints={[0.3, 0.7, 0.9]}
                enableRubberBand={enableRubberBand}
                enableHapticFeedback={enableHapticFeedback}
                handleVariant={handleVariant}
            >
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Enhanced Handle Feedback</Text>
                    <Text style={styles.contentSubtitle}>Current variant: {handleVariant}</Text>

                    <View style={styles.featureList}>
                        <Text style={styles.featureTitle}>Active Features:</Text>
                        <Text style={styles.featureItem}>
                            ✓ Multi-state visual feedback system
                        </Text>
                        <Text style={styles.featureItem}>
                            ✓ Progressive animations during drag
                        </Text>
                        <Text style={styles.featureItem}>
                            ✓ State-based color transitions
                        </Text>
                        <Text style={styles.featureItem}>
                            ✓ Haptic feedback integration
                        </Text>
                        <Text style={styles.featureItem}>
                            ✓ Multiple handle design variants
                        </Text>
                        <Text style={styles.featureItem}>
                            ✓ Magnetic snap point indicators
                        </Text>
                    </View>

                    <View style={styles.statusCard}>
                        <Text style={styles.statusTitle}>Current Configuration:</Text>
                        <Text style={styles.statusText}>Handle: {handleVariant}</Text>
                        <Text style={styles.statusText}>Haptics: {enableHapticFeedback ? 'Enabled' : 'Disabled'}</Text>
                        <Text style={styles.statusText}>Rubber Band: {enableRubberBand ? 'Enabled' : 'Disabled'}</Text>
                    </View>
                </View>
            </InteractiveBottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: '#666',
    },
    section: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    variantGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    variantButton: {
        width: '48%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginBottom: 8,
        alignItems: 'center',
    },
    variantButtonActive: {
        borderColor: '#4CAF50',
        backgroundColor: '#F1F8E9',
    },
    variantButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    variantButtonTextActive: {
        color: '#4CAF50',
    },
    variantDescription: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    configRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    configLabel: {
        fontSize: 16,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    snapButton: {
        backgroundColor: '#607D8B',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    feedbackGuide: {
        marginTop: 8,
    },
    feedbackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    feedbackIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    feedbackText: {
        fontSize: 14,
        color: '#666',
    },
    instructions: {
        marginTop: 8,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        lineHeight: 20,
    },
    content: {
        padding: 20,
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    contentSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    featureList: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    featureItem: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
        lineHeight: 20,
    },
    statusCard: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#2196F3',
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    statusText: {
        fontSize: 12,
        color: '#555',
        marginBottom: 2,
    },
});