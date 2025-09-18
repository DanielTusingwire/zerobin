import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ManualEntryModal } from '../../../components/driver/ManualEntryModal';
import { ScannerOverlay } from '../../../components/driver/ScannerOverlay';
import { EmptyState, Header, LoadingSpinner } from '../../../components/shared';
import { Button } from '../../../components/ui';
import { theme } from '../../../constants/theme';
import { useDriverContext } from '../../../contexts';

// Driver Scanner Screen - QR/Barcode scanning functionality
export default function DriverScannerScreen() {
    const { state: driverState, addScanRecord } = useDriverContext();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset scanned state after a delay
    useEffect(() => {
        if (scanned) {
            const timer = setTimeout(() => {
                setScanned(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [scanned]);

    const handleBarCodeScanned = useCallback(async ({ type, data }: { type: string; data: string }) => {
        if (scanned || isProcessing) return;

        setScanned(true);
        setIsProcessing(true);

        try {
            // Determine if it's a QR code or barcode
            const codeType = type.includes('qr') || type.includes('QR') ? 'qr' : 'barcode';

            await processScanResult(data, codeType);
        } catch (error) {
            console.error('Error processing scan:', error);
            Alert.alert(
                'Scan Error',
                'Failed to process the scanned code. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsProcessing(false);
        }
    }, [scanned, isProcessing]);

    const processScanResult = async (code: string, type: 'qr' | 'barcode') => {
        try {
            // For now, we'll associate with the active job or first available job
            const targetJob = driverState.activeJob || driverState.jobs.find(job =>
                job.status === 'in_progress' || job.status === 'scheduled'
            );

            if (!targetJob) {
                Alert.alert(
                    'No Active Job',
                    'No active job found to associate this scan with. Please select a job first.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Add scan record
            await addScanRecord(targetJob.id, code, type);

            // Show success message
            Alert.alert(
                'Scan Successful',
                `${type.toUpperCase()} code scanned and associated with job for ${targetJob.customerName}.`,
                [
                    {
                        text: 'Scan Another',
                        onPress: () => setScanned(false),
                    },
                    {
                        text: 'Done',
                        style: 'default',
                    },
                ]
            );
        } catch (error) {
            throw error;
        }
    };

    const handleManualEntry = async (code: string, type: 'qr' | 'barcode') => {
        setIsProcessing(true);
        try {
            await processScanResult(code, type);
            setShowManualEntry(false);
        } catch (error) {
            console.error('Error processing manual entry:', error);
            Alert.alert(
                'Entry Error',
                'Failed to process the entered code. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleFlash = () => {
        setFlashEnabled(!flashEnabled);
    };

    const handleRequestPermission = async () => {
        const result = await requestPermission();
        if (!result.granted) {
            Alert.alert(
                'Camera Permission Required',
                'Camera access is needed to scan QR codes and barcodes. Please grant permission in your device settings.',
                [{ text: 'OK' }]
            );
        }
    };

    // Loading state while checking permissions
    if (permission === null) {
        return (
            <View style={styles.container}>
                <Header title="Scanner" subtitle="Checking camera permissions..." />
                <LoadingSpinner message="Loading camera..." />
            </View>
        );
    }

    // Permission denied state
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Header title="Scanner" subtitle="Camera permission required" />
                <EmptyState
                    icon="camera-outline"
                    title="Camera Permission Required"
                    message="To scan QR codes and barcodes, please grant camera permission."
                    actionTitle="Grant Permission"
                    onActionPress={handleRequestPermission}
                />
                <View style={styles.manualEntryContainer}>
                    <Button
                        title="Enter Code Manually"
                        onPress={() => setShowManualEntry(true)}
                        variant="outline"
                    />
                </View>
            </View>
        );
    }

    // No active jobs state
    if (driverState.jobs.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Scanner" subtitle="No jobs available" />
                <EmptyState
                    icon="clipboard-outline"
                    title="No Jobs Available"
                    message="You need to have active jobs to associate scanned codes with. Please check your job list."
                    actionTitle="View Jobs"
                    onActionPress={() => {
                        // TODO: Navigate to jobs screen
                        console.log('Navigate to jobs');
                    }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Scanner"
                subtitle={
                    driverState.activeJob
                        ? `Scanning for: ${driverState.activeJob.customerName}`
                        : `${driverState.jobs.length} jobs available`
                }
            />

            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    flash={flashEnabled ? 'on' : 'off'}
                    barcodeScannerSettings={{
                        barcodeTypes: [
                            'qr',
                            'pdf417',
                            'aztec',
                            'ean13',
                            'ean8',
                            'upc_e',
                            'datamatrix',
                            'code128',
                            'code39',
                            'code93',
                            'codabar',
                            'itf14',
                        ],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                    <ScannerOverlay
                        onClose={() => {
                            // TODO: Navigate back or close scanner
                            console.log('Close scanner');
                        }}
                        onManualEntry={() => setShowManualEntry(true)}
                        onFlashToggle={toggleFlash}
                        flashEnabled={flashEnabled}
                        isScanning={!scanned && !isProcessing}
                        scanMessage={
                            isProcessing
                                ? 'Processing scan...'
                                : scanned
                                    ? 'Code scanned successfully!'
                                    : 'Position QR code or barcode within the frame'
                        }
                    />
                </CameraView>
            </View>

            {/* Current Job Info */}
            {driverState.activeJob && (
                <View style={styles.jobInfo}>
                    <Text style={styles.jobInfoTitle}>Current Job</Text>
                    <Text style={styles.jobInfoText}>
                        {driverState.activeJob.customerName} - {driverState.activeJob.address}
                    </Text>
                    <Text style={styles.jobInfoScans}>
                        {driverState.activeJob.scannedCodes.length} codes scanned
                    </Text>
                </View>
            )}

            {/* Manual Entry Modal */}
            <ManualEntryModal
                visible={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                onSubmit={handleManualEntry}
                isSubmitting={isProcessing}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    manualEntryContainer: {
        padding: theme.spacing.md,
    },
    jobInfo: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    jobInfoTitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    jobInfoText: {
        ...theme.typography.body1,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    jobInfoScans: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});