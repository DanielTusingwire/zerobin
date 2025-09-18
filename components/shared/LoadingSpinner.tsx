import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    style?: ViewStyle;
    overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = theme.colors.primary,
    message,
    style,
    overlay = false,
}) => {
    const containerStyle = [
        styles.container,
        overlay && styles.overlay,
        style,
    ];

    return (
        <View style={containerStyle}>
            <ActivityIndicator size={size} color={color} />
            {message && (
                <Text style={styles.message}>{message}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
    },
    message: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
});