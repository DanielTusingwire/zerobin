import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../../constants/theme';

interface DateTimeStepProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date, time: string) => void;
  adaptiveStyles: { padding: number; fontSize: number; spacing: number };
}

const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

const DateTimeStep: React.FC<DateTimeStepProps> = ({ selectedDate, onSelectDate, adaptiveStyles }) => {
  const [date, setDate] = useState(selectedDate || new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateChange = (event: any, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onSelectDate(date, time);
  };

  return (
    <View style={[styles.container, { padding: adaptiveStyles.padding }]}>
      {/* Step Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>3</Text>
        </View>
        <View>
          <Text style={[styles.stepTitle, { fontSize: adaptiveStyles.fontSize }]}>Select Date & Time</Text>
          <Text style={[styles.stepSubtitle, { fontSize: adaptiveStyles.fontSize }]}>Pick your preferred pickup schedule</Text>
        </View>
      </View>

      {/* Date Picker */}
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Slots */}
      <Text style={styles.timeTitle}>Select Time Slot</Text>
      <FlatList
        data={timeSlots}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.timeCard,
              selectedTime === item && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => handleTimeSelect(item)}
          >
            <Text style={[styles.timeText, selectedTime === item && { color: 'white' }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DateTimeStep;

const styles = StyleSheet.create({
  container: {
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
  datePicker: {
    marginVertical: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  timeTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '500',
    color: theme.colors.text,
  },
  timeCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ECEFF1',
    borderRadius: 10,
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
});
