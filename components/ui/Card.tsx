import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface CardProps {
    children: React.ReactNode;
    elevation?: 'none' | 'sm' | 'md' | 'lg';
    padding?: number;
    onPress?: () => void;
    style?: ViewStyle;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    elevation = 'sm',
    padding = theme.spacing.md,
    onPress,
    style,
    disabled = false,
}) => {
    const cardStyle = [
        styles.base,
        elevation !== 'none' && theme.shadows[elevation],
        { padding },
        disabled && styles.disabled,
        style,
    ];

    if (onPress && !disabled) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    disabled: {
        opacity: 0.6,
    },
});