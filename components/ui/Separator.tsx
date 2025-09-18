import React from 'react';
import {
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export interface SeparatorProps {
    height?: number;
    color?: string;
    style?: ViewStyle;
    horizontal?: boolean;
}

export const Separator: React.FC<SeparatorProps> = ({
    height = 1,
    color = theme.colors.divider,
    style,
    horizontal = false,
}) => {
    const separatorStyle = [
        horizontal ? styles.horizontal : styles.vertical,
        {
            [horizontal ? 'width' : 'height']: height,
            backgroundColor: color,
        },
        style,
    ];

    return <View style={separatorStyle} />;
};

const styles = StyleSheet.create({
    vertical: {
        width: '100%',
    },
    horizontal: {
        height: '100%',
    },
});