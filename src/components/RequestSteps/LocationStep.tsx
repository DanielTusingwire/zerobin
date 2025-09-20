import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  onSelect: (location: string) => void;
}

export default function LocationStep({ onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 1: Pickup Location</Text>
      <Button title="Use HQ Address" onPress={() => onSelect('HQ Address')} />
      <Button title="Pin Location on Map" onPress={() => onSelect('Pinned Location')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 18, fontWeight: '600' },
});
