import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../constants/theme';

interface AdaptiveStyles {
  padding: number;
  fontSize: number;
  spacing: number;
}

interface LocationStepProps {
  onSelect: (location: string) => void;
  adaptiveStyles: AdaptiveStyles;
}

const LocationStep: React.FC<LocationStepProps> = ({ onSelect, adaptiveStyles }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const allLocations = [
    { name: 'Associação de Catadores (ASCAS)', address: 'Av. Santos Dumont, 764' },
    { name: 'Coleta Municipal', address: 'Rua Batista de Castro, 37' },
    { name: 'Centro de Reciclagem Verde', address: 'Rua das Flores, 123' },
    { name: 'EcoPonto Vila Madalena', address: 'Av. Paulista, 1000' },
    { name: 'Cooperativa Recicla SP', address: 'Rua Augusta, 456' },
    { name: 'Ponto de Coleta Seletiva', address: 'Av. Faria Lima, 789' },
  ];

  const filteredLocations = allLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
      {/* Header */}
      <View style={styles.stepHeaderContainer}>
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View>
            <Text style={[styles.stepTitle, { fontSize: adaptiveStyles.fontSize }]}> 
              Pickup Location
            </Text>
            <Text style={[styles.stepSubtitle, { fontSize: adaptiveStyles.fontSize - 4 }]}> 
              Select where the waste will be collected
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="mic" size={20} color={theme.colors.textSecondary} />
      </View>

      {/* Location List */}
      <View style={styles.locationList}>
        {filteredLocations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={styles.locationItem}
            onPress={() => onSelect(location.address)}
          >
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={20} color={theme.colors.secondary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LocationStep;

const styles = StyleSheet.create({
  stepContainer: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  stepHeaderContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginHorizontal: -20,
    marginTop: -10,
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  locationList: {
    gap: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  locationIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: theme.colors.secondary + '15',
    borderRadius: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    opacity: 0.7,
    marginTop: 2,
  },
});
