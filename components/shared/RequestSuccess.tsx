import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// Update the import path if your theme file is located elsewhere, for example:
import { theme } from '../../constants/theme';
// Or create the file '../../../constants/theme.ts' with a theme export if it doesn't exist.

interface RequestSuccessProps {
  onDone: () => void;
  requestId?: string;
}

export const RequestSuccess: React.FC<RequestSuccessProps> = ({ onDone, requestId }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/success.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Request Submitted!</Text>
      <Text style={styles.message}>
        {requestId
          ? `Your pickup request ID is ${requestId}. Our team will contact you shortly.`
          : 'Our team will contact you shortly regarding your pickup.'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
    marginBottom: 32,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
