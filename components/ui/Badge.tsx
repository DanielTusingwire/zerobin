import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface BadgeProps {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    text,
    variant = 'default',
    size = 'medium',
    style,
    textStyle,
}) => {
    const badgeStyle = [
        styles.base,
        styles[variant],
        styles[size],
        style,
    ];

    const badgeTextStyle = [
        styles.text,
        styles[`${size}Text`],
        styles[`${variant}Text`],
        textStyle,
    ];

    return (
        <View style={badgeStyle}>
            <Text style={badgeTextStyle}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        alignSelf: 'flex-start',
    },

    // Variants
    default: {
        backgroundColor: theme.colors.surface,
    },
    success: {
        backgroundColor: theme.colors.success,
    },
    warning: {
        backgroundColor: theme.colors.warning,
    },
    error: {
        backgroundColor: theme.colors.error,
    },
    info: {
        backgroundColor: theme.colors.info,
    },

    // Sizes
    small: {
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
    },
    medium: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    large: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },

    // Text styles
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },

    // Size text styles
    smallText: {
        fontSize: 10,
    },
    mediumText: {
        fontSize: 12,
    },
    largeText: {
        fontSize: 14,
    },

    // Variant text styles
    defaultText: {
        color: theme.colors.text,
    },
    successText: {
        color: theme.colors.background,
    },
    warningText: {
        color: theme.colors.background,
    },
    errorText: {
        color: theme.colors.background,
    },
    infoText: {
        color: theme.colors.background,
    },
});