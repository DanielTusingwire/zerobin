// import { theme } from '@/constants/theme'; // Not needed for this screen
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dimensions not needed for this screen

const languages = [
    { code: 'en', name: 'English' },
    { code: 'lg', name: 'Luganda' },
    { code: 'sw', name: 'Swahili' },
];

const animatedWords = [
    'Clean Environment',
    'Smart Collection',
    'Reduce Waste',
    'Recycle More',
    'Green Future',
    'Zero Waste',
    'Eco Friendly',
    'Save Planet'
];

export default function WelcomeScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    // Cursor is always visible (no blinking)

    // Typewriter effect
    useEffect(() => {
        const currentWord = animatedWords[currentWordIndex];
        let timeoutId: NodeJS.Timeout;

        if (isTyping) {
            // Typing phase
            if (displayedText.length < currentWord.length) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(currentWord.slice(0, displayedText.length + 1));
                }, 100); // Typing speed
            } else {
                // Finished typing, wait then start deleting
                timeoutId = setTimeout(() => {
                    setIsTyping(false);
                }, 1500); // Pause after typing
            }
        } else {
            // Deleting phase
            if (displayedText.length > 0) {
                timeoutId = setTimeout(() => {
                    setDisplayedText(displayedText.slice(0, -1));
                }, 50); // Deleting speed (faster than typing)
            } else {
                // Finished deleting, move to next word
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % animatedWords.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeoutId);
    }, [displayedText, isTyping, currentWordIndex]);

    const handleSignIn = () => {
        router.push('/sign-in');
    };

    const handleSignUp = () => {
        router.push('/sign-up');
    };

    const toggleLanguage = () => {
        const currentIndex = languages.findIndex(lang => lang.code === selectedLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        setSelectedLanguage(languages[nextIndex].code);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.topSafeArea}>
                {/* Top Section - Language Selector */}
                <View style={styles.topSection}>
                    {/* <View style={styles.notch} /> */}
                    <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                        <Text style={styles.languageText}>
                            {languages.find(lang => lang.code === selectedLanguage)?.name}
                        </Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Center Section - Animated Text */}
                <View style={styles.centerSection}>
                    <View style={styles.typewriterContainer}>
                        <View style={styles.textWithCursor}>
                            <Text style={styles.animatedText}>
                                {displayedText}
                            </Text>
                            <View style={styles.cursor} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {/* Bottom Section - Welcome & Auth */}
            <View style={styles.bottomSection}>
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeTitle}>You're Welcome!</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Are you joining as a person who is looking{'\n'}
                            for professionals or a service provider
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
                                <Text style={styles.loginButtonText}>Log in</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                                <Text style={styles.registerButtonText}>New here? Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Bright lime green background
    },
    topSafeArea: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Same as main background
    },
    bottomSafeArea: {
        backgroundColor: theme.colors.secondary, // Green bottom section color
    },
    topSection: {
        paddingTop: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        zIndex: 1,
    },
    notch: {
        width: 120,
        height: 6,
        backgroundColor: theme.colors.text,
        borderRadius: 3,
        marginBottom: 20,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: theme.colors.text,
        gap: 8,
    },
    languageText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    typewriterContainer: {
        minHeight: 50, // Ensure consistent height during typing/deleting
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWithCursor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
    },
    cursor: {
        width: 25,
        height: 25,
        borderRadius: 50,
        backgroundColor: theme.colors.text,
        marginLeft: 4,
        marginBottom: -4, // Align with text baseline
    },
    bottomSection: {
        backgroundColor: theme.colors.secondary, // Green bottom section
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden', // Ensure border radius is visible
    },
    welcomeContent: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.buttonTextSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: theme.colors.buttonTextSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        opacity: 0.9,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    loginButton: {
        backgroundColor: theme.colors.primary, // Lime green button
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.buttonText,
    },
    registerButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
    },
});