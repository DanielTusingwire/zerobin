import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Common dimensions for consistent spacing
export const DIMENSIONS = {
    // Screen dimensions
    screenWidth: width,
    screenHeight: height,

    // Common spacing
    padding: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    // Component dimensions
    button: {
        height: {
            small: 32,
            medium: 44,
            large: 56,
        },
        minWidth: 88,
    },

    card: {
        minHeight: 80,
        borderRadius: 8,
    },

    input: {
        height: 44,
        borderRadius: 8,
    },

    header: {
        height: 56,
    },

    tabBar: {
        height: 60,
    },

    // Touch targets (minimum 44pt for accessibility)
    touchTarget: {
        minHeight: 44,
        minWidth: 44,
    },

    // Icon sizes
    icon: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 32,
        xl: 48,
    },

    // Avatar sizes
    avatar: {
        sm: 32,
        md: 48,
        lg: 64,
        xl: 96,
    },
} as const;

export type Dimensions = typeof DIMENSIONS;