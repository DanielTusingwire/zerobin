import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { theme } from '../../../constants/theme';

interface DateTimeStepProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date, time: string) => void;
  adaptiveStyles: { padding: number; fontSize: number; spacing: number };
}

// Company-defined slots
const slots = {
  Morning: ['9:00', '10:00', '11:00'],
  Afternoon: ['12:00', '1:00', '2:00', '3:00'],
  Evening: ['4:00', '5:00', '9:00'],
};

// Example availability: on some dates, only some slots are open
const availability: Record<string, string[]> = {
  '2025-11-08': ['9:00', '11:00', '12:00', '2:00', '4:00'], // available
  '2025-11-10': ['10:00', '1:00', '5:00'], // fewer slots
};

const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  onSelectDate,
  adaptiveStyles,
}) => {
  const [date, setDate] = useState<string | null>(
    selectedDate ? selectedDate.toISOString().split('T')[0] : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDayPress = (day: any) => {
    setDate(day.dateString);
    setSelectedTime(null); // reset time on new date
  };

  const handleTimeSelect = (time: string) => {
    if (!date) return;
    setSelectedTime(time);
    onSelectDate(new Date(date), time);
  };

  const availableSlots = date ? availability[date] || [] : [];

  return (
    <View style={[styles.container, { padding: adaptiveStyles.padding }]}>
      {/* Step Header */}
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>3</Text>
        </View>
        <View>
          <Text style={[styles.stepTitle, { fontSize: adaptiveStyles.fontSize }]}>
            Select Date & Time
          </Text>
          <Text style={[styles.stepSubtitle, { fontSize: adaptiveStyles.fontSize }]}>
            Pick your preferred pickup schedule
          </Text>
        </View>
      </View>

      {/* Calendar */}
      <Calendar
        minDate={new Date().toISOString().split('T')[0]}
        onDayPress={handleDayPress}
        markedDates={{
          ...(date && {
            [date]: {
              selected: true,
              selectedColor: theme.colors.secondary,
            },
          }),
        }}
        theme={{
          todayTextColor: theme.colors.secondary,
          arrowColor: theme.colors.secondary,
        }}
      />

      {/* Slots */}
      {date && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.timeTitle}>Available Slots</Text>
          {Object.entries(slots).map(([period, times]) => (
            <View key={period} style={{ marginBottom: 16 }}>
              <Text style={styles.periodTitle}>{period}</Text>
              <View style={styles.slotRow}>
                {times.map((time) => {
                  const available = availableSlots.includes(time);
                  const selected = selectedTime === time;

                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.slotButton,
                        available && styles.slotAvailable,
                        selected && styles.slotSelected,
                      ]}
                      disabled={!available}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          !available && styles.slotDisabledText,
                          selected && styles.slotSelectedText,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}
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
  timeTitle: {
    marginBottom: 10,
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: 16,
  },
  periodTitle: {
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.textSecondary,
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#ECEFF1',
  },
  slotAvailable: {
    backgroundColor: '#E6F8EC',
  },
  slotSelected: {
    backgroundColor: theme.colors.secondary,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  slotDisabledText: {
    color: '#A0A0A0',
  },
  slotSelectedText: {
    color: 'white',
  },
});
