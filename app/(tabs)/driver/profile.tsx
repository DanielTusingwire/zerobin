import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../../components/shared';
import { Button, Card, Separator } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { navigationService } from '../../../services/navigation/navigationService';

// Driver Profile Screen - profile information and settings
// TODO: Add driver profile display with statistics
// TODO: Implement settings for notifications and preferences
// TODO: Connect to user profile data
export default function DriverProfileScreen() {
    const handleSwitchToCustomer = () => {
        navigationService.switchRole('customer');
    };

    const handleLogout = () => {
        navigationService.navigateToRoleSelection();
    };

    return (
        <View style={styles.container}>
            <Header
                title="Driver Profile"
                subtitle="John Doe - Driver #1234"
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Card style={styles.profileCard}>
                    <Button
                        title="Switch to Customer View"
                        onPress={handleSwitchToCustomer}
                        variant="outline"
                        fullWidth
                    />

                    <Separator style={styles.separator} />

                    <Button
                        title="Settings"
                        onPress={() => console.log('Settings pressed')}
                        variant="ghost"
                        fullWidth
                    />

                    <Button
                        title="Help & Support"
                        onPress={() => console.log('Help pressed')}
                        variant="ghost"
                        fullWidth
                    />

                    <Separator style={styles.separator} />

                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="outline"
                        fullWidth
                    />
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    profileCard: {
        marginBottom: theme.spacing.lg,
    },
    separator: {
        marginVertical: theme.spacing.md,
    },
});