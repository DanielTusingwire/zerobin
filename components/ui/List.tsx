import React from 'react';
import {
    FlatList,
    ListRenderItem,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface ListProps<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
    keyExtractor: (item: T, index: number) => string;
    emptyMessage?: string;
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    horizontal?: boolean;
    numColumns?: number;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    contentContainerStyle?: any;
    ItemSeparatorComponent?: React.ComponentType<any>;
}

export const List = <T,>({
    data,
    renderItem,
    keyExtractor,
    emptyMessage = 'No items found',
    loading = false,
    refreshing = false,
    onRefresh,
    horizontal = false,
    numColumns = 1,
    showsVerticalScrollIndicator = true,
    showsHorizontalScrollIndicator = true,
    contentContainerStyle,
    ItemSeparatorComponent,
}: ListProps<T>) => {
    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
    );

    const renderLoadingComponent = () => (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );

    if (loading && data.length === 0) {
        return renderLoadingComponent();
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                ) : undefined
            }
            horizontal={horizontal}
            numColumns={numColumns}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            contentContainerStyle={[
                data.length === 0 && styles.emptyContentContainer,
                contentContainerStyle,
            ]}
            ItemSeparatorComponent={ItemSeparatorComponent}
        />
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    loadingText: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
    },
    emptyContentContainer: {
        flexGrow: 1,
    },
});