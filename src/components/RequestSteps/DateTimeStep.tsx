import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Props {
  onSelect: (date: Date, time: string) => void;
  loading: boolean;
}

export default function DateTimeStep({ onSelect, loading }: Props) {
  const [date] = useState(new Date());
  const [time] = useState('10:00 AM');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 3: Date & Time</Text>
      <Button
        title={loading ? 'Submitting...' : 'Confirm Pickup'}
        onPress={() => onSelect(date, time)}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 18, fontWeight: '600' },
});
