import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface QuickActionsProps {
    onRequestPickup: () => void;
    onViewSchedule: () => void;
    onViewTips: () => void;
    onViewProfile: () => void;
}

interface QuickActionItem {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    onPress: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onRequestPickup,
    onViewSchedule,
    onViewTips,
    onViewProfile,
}) => {
    const actions: QuickActionItem[] = [
        {
            id: 'request',
            title: 'Request Pickup',
            subtitle: 'Schedule new collection',
            icon: 'add-circle',
            color: theme.colors.primary,
            onPress: onRequestPickup,
        },
        {
            id: 'schedule',
            title: 'My Schedule',
            subtitle: 'View upcoming pickups',
            icon: 'calendar',
            color: theme.colors.info,
            onPress: onViewSchedule,
        },
        {
            id: 'tips',
            title: 'Eco Tips',
            subtitle: 'Learn & save planet',
            icon: 'bulb',
            color: theme.colors.warning,
            onPress: onViewTips,
        },
        {
            id: 'profile',
            title: 'My Profile',
            subtitle: 'Account & settings',
            icon: 'person',
            color: theme.colors.success,
            onPress: onViewProfile,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={styles.actionItem}
                        onPress={action.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                            <Ionicons
                                name={action.icon as any}
                                size={24}
                                color={action.color}
                            />
                        </View>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    actionItem: {
        width: '48%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,

        // Shadow for iOS
        shadowColor: theme.colors.text,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,

        // Elevation for Android
        elevation: 2,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    actionTitle: {
        ...theme.typography.body1,
        color: theme.colors.text,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    actionSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 16,
    },
});