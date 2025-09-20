import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  onSelect: (types: string[]) => void;
}

export default function WasteTypeStep({ onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 2: Waste Type</Text>
      <Button title="Organic" onPress={() => onSelect(['Organic'])} />
      <Button title="Plastic" onPress={() => onSelect(['Plastic'])} />
      <Button title="Mixed" onPress={() => onSelect(['Mixed'])} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 18, fontWeight: '600' },
});
