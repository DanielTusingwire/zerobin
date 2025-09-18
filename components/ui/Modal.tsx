import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal as RNModal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
    showCloseButton?: boolean;
    closeOnBackdropPress?: boolean;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    animationType = 'slide',
    presentationStyle = 'pageSheet',
    showCloseButton = true,
    closeOnBackdropPress = true,
    containerStyle,
    contentStyle,
}) => {
    const handleBackdropPress = () => {
        if (closeOnBackdropPress) {
            onClose();
        }
    };

    return (
        <RNModal
            visible={visible}
            animationType={animationType}
            presentationStyle={presentationStyle}
            transparent={presentationStyle === 'overFullScreen'}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View style={[styles.backdrop, containerStyle]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.content, contentStyle]}>
                            {(title || showCloseButton) && (
                                <View style={styles.header}>
                                    {title && (
                                        <Text style={styles.title}>{title}</Text>
                                    )}
                                    {showCloseButton && (
                                        <TouchableOpacity
                                            onPress={onClose}
                                            style={styles.closeButton}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={24}
                                                color={theme.colors.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            <View style={styles.body}>
                                {children}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    content: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        maxHeight: '90%',
        width: '100%',
        ...theme.shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
        flex: 1,
    },
    closeButton: {
        padding: theme.spacing.xs,
        marginLeft: theme.spacing.md,
    },
    body: {
        padding: theme.spacing.lg,
    },
});