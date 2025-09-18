// Color constants - extracted from theme for easy access
import { theme } from './theme';

export const Colors = theme.colors;

// Utility function to get waste type color
export const getWasteTypeColor = (wasteType: string): string => {
    switch (wasteType.toLowerCase()) {
        case 'general':
            return Colors.wasteGeneral;
        case 'recyclable':
            return Colors.wasteRecyclable;
        case 'organic':
            return Colors.wasteOrganic;
        case 'hazardous':
            return Colors.wasteHazardous;
        default:
            return Colors.wasteGeneral;
    }
};

// Utility function to get status color
export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'completed':
            return Colors.success;
        case 'in_progress':
            return Colors.info;
        case 'scheduled':
            return Colors.warning;
        case 'cancelled':
            return Colors.error;
        default:
            return Colors.textSecondary;
    }
};