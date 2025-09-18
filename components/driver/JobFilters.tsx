import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { JobStatus, WasteType } from '../../types/common';
import { Button, Card, Input } from '../ui';

export interface JobFiltersProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: JobFilterOptions) => void;
    currentFilters: JobFilterOptions;
}

export interface JobFilterOptions {
    status: JobStatus | 'all';
    wasteTypes: WasteType[];
    priority: 'high' | 'medium' | 'low' | 'all';
    dateRange: 'today' | 'tomorrow' | 'week' | 'all';
    sortBy: 'time' | 'priority' | 'distance' | 'customer';
    sortOrder: 'asc' | 'desc';
    searchQuery: string;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
    visible,
    onClose,
    onApply,
    currentFilters,
}) => {
    const [filters, setFilters] = useState<JobFilterOptions>(currentFilters);

    const statusOptions = [
        { value: 'all', label: 'All Status', color: theme.colors.textSecondary },
        { value: JobStatus.SCHEDULED, label: 'Scheduled', color: theme.colors.info },
        { value: JobStatus.IN_PROGRESS, label: 'In Progress', color: theme.colors.warning },
        { value: JobStatus.COMPLETED, label: 'Completed', color: theme.colors.success },
        { value: JobStatus.CANCELLED, label: 'Cancelled', color: theme.colors.error },
    ];

    const wasteTypeOptions = [
        { value: WasteType.GENERAL, label: 'General', color: theme.colors.wasteGeneral },
        { value: WasteType.RECYCLABLE, label: 'Recyclable', color: theme.colors.wasteRecyclable },
        { value: WasteType.ORGANIC, label: 'Organic', color: theme.colors.wasteOrganic },
        { value: WasteType.HAZARDOUS, label: 'Hazardous', color: theme.colors.wasteHazardous },
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priority', color: theme.colors.textSecondary },
        { value: 'high', label: 'High Priority', color: theme.colors.error },
        { value: 'medium', label: 'Medium Priority', color: theme.colors.warning },
        { value: 'low', label: 'Low Priority', color: theme.colors.success },
    ];

    const dateRangeOptions = [
        { value: 'all', label: 'All Dates' },
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'week', label: 'This Week' },
    ];

    const sortOptions = [
        { value: 'time', label: 'Scheduled Time' },
        { value: 'priority', label: 'Priority' },
        { value: 'distance', label: 'Distance' },
        { value: 'customer', label: 'Customer Name' },
    ];

    const handleStatusChange = (status: JobStatus | 'all') => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleWasteTypeToggle = (wasteType: WasteType) => {
        setFilters(prev => ({
            ...prev,
            wasteTypes: prev.wasteTypes.includes(wasteType)
                ? prev.wasteTypes.filter(type => type !== wasteType)
                : [...prev.wasteTypes, wasteType],
        }));
    };

    const handlePriorityChange = (priority: 'high' | 'medium' | 'low' | 'all') => {
        setFilters(prev => ({ ...prev, priority }));
    };

    const handleDateRangeChange = (dateRange: 'today' | 'tomorrow' | 'week' | 'all') => {
        setFilters(prev => ({ ...prev, dateRange }));
    };

    const handleSortChange = (sortBy: JobFilterOptions['sortBy']) => {
        setFilters(prev => ({
            ...prev,
            sortBy,
            sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleSearchChange = (searchQuery: string) => {
        setFilters(prev => ({ ...prev, searchQuery }));
    };

    const handleReset = () => {
        const resetFilters: JobFilterOptions = {
            status: 'all',
            wasteTypes: [],
            priority: 'all',
            dateRange: 'all',
            sortBy: 'time',
            sortOrder: 'asc',
            searchQuery: '',
        };
        setFilters(resetFilters);
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const getActiveFiltersCount = (): number => {
        let count = 0;
        if (filters.status !== 'all') count++;
        if (filters.wasteTypes.length > 0) count++;
        if (filters.priority !== 'all') count++;
        if (filters.dateRange !== 'all') count++;
        if (filters.searchQuery.trim()) count++;
        return count;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Filter & Sort Jobs</Text>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Search */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Search</Text>
                        <Input
                            placeholder="Search by customer name, address, or job ID"
                            value={filters.searchQuery}
                            onChangeText={handleSearchChange}
                            leftIcon="search"
                        />
                    </Card>

                    {/* Status Filter */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Status</Text>
                        <View style={styles.optionsGrid}>
                            {statusOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.status === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleStatusChange(option.value as JobStatus | 'all')}
                                >
                                    <View
                                        style={[styles.optionIndicator, { backgroundColor: option.color }]}
                                    />
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filters.status === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    {/* Waste Types Filter */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Waste Types</Text>
                        <View style={styles.optionsGrid}>
                            {wasteTypeOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.wasteTypes.includes(option.value) && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleWasteTypeToggle(option.value)}
                                >
                                    <View
                                        style={[styles.optionIndicator, { backgroundColor: option.color }]}
                                    />
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filters.wasteTypes.includes(option.value) && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    {/* Priority Filter */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Priority</Text>
                        <View style={styles.optionsGrid}>
                            {priorityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.priority === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handlePriorityChange(option.value as any)}
                                >
                                    <View
                                        style={[styles.optionIndicator, { backgroundColor: option.color }]}
                                    />
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filters.priority === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    {/* Date Range Filter */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Date Range</Text>
                        <View style={styles.optionsGrid}>
                            {dateRangeOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.dateRange === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleDateRangeChange(option.value as any)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filters.dateRange === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>

                    {/* Sort Options */}
                    <Card style={styles.section}>
                        <Text style={styles.sectionTitle}>Sort By</Text>
                        <View style={styles.optionsGrid}>
                            {sortOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionButton,
                                        filters.sortBy === option.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => handleSortChange(option.value as any)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            filters.sortBy === option.value && styles.optionTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {filters.sortBy === option.value && (
                                        <Ionicons
                                            name={filters.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                            size={16}
                                            color={theme.colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title={`Apply Filters${getActiveFiltersCount() > 0 ? ` (${getActiveFiltersCount()})` : ''}`}
                        onPress={handleApply}
                        variant="primary"
                        fullWidth
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
    resetButton: {
        padding: theme.spacing.xs,
    },
    resetText: {
        ...theme.typography.body2,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    section: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        gap: theme.spacing.xs,
    },
    optionButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight + '20',
    },
    optionIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    optionText: {
        ...theme.typography.body2,
        color: theme.colors.text,
    },
    optionTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
});