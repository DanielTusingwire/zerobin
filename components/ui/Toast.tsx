import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    visible: boolean;
    onHide: () => void;
    style?: ViewStyle;
    position?: 'top' | 'bottom';
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    visible,
    onHide,
    style,
    position = 'bottom',
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

    useEffect(() => {
        if (visible) {
            // Show animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: position === 'top' ? -100 : 100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'close-circle';
            case 'warning':
                return 'warning';
            case 'info':
            default:
                return 'information-circle';
        }
    };

    const toastStyle = [
        styles.container,
        styles[type],
        styles[position],
        style,
    ];

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                toastStyle,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.content}>
                <Ionicons
                    name={getIcon()}
                    size={20}
                    color={theme.colors.background}
                    style={styles.icon}
                />
                <Text style={styles.message} numberOfLines={2}>
                    {message}
                </Text>
                <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                    <Ionicons
                        name="close"
                        size={18}
                        color={theme.colors.background}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: theme.spacing.md,
        right: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.lg,
        zIndex: 1000,
    },
    top: {
        top: 60, // Account for status bar and some padding
    },
    bottom: {
        bottom: 100, // Account for tab bar and some padding
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    message: {
        flex: 1,
        ...theme.typography.body2,
        color: theme.colors.background,
        fontWeight: '500',
    },
    closeButton: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.sm,
    },

    // Type variants
    success: {
        backgroundColor: theme.colors.success,
    },
    error: {
        backgroundColor: theme.colors.error,
    },
    warning: {
        backgroundColor: theme.colors.warning,
    },
    info: {
        backgroundColor: theme.colors.info,
    },
});