import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    maxRating?: number;
    size?: 'small' | 'medium' | 'large';
    readonly?: boolean;
    showLabel?: boolean;
    label?: string;
    color?: string;
}

const STAR_SIZES = {
    small: 16,
    medium: 24,
    large: 32,
};

const RATING_LABELS = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
};

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    maxRating = 5,
    size = 'medium',
    readonly = false,
    showLabel = false,
    label,
    color = theme.colors.warning,
}) => {
    const starSize = STAR_SIZES[size];
    const isInteractive = !readonly && onRatingChange;

    const handleStarPress = (starIndex: number) => {
        if (isInteractive) {
            onRatingChange!(starIndex + 1);
        }
    };

    const renderStar = (starIndex: number) => {
        const isFilled = starIndex < rating;
        const isHalfFilled = starIndex < rating && starIndex + 0.5 >= rating;

        return (
            <TouchableOpacity
                key={starIndex}
                style={[
                    styles.starButton,
                    !isInteractive && styles.starButtonDisabled,
                ]}
                onPress={() => handleStarPress(starIndex)}
                disabled={!isInteractive}
                activeOpacity={isInteractive ? 0.7 : 1}
            >
                <Ionicons
                    name={isFilled ? 'star' : 'star-outline'}
                    size={starSize}
                    color={isFilled ? color : theme.colors.border}
                />
            </TouchableOpacity>
        );
    };

    const getRatingLabel = (): string => {
        if (label) return label;
        if (showLabel && rating > 0) {
            return RATING_LABELS[Math.round(rating) as keyof typeof RATING_LABELS] || '';
        }
        return '';
    };

    return (
        <View style={styles.container}>
            <View style={styles.starsContainer}>
                {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
            </View>

            {(showLabel || label) && (
                <View style={styles.labelContainer}>
                    <Text style={[
                        styles.ratingLabel,
                        size === 'small' && styles.ratingLabelSmall,
                        size === 'large' && styles.ratingLabelLarge,
                    ]}>
                        {getRatingLabel()}
                    </Text>
                    {showLabel && rating > 0 && (
                        <Text style={[
                            styles.ratingValue,
                            size === 'small' && styles.ratingValueSmall,
                            size === 'large' && styles.ratingValueLarge,
                        ]}>
                            ({rating}/{maxRating})
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
    },
    starButton: {
        padding: theme.spacing.xs,
    },
    starButtonDisabled: {
        padding: 0,
    },
    labelContainer: {
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    ratingLabel: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontWeight: '600',
    },
    ratingLabelSmall: {
        ...theme.typography.caption,
    },
    ratingLabelLarge: {
        ...theme.typography.body1,
    },
    ratingValue: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    ratingValueSmall: {
        fontSize: 10,
    },
    ratingValueLarge: {
        ...theme.typography.body2,
    },
});