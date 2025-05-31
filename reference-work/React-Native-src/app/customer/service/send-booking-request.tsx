import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Service } from '../../../../assets/types/service/service';
import { SERVICES } from '../../../../assets/services';
import { FontAwesome5 } from '@expo/vector-icons';
import { Package } from '../../../../assets/types/service/service-package';


interface BookingRequestProps{
  serviceID : string;
}

const BookingRequest = () => {
  // gets service id from route params
  const params = useLocalSearchParams<{serviceID: string}>();
  const serviceID = params.serviceID;

  const [service, setService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  

  useEffect(() => {
    if(serviceID){
      // replace to API call in the future
      console.log('Service ID received: ', serviceID);
      const foundService = SERVICES.find(service => service.id === serviceID);
      if (foundService) {
        setService(foundService);
        // Set the first package as default selected if available
        if (foundService.packages && foundService.packages.length > 0) {
          setSelectedPackage(foundService.packages[0]);
        }
      } else {
        console.warn('Service not found with ID: ', serviceID)
      }
    }
  }, [serviceID])

  // Helper to render package cards
  const renderPackageCard = (pkg: Package, isSelected: boolean) => {
    const isPopular = pkg.isPopular;
    
    return (
      <TouchableOpacity 
        key={pkg.id} 
        style={[
          styles.packageCard, 
          isPopular && styles.popularPackageCard,
          isSelected && styles.selectedPackageCard
        ]}
        onPress={() => setSelectedPackage(pkg)}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>Popular</Text>
          </View>
        )}
        <Text style={styles.packageName}>{pkg.name}</Text>
        <Text style={styles.packageDescription}>{pkg.description}</Text>
        
        <View style={styles.packagePriceContainer}>
          <Text style={styles.packageCurrency}>₱</Text>
          <Text style={styles.packagePrice}>{pkg.price}</Text>
          {pkg.duration && <Text style={styles.packageDuration}>/ {pkg.duration}</Text>}
        </View>
        
        <Text style={styles.packageFeaturesTitle}>Includes:</Text>
        
        {pkg.features.map((feature, index) => (
          <View key={index} style={styles.packageFeatureItem}>
            <FontAwesome5 name="check" size={16} color="#4CAF50" />
            <Text style={styles.packageFeatureText}>{feature}</Text>
          </View>
        ))}
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <FontAwesome5 name="check-circle" size={20} color="#007BFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Special requests state
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Date and time state
  const [selectedDate, setSelectedDate] = useState('Select a date');


  // Updated state variables for date/time
  const [bookingType, setBookingType] = useState('same-day');
  const [markedDates, setMarkedDates] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  // Functions for date/time selection
  const handleDateSelect = (day) => {
    const dateString = day.dateString;
    const newMarkedDates = {
      [dateString]: { selected: true, selectedColor: '#007BFF' }
    };
    setSelectedDate(dateString);
    setMarkedDates(newMarkedDates);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
        <Stack.Screen options = {{title: service ? `Booking Page` : "New Booking"}}/>
      <Text style={styles.header}>{service ? `Book ${service.name} - ${service.title}` : "Book Service"}</Text>
      
      {/* Packages Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Package</Text>
        {service && service.packages && service.packages.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packagesContainer}
          >
            {service.packages.map((pkg) => 
              renderPackageCard(pkg, selectedPackage?.id === pkg.id)
            )}
          </ScrollView>
        ) : (
          <Text style={styles.noPackagesText}>No packages available for this service</Text>
        )}
      </View>
      
      {/* Concerns Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Concerns</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Add any concerns or requests..."
          placeholderTextColor={"grey"}
          value={specialRequests}
          onChangeText={setSpecialRequests}
        />
      </View>
      
   
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking Options</Text>
        
        {/* Booking Type Selection */}
        <View style={styles.bookingOptions}>
          <TouchableOpacity 
            style={[
              styles.bookingOption, 
              bookingType === 'same-day' && styles.selectedBookingOption
            ]}
            onPress={() => setBookingType('same-day')}
          >
            <Text style={styles.bookingOptionTitle}>Same day</Text>
            <Text style={styles.bookingOptionSubtitle}>25 - 40 mins</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.bookingOption, 
              bookingType === 'scheduled' && styles.selectedBookingOption
            ]}
            onPress={() => setBookingType('scheduled')}
          >
            <Text style={styles.bookingOptionTitle}>Scheduled</Text>
          </TouchableOpacity>
        </View>
        
        {/* Scheduled Booking Calendar */}
        {bookingType === 'scheduled' && (
          <View style={styles.scheduledOptions}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              theme={{
                todayTextColor: '#007BFF',
                textDisabledColor: '#d9e1e8',
                selectedDayBackgroundColor: '#007BFF',
              }}
            />
            
            {/* Time Selection */}
            <TouchableOpacity 
              style={styles.timePickerButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerButtonText}>
                {selectedTime ? format(selectedTime, 'h:mm a') : 'Select Time'}
              </Text>
            </TouchableOpacity>
            
           
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
            
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service Location</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.addressTitle}>Current Address</Text>
          <Text style={styles.address}>Baguio City</Text>
          <TouchableOpacity style={styles.mapButton}>
            <Text style={styles.buttonText}>View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.buttonText}>Change Address</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Payment Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>
        <View style={styles.paymentOption}>
          <View style={styles.paymentIcon}>
            <Text style={styles.paymentIconText}>💳</Text>
          </View>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>Credit Card</Text>
            <Text style={styles.paymentDescription}>**** **** **** 1234</Text>
          </View>
          <Switch />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Payment Method</Text>
        </TouchableOpacity>
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  // Package card styles
  packagesContainer: {
    paddingVertical: 10,
    paddingRight: 16,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  popularPackageCard: {
    borderColor: '#4F959D',
    borderWidth: 2,
  },
  selectedPackageCard: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#4F959D',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  packagePriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  packageCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packageDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  packageFeaturesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  packageFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  packageFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  noPackagesText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    padding: 15,
  },
  addButton: {
    marginTop: 12,
    padding: 8,
  },
  addButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
 
  },
  calendar: {
    marginVertical: 12,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  calendarDay: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  calendarDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dateButton: {
    width: '14.28%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  timeButton: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
  },
  locationContainer: {
    padding: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    marginBottom: 3,
    color: '#555',
  },
  mapButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  changeButton: {
    backgroundColor: '#6C757D',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E1F5FE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconText: {
    fontSize: 20,
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#777',
  },
  submitButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // New styles for booking options
  bookingOptions: {
    marginVertical: 10,
  },
  bookingOption: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  selectedBookingOption: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  bookingOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookingOptionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  scheduledOptions: {
    marginTop: 15,
  },
  timePickerButton: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  timePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});