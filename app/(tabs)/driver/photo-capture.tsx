import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    StyleSheet,
    View,
} from 'react-native';
import { PhotoCapture, PhotoGallery } from '../../../components/driver';
import { Header, LoadingSpinner } from '../../../components/shared';
import { theme } from '../../../constants/theme';
import { useDriverContext } from '../../../contexts';

// Photo Capture Screen - handles photo capture and gallery for jobs
export default function PhotoCaptureScreen() {
    const { jobId } = useLocalSearchParams<{ jobId: string }>();
    const { state, addJobPhoto, deleteJobPhoto } = useDriverContext();

    const [showCamera, setShowCamera] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Find the current job
    const currentJob = state.jobs.find(job => job.id === jobId) ||
        state.todaysJobs.find(job => job.id === jobId);

    const handlePhotoTaken = useCallback(async (photoUri: string) => {
        if (!jobId) return;

        try {
            setIsLoading(true);
            await addJobPhoto(jobId, photoUri);
            setShowCamera(false);

            Alert.alert(
                'Photo Saved',
                'Photo has been added to the job successfully.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to save photo:', error);
            Alert.alert(
                'Error',
                'Failed to save photo. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    }, [jobId, addJobPhoto]);

    const handleDeletePhoto = useCallback(async (photoUri: string) => {
        if (!jobId) return;

        try {
            setIsLoading(true);
            await deleteJobPhoto(jobId, photoUri);

            Alert.alert(
                'Photo Deleted',
                'Photo has been removed from the job.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Failed to delete photo:', error);
            Alert.alert(
                'Error',
                'Failed to delete photo. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    }, [jobId, deleteJobPhoto]);

    const handleAddPhoto = useCallback(() => {
        setShowCamera(true);
    }, []);

    const handleCloseCamera = useCallback(() => {
        setShowCamera(false);
    }, []);

    const handleGoBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/driver/jobs');
        }
    }, []);

    if (!jobId) {
        return (
            <View style={styles.container}>
                <Header
                    title="Photo Capture"
                    leftIcon="arrow-back"
                    onLeftPress={handleGoBack}
                />
                <View style={styles.errorContainer}>
                    <LoadingSpinner message="No job selected" />
                </View>
            </View>
        );
    }

    if (!currentJob) {
        return (
            <View style={styles.container}>
                <Header
                    title="Photo Capture"
                    leftIcon="arrow-back"
                    onLeftPress={handleGoBack}
                />
                <View style={styles.errorContainer}>
                    <LoadingSpinner message="Job not found" />
                </View>
            </View>
        );
    }

    if (showCamera) {
        return (
            <PhotoCapture
                onPhotoTaken={handlePhotoTaken}
                onClose={handleCloseCamera}
                jobId={jobId}
                customerName={currentJob.customerName}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Collection Photos"
                subtitle={currentJob.customerName}
                leftIcon="arrow-back"
                onLeftPress={handleGoBack}
                rightIcon="camera"
                onRightPress={handleAddPhoto}
            />

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <LoadingSpinner message="Processing photo..." />
                </View>
            )}

            <PhotoGallery
                photos={currentJob.photos}
                jobId={jobId}
                customerName={currentJob.customerName}
                onDeletePhoto={handleDeletePhoto}
                onAddPhoto={handleAddPhoto}
                editable={currentJob.status !== 'completed'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});