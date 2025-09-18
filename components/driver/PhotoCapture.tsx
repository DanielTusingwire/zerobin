import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface PhotoCaptureProps {
    onPhotoTaken: (uri: string) => void;
    onClose: () => void;
    jobId?: string;
    customerName?: string;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
    onPhotoTaken,
    onClose,
    jobId,
    customerName,
}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const handleTakePhoto = async () => {
        if (!cameraRef.current || isCapturing) return;

        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                exif: false,
            });

            if (photo?.uri) {
                onPhotoTaken(photo.uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert(
                'Photo Error',
                'Failed to capture photo. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsCapturing(false);
        }
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlashEnabled(!flashEnabled);
    };

    const handleRequestPermission = async () => {
        const result = await requestPermission();
        if (!result.granted) {
            Alert.alert(
                'Camera Permission Required',
                'Camera access is needed to take photos for proof of collection. Please grant permission in your device settings.',
                [
                    { text: 'Cancel', onPress: onClose },
                    { text: 'OK' }
                ]
            );
        }
    };

    // Permission loading state
    if (permission === null) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.background} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Photo Capture</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerContent}>
                    <Text style={styles.loadingText}>Loading camera...</Text>
                </View>
            </View>
        );
    }

    // Permission denied state
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.background} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Photo Capture</Text>
                    <View style={styles.headerButton} />
                </View>
                <View style={styles.centerContent}>
                    <Ionicons name="camera-outline" size={64} color={theme.colors.background} />
                    <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                    <Text style={styles.permissionText}>
                        Camera access is needed to take photos for proof of collection.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.background} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Photo Capture</Text>
                <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
                    <Ionicons
                        name={flashEnabled ? "flash" : "flash-off"}
                        size={24}
                        color={theme.colors.background}
                    />
                </TouchableOpacity>
            </View>

            {/* Camera */}
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
                flash={flashEnabled ? 'on' : 'off'}
            >
                {/* Job Info Overlay */}
                {customerName && (
                    <View style={styles.jobInfoOverlay}>
                        <Text style={styles.jobInfoText}>
                            Taking photo for: {customerName}
                        </Text>
                    </View>
                )}

                {/* Camera Controls */}
                <View style={styles.cameraControls}>
                    {/* Flip Camera Button */}
                    <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse-outline" size={24} color={theme.colors.background} />
                    </TouchableOpacity>

                    {/* Capture Button */}
                    <TouchableOpacity
                        style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
                        onPress={handleTakePhoto}
                        disabled={isCapturing}
                    >
                        <View style={styles.captureButtonInner}>
                            {isCapturing ? (
                                <View style={styles.capturingIndicator} />
                            ) : (
                                <Ionicons name="camera" size={32} color={theme.colors.text} />
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Gallery Button (placeholder) */}
                    <TouchableOpacity style={styles.controlButton}>
                        <Ionicons name="images-outline" size={24} color={theme.colors.background} />
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <View style={styles.instructions}>
                    <Text style={styles.instructionText}>
                        Position the waste container or collection area in the frame
                    </Text>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
    camera: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: theme.spacing.xl,
    },
    loadingText: {
        ...theme.typography.body1,
        color: theme.colors.background,
        textAlign: 'center',
    },
    permissionTitle: {
        ...theme.typography.h3,
        color: theme.colors.background,
        textAlign: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    permissionText: {
        ...theme.typography.body1,
        color: theme.colors.background,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    permissionButtonText: {
        ...theme.typography.button,
        color: theme.colors.background,
    },
    jobInfoOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    jobInfoText: {
        ...theme.typography.body1,
        color: theme.colors.background,
        textAlign: 'center',
    },
    cameraControls: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    captureButtonDisabled: {
        opacity: 0.6,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    capturingIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.error,
    },
    instructions: {
        position: 'absolute',
        bottom: 150,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    instructionText: {
        ...theme.typography.body2,
        color: theme.colors.background,
        textAlign: 'center',
    },
});