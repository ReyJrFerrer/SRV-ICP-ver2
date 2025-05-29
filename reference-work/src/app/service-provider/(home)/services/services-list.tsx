import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SERVICES } from '../../../../../assets/services';
import ServiceManagement from '../../../../components/ServiceManagement';
import { SERVICE_PROVIDERS } from '../../../../../assets/serviceProviders';
import { FontAwesome5 } from '@expo/vector-icons';

const Services = () => {
  // Filter services for the current provider
  // In a real app, this would filter based on the logged-in provider's ID
  const provider = SERVICE_PROVIDERS[0];
  const providerServices = provider.servicesOffered;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Services</Text>
          <Text style={styles.headerSubtitle}>
            Manage all your services and availability
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FontAwesome5 name="list" size={wp('5%')} color="#4F959D" />
            <Text style={styles.statNumber}>{providerServices.length}</Text>
            <Text style={styles.statLabel}>Total Services</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5 name="toggle-on" size={wp('5%')} color="#4CAF50" />
            <Text style={styles.statNumber}>
              {providerServices.filter(s => s.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statCard}>
            <FontAwesome5 name="toggle-off" size={wp('5%')} color="#FF9800" />
            <Text style={styles.statNumber}>
              {providerServices.filter(s => !s.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        <View style = {styles.servicesContainer}>
          <ServiceManagement services={providerServices} inDashboard = {false} />

        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp('5%'),
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    alignItems: 'center',
    width: wp('28%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: hp('0.5%'),
  },
  statLabel: {
    fontSize: wp('3%'),
    color: '#666',
  },
  servicesContainer: {
    padding: 20,
  }
});