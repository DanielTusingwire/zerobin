import { theme } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

interface FloatingLabelInputProps extends TextInputProps {
    label: string;
    error?: string;
    hint?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    label,
    error,
    hint,
    value,
    onChangeText,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleChangeText = (text: string) => {
        if (text && animatedValue._value === 0) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else if (!text && !isFocused) {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
        onChangeText?.(text);
    };

    const labelStyle = {
        position: 'absolute' as const,
        left: 16,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, -8],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['#9CA3AF', error ? '#EF4444' : isFocused ? theme.colors.secondary : '#6B7280'],
        }),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 4,
        zIndex: 1,
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Animated.Text style={labelStyle}>
                    {label}
                </Animated.Text>
                <TextInput
                    style={[
                        styles.textInput,
                        isFocused && styles.inputFocused,
                        error && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    inputContainer: {
        position: 'relative',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 14,
        color: '#1F2937',
        backgroundColor: '#FFFFFF',
    },
    inputFocused: {
        borderColor: theme.colors.secondary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: '#EF4444',
        borderWidth: 2,
    },
    errorText: {
        fontSize: 11,
        color: '#EF4444',
        marginTop: 4,
        marginLeft: 4,
    },
    hintText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
        marginLeft: 4,
    },
});