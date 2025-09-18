import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Card } from '../ui';

export interface DashboardStatsProps {
    upcomingPickups: number;
    completedThisMonth: number;
    totalWasteDiverted: number;
    co2Saved: number;
}

interface StatItem {
    id: string;
    title: string;
    value: string;
    subtitle: string;
    icon: string;
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    upcomingPickups,
    completedThisMonth,
    totalWasteDiverted,
    co2Saved,
}) => {
    const stats: StatItem[] = [
        {
            id: 'upcoming',
            title: 'Upcoming',
            value: upcomingPickups.toString(),
            subtitle: 'Scheduled pickups',
            icon: 'calendar-outline',
            color: theme.colors.primary,
        },
        {
            id: 'completed',
            title: 'This Month',
            value: completedThisMonth.toString(),
            subtitle: 'Completed pickups',
            icon: 'checkmark-circle-outline',
            color: theme.colors.success,
            trend: {
                value: 12,
                isPositive: true,
            },
        },
        {
            id: 'waste',
            title: 'Total Waste',
            value: `${totalWasteDiverted}kg`,
            subtitle: 'Diverted from landfill',
            icon: 'leaf-outline',
            color: theme.colors.success,
        },
        {
            id: 'co2',
            title: 'CO₂ Saved',
            value: `${co2Saved}kg`,
            subtitle: 'Carbon footprint reduced',
            icon: 'earth-outline',
            color: theme.colors.info,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Your Impact</Text>
            <View style={styles.statsGrid}>
                {stats.map((stat) => (
                    <Card key={stat.id} style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                                <Ionicons
                                    name={stat.icon as any}
                                    size={20}
                                    color={stat.color}
                                />
                            </View>
                            {stat.trend && (
                                <View style={[
                                    styles.trendBadge,
                                    { backgroundColor: stat.trend.isPositive ? theme.colors.success + '15' : theme.colors.error + '15' }
                                ]}>
                                    <Ionicons
                                        name={stat.trend.isPositive ? 'trending-up' : 'trending-down'}
                                        size={12}
                                        color={stat.trend.isPositive ? theme.colors.success : theme.colors.error}
                                    />
                                    <Text style={[
                                        styles.trendText,
                                        { color: stat.trend.isPositive ? theme.colors.success : theme.colors.error }
                                    ]}>
                                        {stat.trend.value}%
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.statContent}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                            <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
                        </View>
                    </Card>
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    statCard: {
        width: '48%',
        padding: theme.spacing.md,
        minHeight: 120,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
        gap: 2,
    },
    trendText: {
        ...theme.typography.caption,
        fontSize: 10,
        fontWeight: '600',
    },
    statContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    statValue: {
        ...theme.typography.h3,
        color: theme.colors.text,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    statTitle: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: 2,
    },
    statSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        lineHeight: 14,
    },
});