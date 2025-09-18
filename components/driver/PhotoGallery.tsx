import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Button, Card } from '../ui';

const { width: screenWidth } = Dimensions.get('window');
const PHOTO_SIZE = (screenWidth - theme.spacing.md * 3) / 2; // 2 photos per row with spacing

export interface PhotoGalleryProps {
    photos: string[];
    jobId: string;
    customerName?: string;
    onDeletePhoto?: (photoUri: string) => void;
    onAddPhoto?: () => void;
    editable?: boolean;
}

interface PhotoItem {
    uri: string;
    timestamp?: Date;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    photos,
    jobId,
    customerName,
    onDeletePhoto,
    onAddPhoto,
    editable = true,
}) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [isViewerVisible, setIsViewerVisible] = useState(false);

    const photoItems: PhotoItem[] = photos.map(uri => ({
        uri,
        timestamp: new Date(), // In real app, this would come from photo metadata
    }));

    const handlePhotoPress = (photoUri: string) => {
        setSelectedPhoto(photoUri);
        setIsViewerVisible(true);
    };

    const handleDeletePhoto = (photoUri: string) => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDeletePhoto?.(photoUri);
                        if (selectedPhoto === photoUri) {
                            setIsViewerVisible(false);
                            setSelectedPhoto(null);
                        }
                    },
                },
            ]
        );
    };

    const renderPhotoItem = ({ item, index }: { item: PhotoItem; index: number }) => (
        <TouchableOpacity
            style={styles.photoContainer}
            onPress={() => handlePhotoPress(item.uri)}
        >
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <View style={styles.photoOverlay}>
                <Text style={styles.photoIndex}>{index + 1}</Text>
                {editable && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePhoto(item.uri)}
                    >
                        <Ionicons name="trash" size={16} color={theme.colors.background} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderAddPhotoButton = () => (
        <TouchableOpacity style={styles.addPhotoButton} onPress={onAddPhoto}>
            <Ionicons name="camera-outline" size={32} color={theme.colors.primary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="camera-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Photos Yet</Text>
            <Text style={styles.emptySubtitle}>
                Take photos to document the collection for this job
            </Text>
            {editable && (
                <Button
                    title="Take First Photo"
                    onPress={onAddPhoto}
                    style={styles.emptyButton}
                />
            )}
        </View>
    );

    const renderPhotoViewer = () => (
        <Modal
            visible={isViewerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsViewerVisible(false)}
        >
            <View style={styles.viewerContainer}>
                <View style={styles.viewerHeader}>
                    <TouchableOpacity
                        style={styles.viewerCloseButton}
                        onPress={() => setIsViewerVisible(false)}
                    >
                        <Ionicons name="close" size={24} color={theme.colors.background} />
                    </TouchableOpacity>
                    <Text style={styles.viewerTitle}>
                        Photo {photos.indexOf(selectedPhoto!) + 1} of {photos.length}
                    </Text>
                    {editable && selectedPhoto && (
                        <TouchableOpacity
                            style={styles.viewerDeleteButton}
                            onPress={() => handleDeletePhoto(selectedPhoto)}
                        >
                            <Ionicons name="trash" size={24} color={theme.colors.background} />
                        </TouchableOpacity>
                    )}
                </View>

                {selectedPhoto && (
                    <View style={styles.viewerImageContainer}>
                        <Image
                            source={{ uri: selectedPhoto }}
                            style={styles.viewerImage}
                            resizeMode="contain"
                        />
                    </View>
                )}

                <View style={styles.viewerFooter}>
                    <Text style={styles.viewerJobInfo}>
                        Job: {customerName || jobId}
                    </Text>
                    <Text style={styles.viewerTimestamp}>
                        Captured: {new Date().toLocaleString()}
                    </Text>
                </View>
            </View>
        </Modal>
    );

    if (photos.length === 0) {
        return (
            <Card style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="images" size={24} color={theme.colors.primary} />
                    <Text style={styles.title}>Collection Photos</Text>
                </View>
                {renderEmptyState()}
                {renderPhotoViewer()}
            </Card>
        );
    }

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="images" size={24} color={theme.colors.primary} />
                <Text style={styles.title}>Collection Photos ({photos.length})</Text>
            </View>

            <FlatList
                data={photoItems}
                renderItem={renderPhotoItem}
                keyExtractor={(item, index) => `${item.uri}-${index}`}
                numColumns={2}
                columnWrapperStyle={styles.row}
                ListFooterComponent={editable ? renderAddPhotoButton : null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.photoList}
            />

            {renderPhotoViewer()}
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: theme.spacing.md,
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    title: {
        ...theme.typography.h4,
        color: theme.colors.text,
        flex: 1,
    },
    photoList: {
        paddingBottom: theme.spacing.sm,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    photoContainer: {
        position: 'relative',
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        backgroundColor: theme.colors.border,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'space-between',
        padding: theme.spacing.sm,
    },
    photoIndex: {
        ...theme.typography.caption,
        color: theme.colors.background,
        fontWeight: '600',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
        alignSelf: 'flex-start',
    },
    deleteButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    addPhotoButton: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primaryLight + '10',
        marginTop: theme.spacing.sm,
    },
    addPhotoText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        marginTop: theme.spacing.xs,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    emptyTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    emptyButton: {
        paddingHorizontal: theme.spacing.lg,
    },
    // Photo Viewer Styles
    viewerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    viewerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    viewerCloseButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerTitle: {
        ...theme.typography.h4,
        color: theme.colors.background,
        flex: 1,
        textAlign: 'center',
    },
    viewerDeleteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
    },
    viewerImage: {
        width: '100%',
        height: '100%',
    },
    viewerFooter: {
        padding: theme.spacing.md,
        alignItems: 'center',
    },
    viewerJobInfo: {
        ...theme.typography.body1,
        color: theme.colors.background,
        marginBottom: theme.spacing.xs,
    },
    viewerTimestamp: {
        ...theme.typography.caption,
        color: theme.colors.background,
        opacity: 0.8,
    },
});