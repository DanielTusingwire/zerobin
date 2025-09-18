import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface TipSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onClearSearch: () => void;
    placeholder?: string;
    showSuggestions?: boolean;
    suggestions?: string[];
    onSuggestionPress?: (suggestion: string) => void;
}

export const TipSearch: React.FC<TipSearchProps> = ({
    searchQuery,
    onSearchChange,
    onClearSearch,
    placeholder = 'Search tips, materials, or keywords...',
    showSuggestions = false,
    suggestions = [],
    onSuggestionPress,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
        onSearchChange('');
        onClearSearch();
    };

    const renderSuggestions = () => {
        if (!showSuggestions || !isFocused || suggestions.length === 0) {
            return null;
        }

        return (
            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Popular searches:</Text>
                <View style={styles.suggestions}>
                    {suggestions.slice(0, 6).map((suggestion, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.suggestionChip}
                            onPress={() => {
                                onSearchChange(suggestion);
                                onSuggestionPress?.(suggestion);
                                setIsFocused(false);
                            }}
                        >
                            <Ionicons name="search-outline" size={12} color={theme.colors.textSecondary} />
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[
                styles.searchContainer,
                isFocused && styles.searchContainerFocused,
            ]}>
                <View style={styles.searchInputContainer}>
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder={placeholder}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClear}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {searchQuery.length > 0 && (
                    <View style={styles.searchStats}>
                        <Text style={styles.searchStatsText}>
                            Searching for "{searchQuery}"
                        </Text>
                    </View>
                )}
            </View>

            {renderSuggestions()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    searchContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        ...theme.shadows.sm,
    },
    searchContainerFocused: {
        borderColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...theme.typography.body1,
        color: theme.colors.text,
        paddingVertical: theme.spacing.xs,
    },
    clearButton: {
        padding: theme.spacing.xs,
    },
    searchStats: {
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    searchStatsText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    suggestionsContainer: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    suggestionsTitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: theme.spacing.sm,
    },
    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    suggestionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.round,
        gap: theme.spacing.xs,
    },
    suggestionText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});