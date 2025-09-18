import React, { useRef } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { InteractiveBottomSheet, InteractiveBottomSheetRef } from './InteractiveBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Test component to demonstrate the enhanced animation system
 * Features tested:
 * - Different animation types (gentle, snappy, bouncy, smooth)
 * - Programmatic snap point navigation
 * - Animation interruption and state tracking
 * - Visual feedback during animations
 */
export const InteractiveBottomSheetAnimationTest: React.FC = () => {
    const bottomSheetRef = useRef<InteractiveBottomSheetRef>(null);

    const handleAnimationTest = (animationType: 'gentle' | 'snappy' | 'bouncy' | 'smooth', snapPointIndex: number) => {
        bottomSheetRef.current?.animateToSnapPoint(snapPointIndex, animationType);
    };

    const handleHeightChange = (height: number) => {
        console.log(`Bottom sheet height changed to: ${height}px (${Math.round((height / SCREEN_HEIGHT) * 100)}%)`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Interactive Bottom Sheet Animation Test</Text>
            <Text style={styles.subtitle}>Test different animation types and snap points</Text>

            {/* Animation Type Test Buttons */}
            <View style={styles.buttonGroup}>
                <Text style={styles.groupTitle}>Animation Types (to 70% height):</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.gentleButton]}
                        onPress={() => handleAnimationTest('gentle', 1)}
                    >
                        <Text style={styles.buttonText}>Gentle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.snappyButton]}
                        onPress={() => handleAnimationTest('snappy', 1)}
                    >
                        <Text style={styles.buttonText}>Snappy</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.bouncyButton]}
                        onPress={() => handleAnimationTest('bouncy', 1)}
                    >
                        <Text style={styles.buttonText}>Bouncy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.smoothButton]}
                        onPress={() => handleAnimationTest('smooth', 1)}
                    >
                        <Text style={styles.buttonText}>Smooth</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Snap Point Test Buttons */}
            <View style={styles.buttonGroup}>
                <Text style={styles.groupTitle}>Snap Points (smooth animation):</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.snapButton]}
                        onPress={() => handleAnimationTest('smooth', 0)}
                    >
                        <Text style={styles.buttonText}>30%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.snapButton]}
                        onPress={() => handleAnimationTest('smooth', 1)}
                    >
                        <Text style={styles.buttonText}>70%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.snapButton]}
                        onPress={() => handleAnimationTest('smooth', 2)}
                    >
                        <Text style={styles.buttonText}>90%</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Instructions:</Text>
                <Text style={styles.instructionText}>• Drag the handle to test gesture-based animations</Text>
                <Text style={styles.instructionText}>• Use buttons to test programmatic animations</Text>
                <Text style={styles.instructionText}>• Notice different spring physics for each animation type</Text>
                <Text style={styles.instructionText}>• Observe visual feedback during drag interactions</Text>
            </View>

            <InteractiveBottomSheet
                ref={bottomSheetRef}
                minHeight={SCREEN_HEIGHT * 0.2}
                maxHeight={SCREEN_HEIGHT * 0.95}
                initialHeight={SCREEN_HEIGHT * 0.3}
                onHeightChange={handleHeightChange}
                snapPoints={[0.3, 0.7, 0.9]}
            >
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Bottom Sheet Content</Text>
                    <Text style={styles.contentText}>
                        This content area demonstrates the smooth animation system.
                        The animations adapt based on gesture velocity and provide
                        natural spring physics for different interaction types.
                    </Text>

                    <View style={styles.featureList}>
                        <Text style={styles.featureTitle}>Animation Features:</Text>
                        <Text style={styles.featureItem}>✓ Adaptive spring physics</Text>
                        <Text style={styles.featureItem}>✓ Velocity-based animation selection</Text>
                        <Text style={styles.featureItem}>✓ Animation interruption handling</Text>
                        <Text style={styles.featureItem}>✓ Enhanced visual feedback</Text>
                        <Text style={styles.featureItem}>✓ Smooth snap point transitions</Text>
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
        marginBottom: 30,
        color: '#666',
    },
    buttonGroup: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    gentleButton: {
        backgroundColor: '#4CAF50',
    },
    snappyButton: {
        backgroundColor: '#2196F3',
    },
    bouncyButton: {
        backgroundColor: '#FF9800',
    },
    smoothButton: {
        backgroundColor: '#9C27B0',
    },
    snapButton: {
        backgroundColor: '#607D8B',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    instructions: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    content: {
        padding: 20,
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 20,
    },
    featureList: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
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
    },
});