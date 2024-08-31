import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState<string>('');

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>

                <ThemedText type="title">Takvim</ThemedText>
            </View>

            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
                theme={{
                    todayTextColor: '#00adf5',
                    arrowColor: 'orange',
                    textDayFontWeight: 'bold',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: 'bold',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                }}
                style={styles.calendar}
            />

            {selectedDate ? (
                <ThemedText style={styles.selectedDateText}>
                    Seçilen Tarih: {selectedDate}
                </ThemedText>
            ) : (
                <ThemedText style={styles.selectedDateText}>Lütfen bir tarih seçin</ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,

    },
    calendar: {
        borderRadius: 10,
        elevation: 3,
    },
    selectedDateText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
});
