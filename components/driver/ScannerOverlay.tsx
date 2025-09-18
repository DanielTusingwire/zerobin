import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface ScannerOverlayProps {
    onClose?: () => void;
    onManualEntry?: () => void;
    onFlashToggle?: () => void;
    flashEnabled?: boolean;
    isScanning?: boolean;
    scanMessage?: string;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
    onClose,
    onManualEntry,
    onFlashToggle,
    flashEnabled = false,
    isScanning = true,
    scanMessage = 'Position QR code or barcode within the frame',
}) => {
    const scanAreaSize = Math.min(screenWidth * 0.7, 250);
    const scanAreaTop = (screenHeight - scanAreaSize) / 2 - 50;

    return (
        <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.background} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan Code</Text>
                <TouchableOpacity style={styles.headerButton} onPress={onFlashToggle}>
                    <Ionicons
                        name={flashEnabled ? "flash" : "flash-off"}
                        size={24}
                        color={theme.colors.background}
                    />
                </TouchableOpacity>
            </View>

            {/* Scanning Area */}
            <View style={styles.scanningArea}>
                {/* Top overlay */}
                <View style={[styles.overlaySection, { height: scanAreaTop }]} />

                {/* Middle section with scan frame */}
                <View style={styles.middleSection}>
                    {/* Left overlay */}
                    <View style={[styles.overlaySection, { width: (screenWidth - scanAreaSize) / 2 }]} />

                    {/* Scan frame */}
                    <View style={[styles.scanFrame, { width: scanAreaSize, height: scanAreaSize }]}>
                        {/* Corner indicators */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />

                        {/* Scanning line animation */}
                        {isScanning && (
                            <View style={styles.scanLine} />
                        )}
                    </View>

                    {/* Right overlay */}
                    <View style={[styles.overlaySection, { width: (screenWidth - scanAreaSize) / 2 }]} />
                </View>

                {/* Bottom overlay */}
                <View style={[styles.overlaySection, { flex: 1 }]} />
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>{scanMessage}</Text>
                <View style={styles.instructionIcons}>
                    <View style={styles.instructionItem}>
                        <Ionicons name="qr-code-outline" size={32} color={theme.colors.background} />
                        <Text style={styles.instructionLabel}>QR Code</Text>
                    </View>
                    <View style={styles.instructionItem}>
                        <Ionicons name="barcode-outline" size={32} color={theme.colors.background} />
                        <Text style={styles.instructionLabel}>Barcode</Text>
                    </View>
                </View>
            </View>

            {/* Manual Entry Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.manualEntryButton} onPress={onManualEntry}>
                    <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.manualEntryText}>Enter Code Manually</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.background,
        fontWeight: '600',
    },
    scanningArea: {
        flex: 1,
    },
    overlaySection: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    middleSection: {
        flexDirection: 'row',
        height: Math.min(screenWidth * 0.7, 250),
    },
    scanFrame: {
        position: 'relative',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: theme.colors.primary,
        borderWidth: 3,
    },
    topLeft: {
        top: -2,
        left: -2,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: -2,
        right: -2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: -2,
        left: -2,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: -2,
        right: -2,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    scanLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
    },
    instructions: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
    },
    instructionText: {
        ...theme.typography.body1,
        color: theme.colors.background,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    instructionIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.xl,
    },
    instructionItem: {
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    instructionLabel: {
        ...theme.typography.caption,
        color: theme.colors.background,
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 50,
        alignItems: 'center',
    },
    manualEntryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.sm,
    },
    manualEntryText: {
        ...theme.typography.body1,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});