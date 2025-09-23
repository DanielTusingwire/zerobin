import { theme } from '@/constants/theme';
import { router } from 'expo-router';
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

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const { signIn } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (text && !validateEmail(text)) {
            setEmailError('Invalid Email address');
        } else {
            setEmailError('');
        }
    };

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (emailError) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email.trim(), password);

            if (result.success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert('Login Failed', result.error || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Reset Password',
            'Password reset functionality will be implemented in a future update.',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
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
                            <Text style={styles.title}>Log in</Text>
                            <Text style={styles.subtitle}>
                                Welcome back! You have been missed
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formSection}>
                            {/* Email Input */}
                            <FloatingLabelInput
                                label="Enter your email"
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={emailError}
                            />

                            {/* Password Input */}
                            <FloatingLabelInput
                                label="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            {/* Show Password & Forgot Password */}
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <View style={[styles.checkbox, showPassword && styles.checkboxChecked]}>
                                        {showPassword && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <Text style={styles.checkboxLabel}>Show password</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.loginButton, isLoading && styles.disabledButton]}
                                onPress={handleSignIn}
                                disabled={isLoading}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? 'Logging in...' : 'Log in'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signUpSection}>
                            <Text style={styles.signUpPrompt}>Don't have an account </Text>
                            <TouchableOpacity onPress={handleSignUp}>
                                <Text style={styles.signUpLink}>Open one</Text>
                            </TouchableOpacity>
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
        flex: 1,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 60,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    formSection: {
        gap: 10,
        flex: 1,
    },

    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: theme.colors.secondary,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    loginButtonText: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: 'bold',
    },
    signUpSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 40,
    },
    signUpPrompt: {
        fontSize: 14,
        color: '#6B7280',
    },
    signUpLink: {
        fontSize: 14,
        color: theme.colors.secondary,
        fontWeight: '600',
    },
});