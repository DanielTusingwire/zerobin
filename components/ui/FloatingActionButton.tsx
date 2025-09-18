import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface FloatingActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    size?: 'small' | 'medium' | 'large';
    backgroundColor?: string;
    iconColor?: string;
    style?: ViewStyle;
    disabled?: boolean;
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon,
    onPress,
    size = 'medium',
    backgroundColor = theme.colors.primary,
    iconColor = theme.colors.background,
    style,
    disabled = false,
    position = 'bottom-right',
}) => {
    const fabStyle = [
        styles.base,
        styles[size],
        styles[position],
        { backgroundColor },
        disabled && styles.disabled,
        style,
    ];

    const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;

    return (
        <TouchableOpacity
            style={fabStyle}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Ionicons
                name={icon}
                size={iconSize}
                color={iconColor}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        borderRadius: theme.borderRadius.round,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },

    // Sizes
    small: {
        width: 40,
        height: 40,
    },
    medium: {
        width: 56,
        height: 56,
    },
    large: {
        width: 72,
        height: 72,
    },

    // Positions
    'bottom-right': {
        bottom: theme.spacing.lg + 60, // Account for tab bar
        right: theme.spacing.lg,
    },
    'bottom-left': {
        bottom: theme.spacing.lg + 60, // Account for tab bar
        left: theme.spacing.lg,
    },
    'bottom-center': {
        bottom: theme.spacing.lg + 60, // Account for tab bar
        alignSelf: 'center',
    },

    disabled: {
        opacity: 0.5,
    },
});