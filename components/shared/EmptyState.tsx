import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
    actionTitle?: string;
    onActionPress?: () => void;
    style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'document-outline',
    title,
    message,
    actionTitle,
    onActionPress,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Ionicons
                name={icon}
                size={64}
                color={theme.colors.textLight}
                style={styles.icon}
            />

            <Text style={styles.title}>{title}</Text>

            {message && (
                <Text style={styles.message}>{message}</Text>
            )}

            {actionTitle && onActionPress && (
                <Button
                    title={actionTitle}
                    onPress={onActionPress}
                    variant="outline"
                    style={styles.action}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    icon: {
        marginBottom: theme.spacing.lg,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    message: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        lineHeight: 24,
    },
    action: {
        marginTop: theme.spacing.md,
    },
});