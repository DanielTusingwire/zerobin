import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

/**
 * Simple test component to verify gesture handler and reanimated are working
 * This component can be removed after testing
 */
export const GestureTest: React.FC = () => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const logGesture = (message: string) => {
        console.log(`Gesture Test: ${message}`);
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(logGesture)('Pan started');
            scale.value = withSpring(1.1);
        })
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            runOnJS(logGesture)('Pan ended');
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gesture Handler Test</Text>
            <Text style={styles.subtitle}>Drag the box below to test gestures</Text>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.box, animatedStyle]}>
                    <Text style={styles.boxText}>Drag Me!</Text>
                </Animated.View>
            </GestureDetector>

            <Text style={styles.instructions}>
                If you can drag this box and it springs back,
                gesture handler is working correctly!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: '#00796B',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    boxText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    instructions: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        maxWidth: 250,
    },
});