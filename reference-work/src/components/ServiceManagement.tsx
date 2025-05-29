import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Service } from '../../assets/types/service/service';
import { FlashList } from '@shopify/flash-list';

interface ServiceManagementProps {
  services: Service[];
  // add boolean value to change layout
  inDashboard?: boolean;
}

/**
 * Will change the scroll view into a flashlist 
 * 15/4/2025
 * -reysu
 * @param param0 
 * @returns 
 */
const ServiceManagement = ({ services, inDashboard = true }: ServiceManagementProps) => {
  const router = useRouter();

  const handleAddService = () => {
    // Will navigate to service creation flow
    // router.push('/service-provider/add-service'); 
    Alert.alert('Goes to the Add Pages Screen');
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      key={item.id} 
      style={[
        styles.serviceCard,
        !inDashboard && styles.verticalServiceCard
      ]}
      onPress={() => router.push(`/service-provider/service-details/${item.id}`)}
    >
      <View style={styles.serviceStatusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#4CAF50' : '#FF9800' }]} />
        <Text style={styles.statusText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
      </View>
      
      <View style={styles.serviceIconContainer}>
        <FontAwesome5 
          name={item.category?.icon || 'cubes'} 
          size={wp(inDashboard ? '12%' : '15%')} 
          color="#4F959D" 
        />
      </View>
      
      <Text style={styles.serviceTitle} numberOfLines={2}>{item.title}</Text>
      
      <View style={styles.servicePrice}>
        <Text style={styles.priceCurrency}>₱</Text>
        <Text style={styles.priceAmount}>{item.price.amount}</Text>
        <Text style={styles.priceUnit}>{item.price.unit}</Text>
      </View>
      
      <View style={styles.serviceFooter}>
        <View style={styles.ratingContainer}>
          <FontAwesome5 name="star" size={wp('3%')} color="#FFC107" />
          <Text style={styles.ratingText}>{item.rating.average}</Text>
        </View>
        <Text style={styles.bookingsText}>{item.rating.count} reviews</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>My Services</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddService}
        >
          <FontAwesome5 name="plus" size={wp('3.5%')} color="white" />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="clipboard-list" size={wp('15%')} color="#ccc" />
          <Text style={styles.emptyText}>You haven't added any services yet</Text>
          <Text style={styles.emptySubText}>Add your first service to start taking bookings</Text>
        </View>
      ) : (
        <View style={[
          inDashboard ? styles.horizontalListContainer : styles.verticalListContainer
        ]}>
          <FlashList
            data={services}
            renderItem={renderServiceCard}
            estimatedItemSize={inDashboard ? wp('65%') : wp('45%')}
            horizontal={inDashboard}
            numColumns={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default ServiceManagement;

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2%'),
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F959D',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  addButtonText: {
    color: 'white',
    marginLeft: wp('1.5%'),
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: wp('2%'),
    padding: wp('8%'),
    height: hp('20%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#666',
    marginTop: hp('2%'),
  },
  emptySubText: {
    fontSize: wp('3.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  horizontalListContainer: {
    height: hp('32%'),
  },
  verticalListContainer: {
    height: hp('75%'),
    paddingBottom: hp('1%'),
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginRight: wp('3%'),
    width: wp('65%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verticalServiceCard: {
    width: wp('90%'),
    margin: wp('1%'),
    marginBottom: wp('2%'),
    marginRight: wp('3%'),
    
  },
  serviceStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  statusDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  statusText: {
    fontSize: wp('3%'),
    color: '#666',
  },
  serviceIconContainer: {
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  serviceTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
    height: hp('4.5%'),
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: hp('1%'),
  },
  priceCurrency: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceAmount: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: wp('0.5%'),
  },
  priceUnit: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
    alignSelf: 'flex-end',
    marginBottom: wp('1%'),
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
  },
  bookingsText: {
    fontSize: wp('3%'),
    color: '#888',
  },
});