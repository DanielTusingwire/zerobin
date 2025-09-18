import React, { ReactNode } from 'react';
import { AppProvider } from './AppContext';
import { CustomerProvider } from './CustomerContext';
import { DriverProvider } from './DriverContext';
import { NavigationProvider } from './NavigationContext';

// Root provider that combines all context providers
// This ensures proper provider hierarchy and dependency management
export function RootProvider({ children }: { children: ReactNode }) {
    return (
        <AppProvider>
            <NavigationProvider>
                <DriverProvider>
                    <CustomerProvider>
                        {children}
                    </CustomerProvider>
                </DriverProvider>
            </NavigationProvider>
        </AppProvider>
    );
}

// Export individual providers for selective use if needed
export {
    AppProvider, CustomerProvider, DriverProvider, NavigationProvider
};
