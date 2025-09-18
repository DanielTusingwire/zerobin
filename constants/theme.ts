// Theme constants for consistent styling across the app
export const theme = {
  colors: {
    // Lime green as primary - modern, eco-friendly, vibrant
    primary: '#D2F801', // Lime green - main brand color
    primaryDark: '#2E7D32', // Forest green for depth
    primaryLight: '#9AFF9A', // Light lime for subtle accents

    // Complementary colors for balance
    secondary: '#00796B', // Teal for secondary actions
    secondaryDark: '#004D40',
    secondaryLight: '#26A69A',

    // Status colors - carefully chosen for accessibility
    success: '#32CD32', // Use lime green for success states
    warning: '#FF8F00', // Warm orange for warnings
    error: '#E53E3E', // Clear red for errors
    info: '#3182CE', // Professional blue for info

    // Neutral colors - modern, clean palette
    background: '#FFFFFF',
    surface: '#FAFAFA', // Slightly warmer than pure white
    card: '#FFFFFF',
    text: '#1A202C', // Rich dark for excellent readability
    textSecondary: '#4A5568', // Medium gray for secondary text
    textLight: '#A0AEC0', // Light gray for subtle text
    border: '#E2E8F0', // Soft border color
    divider: '#EDF2F7', // Very light divider

    // Button text colors
    buttonText: '#000000', // Black text on lime green buttons
    buttonTextSecondary: '#FFFFFF', // White text on dark buttons

    // Waste type colors - intuitive and accessible
    wasteGeneral: '#718096', // Neutral gray
    wasteRecyclable: '#3182CE', // Blue for recyclables
    wasteOrganic: '#38A169', // Green for organic
    wasteHazardous: '#E53E3E', // Red for hazardous

    // Additional UI colors for better UX
    accent: '#FF6B6B', // Coral accent for highlights
    overlay: 'rgba(0, 0, 0, 0.5)', // Standard overlay
    disabled: '#CBD5E0', // Disabled state color
    focus: '#32CD32', // Lime green for focus states
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body1: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;