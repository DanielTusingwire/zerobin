// Navigation service for role-based routing and navigation utilities
import { router } from 'expo-router';
import { UserRole } from '../../types/navigation';

class NavigationService {
    private currentRole: UserRole | null = null;

    // Set the current user role
    setUserRole(role: UserRole) {
        this.currentRole = role;
        // TODO: Save to AsyncStorage for persistence
    }

    // Get the current user role
    getUserRole(): UserRole | null {
        return this.currentRole;
    }

    // Navigate to role-specific home screen
    navigateToRoleHome(role: UserRole) {
        this.setUserRole(role);

        switch (role) {
            case 'driver':
                router.replace('/(tabs)/driver/jobs');
                break;
            case 'customer':
                router.replace('/(tabs)/customer/home');
                break;
            default:
                router.replace('/role-selection');
        }
    }

    // Navigate to role selection
    navigateToRoleSelection() {
        this.currentRole = null;
        router.replace('/role-selection');
    }

    // Switch between roles
    switchRole(newRole: UserRole) {
        if (this.currentRole !== newRole) {
            this.navigateToRoleHome(newRole);
        }
    }

    // Check if user can access a specific route
    canAccessRoute(route: string, requiredRole?: UserRole): boolean {
        if (!requiredRole) return true;
        return this.currentRole === requiredRole;
    }

    // Get role-specific routes
    getDriverRoutes() {
        return [
            { name: 'jobs', title: 'Jobs', icon: 'clipboard-outline' },
            { name: 'routes', title: 'Routes', icon: 'map-outline' },
            { name: 'scanner', title: 'Scanner', icon: 'qr-code-outline' },
            { name: 'profile', title: 'Profile', icon: 'person-outline' },
        ];
    }

    getCustomerRoutes() {
        return [
            { name: 'request', title: 'Request', icon: 'add-circle-outline' },
            { name: 'schedule', title: 'Schedule', icon: 'calendar-outline' },
            { name: 'feedback', title: 'Feedback', icon: 'star-outline' },
            { name: 'tips', title: 'Tips', icon: 'bulb-outline' },
        ];
    }

    // Navigation helpers for common actions
    goBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            // If can't go back, go to role home
            if (this.currentRole) {
                this.navigateToRoleHome(this.currentRole);
            } else {
                this.navigateToRoleSelection();
            }
        }
    }

    // Deep linking support
    handleDeepLink(url: string) {
        // TODO: Implement deep link parsing and navigation
        console.log('Handling deep link:', url);
    }

    // Reset navigation stack
    reset() {
        this.currentRole = null;
        router.replace('/role-selection');
    }
}

// Export singleton instance
export const navigationService = new NavigationService();

// Navigation hooks and utilities
export const useNavigation = () => {
    return {
        currentRole: navigationService.getUserRole(),
        setRole: navigationService.setUserRole.bind(navigationService),
        switchRole: navigationService.switchRole.bind(navigationService),
        goToRoleSelection: navigationService.navigateToRoleSelection.bind(navigationService),
        canAccess: navigationService.canAccessRoute.bind(navigationService),
    };
};