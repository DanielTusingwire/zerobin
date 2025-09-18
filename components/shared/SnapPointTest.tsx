import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Slider,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { InteractiveBottomSheet, InteractiveBottomSheetRef } from './InteractiveBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Test component to demonstrate enhanced snap point logic and rubber band effects
 * Features tested:
 * - Configurable snap points with priority and magnetic ranges
 * - Rubber band effect for over-drag scenarios
 * - Velocity-based snap point prediction
 * - Snap-back animations from over-drag
 */
export const SnapPointTest: React.FC = () => {
    const bottomSheetRef = useRef<InteractiveBottomSheetRef>(null);
    const [enableRubberBand, setEnableRubberBand] = useState(true);
    const [rubberBandFactor, setRubberBandFactor] = useState(0.3);
    const [snapPointConfig, setSnapPointConfig] = useState<number[]>([0.2, 0.5, 0.8]);

    const handleSnapPointTest = (snapPointIndex: number) => {
        bottomSheetRef.current?.animateToSnapPoint(snapPointIndex, 'smooth');
    };

    const handleHeightChange = (height: number) => {
        const percentage = Math.round((height / SCREEN_HEIGHT) * 100);
        console.log(`Bottom sheet height: ${height}px (${percentage}%)`);
    };

    const addSnapPoint = () => {
        if (snapPointConfig.length < 5) {
            const newPoint = Math.random() * 0.6 + 0.2; // Random between 0.2 and 0.8
            const newConfig = [...snapPointConfig, newPoint].sort((a, b) => a - b);
            setSnapPointConfig(newConfig);
        }
    };

    const removeSnapPoint = () => {
        if (snapPointConfig.length > 2) {
            const newConfig = [...snapPointConfig];
            newConfig.pop();
            setSnapPointConfig(newConfig);
        }
    };

    const resetSnapPoints = () => {
        setSnapPointConfig([0.2, 0.5, 0.8]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Snap Point Logic Test</Text>
            <Text style={styles.subtitle}>Test enhanced snap points and rubber band effects</Text>

            {/* Configuration Controls */}
            <View style={styles.configSection}>
                <Text style={styles.sectionTitle}>Configuration</Text>

                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>Rubber Band Effect:</Text>
                    <Switch
                        value={enableRubberBand}
                        onValueChange={setEnableRubberBand}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={enableRubberBand ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>
                        Rubber Band Factor: {rubberBandFactor.toFixed(2)}
                    </Text>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0.1}
                    maximumValue={0.8}
                    value={rubberBandFactor}
                    onValueChange={setRubberBandFactor}
                    minimumTrackTintColor="#1fb28a"
                    maximumTrackTintColor="#d3d3d3"
                    thumbStyle={{ backgroundColor: '#1fb28a' }}
                />

                <View style={styles.configRow}>
                    <Text style={styles.configLabel}>
                        Snap Points: {snapPointConfig.map(p => `${Math.round(p * 100)}%`).join(', ')}
                    </Text>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.configButton} onPress={addSnapPoint}>
                        <Text style={styles.configButtonText}>Add Point</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.configButton} onPress={removeSnapPoint}>
                        <Text style={styles.configButtonText}>Remove Point</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.configButton} onPress={resetSnapPoints}>
                        <Text style={styles.configButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Snap Point Test Buttons */}
            <View style={styles.buttonGroup}>
                <Text style={styles.groupTitle}>Test Snap Points:</Text>
                <View style={styles.buttonRow}>
                    {snapPointConfig.map((point, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, styles.snapButton]}
                            onPress={() => handleSnapPointTest(index)}
                        >
                            <Text style={styles.buttonText}>{Math.round(point * 100)}%</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Test Instructions:</Text>
                <Text style={styles.instructionText}>• Drag beyond bounds to test rubber band effect</Text>
                <Text style={styles.instructionText}>• Try fast vs slow gestures to see velocity-based snapping</Text>
                <Text style={styles.instructionText}>• Notice magnetic ranges around snap points</Text>
                <Text style={styles.instructionText}>• Test with different rubber band factors</Text>
                <Text style={styles.instructionText}>• Add/remove snap points to test priority system</Text>
            </View>

            <InteractiveBottomSheet
                ref={bottomSheetRef}
                minHeight={SCREEN_HEIGHT * 0.15}
                maxHeight={SCREEN_HEIGHT * 0.95}
                initialHeight={SCREEN_HEIGHT * snapPointConfig[1]}
                onHeightChange={handleHeightChange}
                snapPoints={snapPointConfig}
                enableRubberBand={enableRubberBand}
                rubberBandFactor={rubberBandFactor}
            >
                <View style={styles.content}>
                    <Text style={styles.contentTitle}>Enhanced Snap Point System</Text>

                    <View style={styles.featureGrid}>
                        <View style={styles.featureCard}>
                            <Text style={styles.featureCardTitle}>Magnetic Ranges</Text>
                            <Text style={styles.featureCardText}>
                                Snap points have magnetic ranges that attract the modal when nearby
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <Text style={styles.featureCardTitle}>Priority System</Text>
                            <Text style={styles.featureCardText}>
                                Standard position has highest priority, min/max have higher priority than intermediate points
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <Text style={styles.featureCardTitle}>Velocity Prediction</Text>
                            <Text style={styles.featureCardText}>
                                Fast gestures predict where you're heading and snap accordingly
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <Text style={styles.featureCardTitle}>Rubber Band Effect</Text>
                            <Text style={styles.featureCardText}>
                                Over-drag beyond bounds with natural resistance and snap-back
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statusSection}>
                        <Text style={styles.statusTitle}>Current Configuration:</Text>
                        <Text style={styles.statusText}>Rubber Band: {enableRubberBand ? 'Enabled' : 'Disabled'}</Text>
                        <Text style={styles.statusText}>Resistance: {(rubberBandFactor * 100).toFixed(0)}%</Text>
                        <Text style={styles.statusText}>Snap Points: {snapPointConfig.length}</Text>
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
        marginBottom: 20,
        color: '#666',
    },
    configSection: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
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
        flex: 1,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 12,
    },
    buttonGroup: {
        marginBottom: 20,
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
        paddingHorizontal: 8,
        borderRadius: 8,
        marginHorizontal: 2,
        alignItems: 'center',
    },
    snapButton: {
        backgroundColor: '#607D8B',
    },
    configButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    configButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
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
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    featureCard: {
        width: '48%',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50',
    },
    featureCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    featureCardText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    statusSection: {
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