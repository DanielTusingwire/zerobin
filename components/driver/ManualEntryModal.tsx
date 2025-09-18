import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button, Card } from '../ui';

export interface ManualEntryModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (code: string, type: 'qr' | 'barcode') => void;
    isSubmitting?: boolean;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
    visible,
    onClose,
    onSubmit,
    isSubmitting = false,
}) => {
    const [code, setCode] = useState('');
    const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');

    const handleSubmit = () => {
        if (code.trim()) {
            onSubmit(code.trim(), codeType);
            setCode('');
        }
    };

    const handleClose = () => {
        setCode('');
        onClose();
    };

    const isValidCode = code.trim().length > 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Enter Code Manually</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.content}>
                    <Card style={styles.instructionCard}>
                        <View style={styles.instructionHeader}>
                            <Ionicons name="information-circle-outline" size={24} color={theme.colors.info} />
                            <Text style={styles.instructionTitle}>Manual Entry</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Enter the QR code or barcode data manually if the camera scanner is not working properly.
                        </Text>
                    </Card>

                    {/* Code Type Selection */}
                    <View style={styles.typeSelection}>
                        <Text style={styles.sectionTitle}>Code Type</Text>
                        <View style={styles.typeButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    codeType === 'qr' && styles.typeButtonActive,
                                ]}
                                onPress={() => setCodeType('qr')}
                            >
                                <Ionicons
                                    name="qr-code-outline"
                                    size={24}
                                    color={codeType === 'qr' ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        codeType === 'qr' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    QR Code
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    codeType === 'barcode' && styles.typeButtonActive,
                                ]}
                                onPress={() => setCodeType('barcode')}
                            >
                                <Ionicons
                                    name="barcode-outline"
                                    size={24}
                                    color={codeType === 'barcode' ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        codeType === 'barcode' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    Barcode
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Code Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.sectionTitle}>
                            {codeType === 'qr' ? 'QR Code Data' : 'Barcode Number'}
                        </Text>
                        <TextInput
                            style={styles.codeInput}
                            placeholder={
                                codeType === 'qr'
                                    ? 'Enter QR code data...'
                                    : 'Enter barcode number...'
                            }
                            value={code}
                            onChangeText={setCode}
                            multiline={codeType === 'qr'}
                            numberOfLines={codeType === 'qr' ? 3 : 1}
                            textAlignVertical={codeType === 'qr' ? 'top' : 'center'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType={codeType === 'barcode' ? 'numeric' : 'default'}
                        />
                        {code.length > 0 && (
                            <View style={styles.codePreview}>
                                <Text style={styles.codePreviewLabel}>Preview:</Text>
                                <Text style={styles.codePreviewText} numberOfLines={2}>
                                    {code}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Sample Codes for Testing */}
                    <View style={styles.samplesSection}>
                        <Text style={styles.sectionTitle}>Sample Codes (for testing)</Text>
                        <View style={styles.sampleButtons}>
                            {codeType === 'qr' ? (
                                <>
                                    <TouchableOpacity
                                        style={styles.sampleButton}
                                        onPress={() => setCode('BIN-001-GENERAL-2024')}
                                    >
                                        <Text style={styles.sampleButtonText}>BIN-001-GENERAL-2024</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.sampleButton}
                                        onPress={() => setCode('BIN-002-RECYCLABLE-2024')}
                                    >
                                        <Text style={styles.sampleButtonText}>BIN-002-RECYCLABLE-2024</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={styles.sampleButton}
                                        onPress={() => setCode('1234567890123')}
                                    >
                                        <Text style={styles.sampleButtonText}>1234567890123</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.sampleButton}
                                        onPress={() => setCode('9876543210987')}
                                    >
                                        <Text style={styles.sampleButtonText}>9876543210987</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button
                        title="Cancel"
                        onPress={handleClose}
                        variant="outline"
                        style={styles.cancelButton}
                    />
                    <Button
                        title={isSubmitting ? 'Processing...' : 'Submit Code'}
                        onPress={handleSubmit}
                        variant="primary"
                        disabled={!isValidCode || isSubmitting}
                        loading={isSubmitting}
                        style={styles.submitButton}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h3,
        color: theme.colors.text,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    instructionCard: {
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    instructionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    instructionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
    },
    instructionText: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    typeSelection: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    typeButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        gap: theme.spacing.sm,
    },
    typeButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight + '20',
    },
    typeButtonText: {
        ...theme.typography.body1,
        color: theme.colors.textSecondary,
    },
    typeButtonTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    inputSection: {
        marginBottom: theme.spacing.lg,
    },
    codeInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.typography.body1,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        minHeight: 50,
    },
    codePreview: {
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
    },
    codePreviewLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    codePreviewText: {
        ...theme.typography.body2,
        color: theme.colors.text,
        fontFamily: 'monospace',
    },
    samplesSection: {
        marginBottom: theme.spacing.lg,
    },
    sampleButtons: {
        gap: theme.spacing.sm,
    },
    sampleButton: {
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sampleButtonText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontFamily: 'monospace',
    },
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    cancelButton: {
        flex: 1,
    },
    submitButton: {
        flex: 2,
    },
});