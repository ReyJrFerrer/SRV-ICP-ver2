import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ProviderAvailabilityProps {
  weeklySchedule: {
    [key: string]: { 
      isAvailable: boolean;
      slots: {
        startTime: string;
        endTime: string;
      }[];
    };
  };
}

const AvailabilityManagement = ({ weeklySchedule }: ProviderAvailabilityProps) => {
  const router = useRouter();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const handleEditAvailability = () => {
    Alert.alert('Goes to the Availability Schedule Screen')
    // router.push('/service-provider/availability');
  };

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>My Availability</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditAvailability}
        >
          <FontAwesome5 name="edit" size={wp('3.5%')} color="white" />
          <Text style={styles.editButtonText}>Edit Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleContainer}>
        {daysOfWeek.map((day) => {
          const dayData = weeklySchedule[day];
          
          return (
            <View key={day} style={styles.dayRow}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{day}</Text>
                <View style={[
                  styles.availabilityIndicator, 
                  { backgroundColor: dayData?.isAvailable ? '#4CAF50' : '#ccc' }
                ]} />
              </View>
              
              {dayData?.isAvailable ? (
                <View style={styles.timeSlots}>
                  {dayData.slots.map((slot, index) => (
                    <Text key={index} style={styles.timeSlot}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity 
        style={styles.vacationButton}
        // onPress={() => router.push('/service-provider/vacation-dates')}
        onPress={() => Alert.alert('Goes to the Vacation Dates Screen')}
      >
        <FontAwesome5 name="umbrella-beach" size={wp('4%')} color="#FF9800" />
        <Text style={styles.vacationButtonText}>Set Vacation Dates</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AvailabilityManagement;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('5.3%'),
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F959D',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  editButtonText: {
    color: 'white',
    marginLeft: wp('1.5%'),
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  scheduleContainer: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('25%'),
  },
  dayName: {
    fontSize: wp('3.8%'),
    marginRight: wp('2%'),
    color: '#333',
    fontWeight: '500',
  },
  availabilityIndicator: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
  },
  timeSlots: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timeSlot: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.3%'),
  },
  unavailableText: {
    fontSize: wp('3.5%'),
    color: '#999',
    fontStyle: 'italic',
  },
  vacationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFECB3',
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    marginTop: hp('1.5%'),
  },
  vacationButtonText: {
    color: '#FF9800',
    marginLeft: wp('2%'),
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
});