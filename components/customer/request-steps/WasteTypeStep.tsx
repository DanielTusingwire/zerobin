import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../constants/theme';

interface WasteTypeStepProps {
  selectedTypes: string[];
  onSelect: (type: string) => void;
  adaptiveStyles: { padding: number; fontSize: number; spacing: number };
}

const wasteTypes = [
  {
    id: 'organic',
    name: 'Organic',
    image: require('../../../assets/waste/bin.png'),
    subtitle: 'Food scraps, garden waste, etc.',
    bgColor: '#E0F7FA', // light cyan
  },
  {
    id: 'plastic',
    name: 'Plastic',
    image: require('../../../assets/waste/waste.png'),
    subtitle: 'Bottles, containers, packaging.',
    bgColor: '#FFF3E0', // light orange
  },
  {
    id: 'paper',
    name: 'Paper',
    image: require('../../../assets/waste/bin.png'),
    subtitle: 'Newspapers, cardboard, office paper.',
    bgColor: '#E8F5E9', // light green
  },
  {
    id: 'glass',
    name: 'Glass',
    image: require('../../../assets/waste/waste.png'),
    subtitle: 'Bottles, jars, glassware.',
    bgColor: '#F3E5F5', // light purple
  },
  {
    id: 'e-waste',
    name: 'E-Waste',
    image: require('../../../assets/waste/bin.png'),
    subtitle: 'Electronics, batteries, cables.',
    bgColor: '#FFEBEE', // light red
  },
  {
    id: 'mixed',
    name: 'Mixed',
    image: require('../../../assets/waste/waste.png'),
    subtitle: 'General household waste.',
    bgColor: '#FFFDE7', // light yellow
  },
];

const WasteTypeStep: React.FC<WasteTypeStepProps> = ({ selectedTypes, onSelect, adaptiveStyles }) => {
  const toggleSelection = (type: string) => {
    onSelect(type);
  };

  return (
    <View style={[styles.stepContainer, { padding: adaptiveStyles.padding }]}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>2</Text>
        </View>
        <View>
          <Text style={[styles.stepTitle, { fontSize: adaptiveStyles.fontSize }]}>
            Select Waste Type
          </Text>
          <Text style={[styles.stepSubtitle, { fontSize: adaptiveStyles.fontSize }]}>
            Choose the types of waste for pickup
          </Text>
        </View>
      </View>

      <FlatList
        data={wasteTypes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: item.bgColor },
              selectedTypes.includes(item.id) && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
            onPress={() => toggleSelection(item.id)}
          >
            <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WasteTypeStep;

const styles = StyleSheet.create({
  stepContainer: {
    paddingVertical: 10,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '600',
    fontSize: 16,
  },
  stepTitle: {
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  card: {
    flex: 0.48,
    backgroundColor: '#F6F8FA', // light color
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // No shadow
  },
  cardImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  cardText: {
    marginTop: 10,
    fontWeight: '500',
    color: theme.colors.text,
    fontSize: 14,
  },
});
