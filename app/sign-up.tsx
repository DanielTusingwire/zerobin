import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { useAuth } from '../contexts/AuthContext';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { signUp } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (text && !validateEmail(text)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (text && !validatePassword(text)) {
            setPasswordError('Password must be at least 8 characters');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text && password && text !== password) {
            setPasswordError('Passwords do not match');
        } else if (password && text === password) {
            setPasswordError('');
        }
    };

    const handleSignUp = async () => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (emailError || passwordError) {
            Alert.alert('Error', 'Please fix the errors before continuing');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp(email.trim(), password, confirmPassword);

            if (result.success) {
                router.replace('/profile-setup');
            } else {
                Alert.alert('Registration Failed', result.error || 'An error occurred');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Logo */}
                        <View style={styles.logoSection}>
                            <Image
                                source={require('../assets/logo/zerobin.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Title */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Let's Get You Started!</Text>
                            <Text style={styles.subtitle}>
                                Create an account to unlock expert waste management services and join our eco-friendly community
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formSection}>
                            {/* Email Input */}
                            <FloatingLabelInput
                                label="Enter a valid email"
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={emailError}
                                hint={!emailError ? "We shall send a verification code to your email" : undefined}
                            />

                            {/* Password Input */}
                            <FloatingLabelInput
                                label="Create a strong password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={passwordError && passwordError !== 'Passwords do not match' ? passwordError : undefined}
                                hint={!passwordError ? "Strong password helps you to secure your account" : undefined}
                            />

                            {/* Confirm Password Input */}
                            <FloatingLabelInput
                                label="Confirm password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={passwordError === 'Passwords do not match' ? 'Password not matching' : undefined}
                            />

                            {/* Show Password Checkbox */}
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <View style={[styles.checkbox, showPassword && styles.checkboxChecked]}>
                                    {showPassword && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.checkboxLabel}>Show password</Text>
                            </TouchableOpacity>

                            {/* Terms */}
                            <View style={styles.termsSection}>
                                <Text style={styles.termsText}>
                                    By clicking Register you agree to our{' '}
                                    <Text style={styles.termsLink}>Terms</Text> and you have read our{' '}
                                    <Text style={styles.termsLink}>Privacy Policy</Text>
                                </Text>
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                style={[styles.registerButton, isLoading && styles.disabledButton]}
                                onPress={handleSignUp}
                                disabled={isLoading}
                            >
                                <Text style={styles.registerButtonText}>
                                    {isLoading ? 'Creating Account...' : 'Register'}
                                </Text>
                            </TouchableOpacity>

                            {/* Sign In Link */}
                            <View style={styles.signInSection}>
                                <Text style={styles.signInPrompt}>Already have an account? </Text>
                                <TouchableOpacity onPress={handleSignIn}>
                                    <Text style={styles.signInLink}>Log in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 60,
    },
    titleSection: {
        marginBottom: 40,
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 20,
    },
    formSection: {
        gap: 10,
    },

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    termsSection: {
        marginTop: 8,
    },
    termsText: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
        textAlign: 'center',
    },
    termsLink: {
        color: theme.colors.secondary,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    registerButtonText: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: 'bold',
    },
    signInSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    signInPrompt: {
        fontSize: 14,
        color: '#6B7280',
    },
    signInLink: {
        fontSize: 14,
        color: theme.colors.secondary,
        fontWeight: '600',
    },
});