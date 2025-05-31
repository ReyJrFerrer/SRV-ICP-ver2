import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import SPHeader from '../../../components/SPHeader';
import ProviderStats from '../../../components/ProviderStats';
import ServiceManagement from '../../../components/ServiceManagement';
import AvailabilityManagement from '../../../components/AvailabilityManagement';
import BookingRequests from '../../../components/BookingRequests';
import CredentialsDisplay from '../../../components/CredentialsDisplay';
import { SERVICE_PROVIDERS } from '../../../../assets/serviceProviders';
import { PROVIDER_ORDERS, PROVIDER_BOOKING_REQUESTS } from '../../../../assets/providerOrders';

const SPDashboard = () => {
  // Using the first provider from the sample data for the dashboard
  const provider = SERVICE_PROVIDERS[0];
  
  // Count pending requests from PROVIDER_BOOKING_REQUESTS
  const pendingRequests = PROVIDER_BOOKING_REQUESTS.length;
  
  // Count upcoming jobs (with CONFIRMED status) from PROVIDER_ORDERS
  const upcomingJobs = PROVIDER_ORDERS.filter(order => order.status === 'CONFIRMED').length;
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Provider Header */}
        <SPHeader providerName={provider.firstName} />
        
        {/* Provider Stats Section */}
        <ProviderStats 
          totalEarnings={provider.earningSummary.totalEarnings}
          totalEarningsThisMonth={provider.earningSummary.totalEarningsThisMonth}
          pendingPayouts={provider.earningSummary.pendingPayouts}
          completionRate={provider.earningSummary.completionRate}
          averageRating={provider.averageRating}
          totalReviews={provider.totalReviews}
          totalCompletedJobs={provider.totalCompletedJobs}
        />
        
        {/* Booking Requests Section */}
        <BookingRequests 
          pendingRequests={pendingRequests} // Using actual count from PROVIDER_BOOKING_REQUESTS
          upcomingJobs={upcomingJobs} // Using filtered count from PROVIDER_ORDERS
        />
        
        {/* Service Management Section */}
        <ServiceManagement services={provider.servicesOffered} inDashboard = {true}/>
        
        {/* Availability Management Section */}
        <AvailabilityManagement weeklySchedule={provider.availability.weeklySchedule} />
        
        {/* Credentials Display Section */}
        <CredentialsDisplay 
          verificationStatus={provider.verificationStatus}
          identityVerified={provider.identityVerified}
          backgroundCheckPassed={provider.backgroundCheckPassed}
          credentials={provider.credentials}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SPDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
});