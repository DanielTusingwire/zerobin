import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface WelcomeHeaderProps {
    greeting: string;
    userName: string;
    subtitle?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
    greeting,
    userName,
    subtitle,
}) => {
    const getGreetingIcon = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'sunny';
        if (hour < 17) return 'partly-sunny';
        return 'moon';
    };

    const getGreetingColor = () => {
        const hour = new Date().getHours();
        if (hour < 12) return theme.colors.warning;
        if (hour < 17) return theme.colors.primary;
        return theme.colors.info;
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.greetingRow}>
                    <View style={[styles.iconContainer, { backgroundColor: getGreetingColor() + '20' }]}>
                        <Ionicons
                            name={getGreetingIcon()}
                            size={24}
                            color={getGreetingColor()}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.greeting}>
                            {greeting}, {userName}!
                        </Text>
                        {subtitle && (
                            <Text style={styles.subtitle}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Decorative background elements */}
            <View style={styles.backgroundDecoration}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: theme.colors.primary + '08',
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    content: {
        padding: theme.spacing.lg,
        zIndex: 1,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        ...theme.typography.h3,
        color: theme.colors.text,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    backgroundDecoration: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 0,
    },
    circle: {
        position: 'absolute',
        backgroundColor: theme.colors.primary + '10',
        borderRadius: 50,
    },
    circle1: {
        width: 80,
        height: 80,
        top: -20,
        right: -20,
    },
    circle2: {
        width: 40,
        height: 40,
        bottom: -10,
        right: 60,
    },
    circle3: {
        width: 60,
        height: 60,
        top: 20,
        right: -30,
        backgroundColor: theme.colors.success + '08',
    },
});