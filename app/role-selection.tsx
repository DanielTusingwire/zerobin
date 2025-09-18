import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { Card } from '../components/ui';
import { theme } from '../constants/theme';
import { useNavigationContext } from '../contexts/NavigationContext';

const backgroundImage = require('../assets/images/role-bg.jpg');
const logoImage = require('../assets/logo/zerobin.png');
const driverIcon = require('../assets/images/collector.png');
const customerIcon = require('../assets/images/customer.png');

export default function RoleSelectionScreen() {
    const { switchRole } = useNavigationContext();

    const handleDriverSelection = async () => {
        try {
            await switchRole('driver');
        } catch (error) {
            console.error('Failed to switch to driver role:', error);
        }
    };

    const handleCustomerSelection = async () => {
        try {
            await switchRole('customer');
        } catch (error) {
            console.error('Failed to switch to customer role:', error);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.bg} resizeMode="cover">
            <View style={styles.overlay} />
            <View style={styles.contentContainer}>
                <View style={styles.topContent}>
                    <Text style={styles.welcome}>You’re Welcome!</Text>
                    <Text style={styles.subtitle}>
                        Are you joining as someone who needs waste collection, or as a service provider?
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <View style={styles.cardsBg}>
                        <View style={styles.rolesRow}>
    <Card style={styles.roleCard} onPress={handleDriverSelection}>
        <View style={styles.roleIconCircle}>
            <Image source={driverIcon} style={styles.roleImageIcon} resizeMode="contain" />
        </View>
        <Text style={styles.roleTitle}>Driver</Text>
        <Text style={styles.roleDesc}>
            I want to offer waste collection services
        </Text>
    </Card>
    <Card style={styles.roleCard} onPress={handleCustomerSelection}>
        <View style={styles.roleIconCircle}>
            <Image source={customerIcon} style={styles.roleImageIcon} resizeMode="contain" />
        </View>
        <Text style={styles.roleTitle}>Customer</Text>
        <Text style={styles.roleDesc}>
            I’m looking for waste collection or recycling services
        </Text>
    </Card>
</View>
                
                    </View>
                    <View style={styles.logoContainer}>
                        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                        
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    bg: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    topContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 35,
        paddingTop: 0,
        marginTop: 250,
        display: 'none',
    },
    welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.95,
    },
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    cardsBg: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingVertical: 32,
        paddingHorizontal: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
        marginBottom: -150,
    },
    rolesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 0,
    },
    roleCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 28,
        paddingHorizontal: 18,
        marginHorizontal: 8,
        elevation: 3,
        minWidth: 145,
        maxWidth: 180,
        marginBottom: 180,
        marginTop: -100,
    },
    roleIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    roleIcon: {
        fontSize: 28,
    },
    roleImageIcon: {
        width: 60,
        height: 60,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 6,
    },
    roleDesc: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 32,
    },
    logo: {
        width: 110,
        height: 32,
        marginBottom: 6,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});