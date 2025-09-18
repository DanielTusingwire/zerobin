import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface HeaderProps {
    title: string;
    subtitle?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    backgroundColor?: string;
    style?: ViewStyle;
    showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    backgroundColor = theme.colors.primary,
    style,
    showBackButton = false,
}) => {
    const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

    const headerStyle = [
        styles.container,
        { backgroundColor, paddingTop: statusBarHeight + theme.spacing.md },
        style,
    ];

    const textColor = backgroundColor === theme.colors.primary
        ? theme.colors.background
        : theme.colors.text;

    return (
        <View style={headerStyle}>
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={backgroundColor === theme.colors.primary ? 'light-content' : 'dark-content'}
            />

            <View style={styles.content}>
                <View style={styles.left}>
                    {(leftIcon || showBackButton) && (
                        <TouchableOpacity
                            onPress={onLeftPress}
                            style={styles.iconButton}
                        >
                            <Ionicons
                                name={leftIcon || 'arrow-back'}
                                size={24}
                                color={textColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.center}>
                    <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                </View>

                <View style={styles.right}>
                    {rightIcon && (
                        <TouchableOpacity
                            onPress={onRightPress}
                            style={styles.iconButton}
                        >
                            <Ionicons
                                name={rightIcon}
                                size={24}
                                color={textColor}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        minHeight: 56,
    },
    left: {
        width: 40,
        alignItems: 'flex-start',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    },
    iconButton: {
        padding: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h4,
        fontWeight: '600',
    },
    subtitle: {
        ...theme.typography.caption,
        opacity: 0.8,
        marginTop: 2,
    },
});