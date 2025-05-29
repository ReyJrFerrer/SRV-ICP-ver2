import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface BookingRequestProps {
  pendingRequests: number;
  upcomingJobs: number;
}

const BookingRequests = ({ pendingRequests, upcomingJobs }: BookingRequestProps) => {
  const router = useRouter();

  const handleViewRequests = () => {
    router.push('/service-provider/bookings/booking-requests');
  };

  const handleViewUpcoming = () => {
    router.push('/service-provider/bookings/upcoming-jobs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bookings</Text>

      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.requestsCard]} 
          onPress={handleViewRequests}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Pending Requests</Text>
              <Text style={styles.cardValue}>{pendingRequests}</Text>
              <Text style={styles.cardSubtext}>Need your response</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="calendar-plus" size={wp('10%')} color="#4F959D" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>View Requests</Text>
            <FontAwesome5 name="chevron-right" size={wp('3%')} color="#4F959D" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.upcomingCard]} 
          onPress={handleViewUpcoming}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Upcoming Jobs</Text>
              <Text style={styles.cardValue}>{upcomingJobs}</Text>
              <Text style={styles.cardSubtext}>Scheduled services</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="calendar-check" size={wp('10%')} color="#4CAF50" />
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardAction}>View Schedule</Text>
            <FontAwesome5 name="chevron-right" size={wp('3%')} color="#4CAF50" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingRequests;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('5.3%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestsCard: {
    borderTopColor: '#4F959D',
    borderTopWidth: hp('0.6%'),
  },
  upcomingCard: {
    borderTopColor: '#4CAF50',
    borderTopWidth: hp('0.6%'),
  },
  cardContent: {
    flexDirection: 'row',
    padding: wp('4%'),
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  cardValue: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.3%'),
  },
  cardSubtext: {
    fontSize: wp('3%'),
    color: '#666',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('15%'),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: wp('3%'),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardAction: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    color: '#666',
  },
});