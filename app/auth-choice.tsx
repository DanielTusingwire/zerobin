import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AuthChoiceScreen() {
    const handleSignUp = () => {
        router.push('/sign-up');
    };

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="leaf" size={50} color="#22C55E" />
                    </View>
                    <Text style={styles.appName}>ZeroBin</Text>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Let's get you started</Text>
                    <Text style={styles.subtitle}>
                        Join thousands of users making waste management smarter and more efficient
                    </Text>
                </View>

                {/* Auth Options */}
                <View style={styles.authSection}>
                    <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                        <Text style={styles.signUpText}>Create New Account</Text>
                        <Ionicons name="person-add" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                        <Text style={styles.signInText}>Sign In to Existing Account</Text>
                        <Ionicons name="log-in" size={20} color="#22C55E" />
                    </TouchableOpacity>
                </View>

                {/* Benefits */}
                <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>Why choose ZeroBin?</Text>

                    <View style={styles.benefit}>
                        <View style={styles.benefitIcon}>
                            <Ionicons name="time" size={20} color="#22C55E" />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Save Time</Text>
                            <Text style={styles.benefitDescription}>
                                Streamlined pickup scheduling and route optimization
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefit}>
                        <View style={styles.benefitIcon}>
                            <Ionicons name="leaf" size={20} color="#22C55E" />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Go Green</Text>
                            <Text style={styles.benefitDescription}>
                                Track your environmental impact and recycling progress
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefit}>
                        <View style={styles.benefitIcon}>
                            <Ionicons name="phone-portrait" size={20} color="#22C55E" />
                        </View>
                        <View style={styles.benefitContent}>
                            <Text style={styles.benefitTitle}>Easy to Use</Text>
                            <Text style={styles.benefitDescription}>
                                Intuitive interface designed for efficiency
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Terms */}
                <View style={styles.termsSection}>
                    <Text style={styles.termsText}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    titleSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    authSection: {
        marginBottom: 40,
        gap: 16,
    },
    signUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#22C55E',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    signUpText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#22C55E',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    signInText: {
        color: '#22C55E',
        fontSize: 16,
        fontWeight: '600',
    },
    benefitsSection: {
        marginBottom: 30,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    benefit: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    benefitIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    termsSection: {
        paddingBottom: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#22C55E',
        fontWeight: '500',
    },
});