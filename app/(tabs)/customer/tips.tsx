import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { TipCard, TipCategoryFilter, TipDetail, TipSearch } from '../../../components/customer';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { Card } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useAppContext, useCustomerContext } from '../../../contexts';
import { WasteType } from '../../../types/common';
import { WasteTip } from '../../../types/customer';

// Customer Tips Screen - comprehensive waste sorting educational content
export default function CustomerTipsScreen() {
    const { state: appState } = useAppContext();
    const {
        state: customerState,
        loadWasteTips,
        loadTipCategories,
        setTipCategoryFilter,
        setTipsSearchQuery,
    } = useCustomerContext();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedTip, setSelectedTip] = useState<WasteTip | null>(null);
    const [showTipDetail, setShowTipDetail] = useState(false);

    // Filter and search tips
    const filteredTips = useMemo(() => {
        let filtered = [...customerState.filteredTips];

        // Sort by relevance: local tips first, then by helpful rating, then by views
        return filtered.sort((a, b) => {
            // Local tips first
            if (a.isLocal && !b.isLocal) return -1;
            if (!a.isLocal && b.isLocal) return 1;

            // Then by helpful percentage
            const aHelpful = a.helpful + a.notHelpful > 0 ? a.helpful / (a.helpful + a.notHelpful) : 0;
            const bHelpful = b.helpful + b.notHelpful > 0 ? b.helpful / (b.helpful + b.notHelpful) : 0;
            if (aHelpful !== bHelpful) return bHelpful - aHelpful;

            // Finally by views
            return b.views - a.views;
        });
    }, [customerState.filteredTips]);

    // Calculate tip counts for categories
    const tipCounts = useMemo(() => {
        const tips = customerState.wasteTips;
        return {
            all: tips.length,
            [WasteType.GENERAL]: tips.filter(t => t.category === WasteType.GENERAL).length,
            [WasteType.RECYCLABLE]: tips.filter(t => t.category === WasteType.RECYCLABLE).length,
            [WasteType.ORGANIC]: tips.filter(t => t.category === WasteType.ORGANIC).length,
            [WasteType.HAZARDOUS]: tips.filter(t => t.category === WasteType.HAZARDOUS).length,
        };
    }, [customerState.wasteTips]);

    // Popular search suggestions
    const searchSuggestions = useMemo(() => {
        const allTags = customerState.wasteTips.flatMap(tip => tip.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([tag]) => tag);
    }, [customerState.wasteTips]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                loadWasteTips(),
                loadTipCategories(),
            ]);
        } catch (error) {
            console.error('Failed to refresh tips:', error);
        } finally {
            setRefreshing(false);
        }
    }, [loadWasteTips, loadTipCategories]);

    const handleTipPress = useCallback((tip: WasteTip) => {
        setSelectedTip(tip);
        setShowTipDetail(true);

        // TODO: Increment view count
        // This would typically be handled by the backend
    }, []);

    const handleTipHelpful = useCallback(async (tip: WasteTip) => {
        try {
            // TODO: Implement helpful vote
            Alert.alert(
                'Thank You!',
                'Your feedback helps us improve our tips.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to mark tip as helpful:', error);
        }
    }, []);

    const handleTipNotHelpful = useCallback(async (tip: WasteTip) => {
        try {
            // TODO: Implement not helpful vote
            Alert.alert(
                'Feedback Received',
                'We\'ll work on improving this tip. Thank you for your feedback.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to mark tip as not helpful:', error);
        }
    }, []);

    const handleCategoryChange = useCallback((category: WasteType | 'all') => {
        setTipCategoryFilter(category);
    }, [setTipCategoryFilter]);

    const handleSearchChange = useCallback((query: string) => {
        setTipsSearchQuery(query);
    }, [setTipsSearchQuery]);

    const handleClearSearch = useCallback(() => {
        setTipsSearchQuery('');
    }, [setTipsSearchQuery]);

    const handleSuggestionPress = useCallback((suggestion: string) => {
        setTipsSearchQuery(suggestion);
    }, [setTipsSearchQuery]);

    const handleCloseTipDetail = useCallback(() => {
        setShowTipDetail(false);
        setSelectedTip(null);
    }, []);

    const renderTipItem = useCallback(({ item }: { item: WasteTip }) => (
        <TipCard
            tip={item}
            onPress={handleTipPress}
            onHelpful={handleTipHelpful}
            onNotHelpful={handleTipNotHelpful}
        />
    ), [handleTipPress, handleTipHelpful, handleTipNotHelpful]);

    const renderEmptyState = () => {
        if (customerState.tipsSearchQuery) {
            return (
                <EmptyState
                    icon="search-outline"
                    title="No Tips Found"
                    message={`No tips match "${customerState.tipsSearchQuery}"`}
                    actionTitle="Clear Search"
                    onActionPress={handleClearSearch}
                />
            );
        }

        if (customerState.selectedTipCategory !== 'all') {
            return (
                <EmptyState
                    icon="filter-outline"
                    title="No Tips in Category"
                    message={`No tips found for ${customerState.selectedTipCategory} waste`}
                    actionTitle="View All Tips"
                    onActionPress={() => handleCategoryChange('all')}
                />
            );
        }

        return (
            <EmptyState
                icon="book-outline"
                title="No Tips Available"
                message="Tips will appear here once they're loaded"
                actionTitle="Refresh"
                onActionPress={handleRefresh}
            />
        );
    };

    const renderWelcomeCard = () => (
        <Card style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
                <Ionicons name="school-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.welcomeTitle}>Learn Proper Waste Sorting</Text>
            </View>
            <Text style={styles.welcomeDescription}>
                Discover best practices for sorting different types of waste, reduce environmental impact,
                and learn about local recycling guidelines in your area.
            </Text>

            <View style={styles.welcomeStats}>
                <View style={styles.welcomeStatItem}>
                    <Text style={styles.welcomeStatValue}>{customerState.wasteTips.length}</Text>
                    <Text style={styles.welcomeStatLabel}>Tips Available</Text>
                </View>
                <View style={styles.welcomeStatItem}>
                    <Text style={styles.welcomeStatValue}>
                        {customerState.wasteTips.filter(t => t.isLocal).length}
                    </Text>
                    <Text style={styles.welcomeStatLabel}>Local Guidelines</Text>
                </View>
                <View style={styles.welcomeStatItem}>
                    <Text style={styles.welcomeStatValue}>{customerState.tipCategories.length}</Text>
                    <Text style={styles.welcomeStatLabel}>Categories</Text>
                </View>
            </View>
        </Card>
    );

    const renderHeader = () => (
        <View>
            {customerState.wasteTips.length > 0 && renderWelcomeCard()}

            <TipSearch
                searchQuery={customerState.tipsSearchQuery}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                showSuggestions={!customerState.tipsSearchQuery}
                suggestions={searchSuggestions}
                onSuggestionPress={handleSuggestionPress}
            />

            <TipCategoryFilter
                categories={customerState.tipCategories}
                selectedCategory={customerState.selectedTipCategory}
                onCategoryChange={handleCategoryChange}
                tipCounts={tipCounts}
            />

            {filteredTips.length > 0 && (
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsTitle}>
                        {customerState.tipsSearchQuery
                            ? `Search Results (${filteredTips.length})`
                            : customerState.selectedTipCategory === 'all'
                                ? `All Tips (${filteredTips.length})`
                                : `${customerState.selectedTipCategory} Tips (${filteredTips.length})`
                        }
                    </Text>
                    <Text style={styles.resultsSubtitle}>
                        {customerState.tipsSearchQuery
                            ? `Showing tips matching "${customerState.tipsSearchQuery}"`
                            : 'Sorted by relevance and helpfulness'
                        }
                    </Text>
                </View>
            )}
        </View>
    );

    if (customerState.tipsLoading && !refreshing) {
        return (
            <View style={styles.container}>
                <Header title="Waste Sorting Tips" />
                <LoadingSpinner message="Loading educational content..." />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Waste Sorting Tips"
                subtitle={`${customerState.wasteTips.length} educational tip${customerState.wasteTips.length !== 1 ? 's' : ''}`}
                rightIcon="refresh"
                onRightPress={handleRefresh}
            />

            <FlatList
                data={filteredTips}
                renderItem={renderTipItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    filteredTips.length === 0 && styles.emptyListContent,
                ]}
            />

            <TipDetail
                tip={selectedTip}
                visible={showTipDetail}
                onClose={handleCloseTipDetail}
                onHelpful={handleTipHelpful}
                onNotHelpful={handleTipNotHelpful}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        paddingBottom: theme.spacing.xl,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    welcomeCard: {
        margin: theme.spacing.md,
        marginTop: 0,
        padding: theme.spacing.lg,
    },
    welcomeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    welcomeTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
    },
    welcomeDescription: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: theme.spacing.lg,
    },
    welcomeStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    welcomeStatItem: {
        alignItems: 'center',
    },
    welcomeStatValue: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.xs,
    },
    welcomeStatLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    resultsHeader: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    resultsTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    resultsSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
});