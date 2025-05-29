import {StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView, Dimensions, ImageRequireSource, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
// import { useBookingStore } from '../../../store/booking-store';
import { useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { SERVICES } from '../../../../assets/services';
import { Stack } from 'expo-router';
import {Ionicons} from '@expo/vector-icons'

const {width: screenWidth} = Dimensions.get('window');

const ServiceDetails = () => {
   const {slug} = useLocalSearchParams<{slug : string}>();

   const service = SERVICES.find(service => service.slug === slug);

   if (!service) return <Redirect href = '/404'/>

   // send booking request
   const router = useRouter();

   const sendToBookingRequest = (serviceID : string) => {
      router.push({
         pathname: 'customer/service/send-booking-request',
         params: {serviceID}
      })

   }


   // Image focusing states 
   const [isFocusModalVisible, setIsFocusModalVisible] = useState(false);
   const [focusedImageIndex, setFocusedImageIndex] = useState(0);

   const handleImageFocus = (index: number) => {
      setFocusedImageIndex(index);
      setIsFocusModalVisible(true);
   }
   const handleCloseFocusModal = () => {
      setIsFocusModalVisible(false);
   }

   const goToPreviousImage = () => {
      setFocusedImageIndex(prevIndex => 
         prevIndex === 0 ? allImages.length - 1 : prevIndex - 1

      );
   };

   const goToNextImage = () => {
      setFocusedImageIndex(prevIndex => 
         prevIndex === allImages.length -1 ? 0 : prevIndex + 1
      );
   }; 

   const allImages = [{url : service.heroImage, type: "IMAGE"}, ...service.media]


   return (
      <ScrollView style = {styles.container}>
         <Stack.Screen options = {{title: service.title}}/>
        
         <TouchableOpacity onPress = {() => handleImageFocus(0)}>
            <Image source = {service.heroImage} style = {styles.heroImage}/>
         </TouchableOpacity>


         <View style = {{padding: 16, flex: 1}}>
            <Text style = {styles.title}>{service.name}</Text>
            <Text style = {styles.description}> {service.description}</Text>

            {/* Price Information */}
            <View style={styles.infoSection}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="cash-outline" size={20} color="#333" />
                  <Text style={styles.sectionTitle}>Price</Text>
               </View>
               <Text style={styles.infoText}>
                  ₱{service.price.amount.toFixed(2)} {service.price.unit}
                  {service.price.isNegotiable ? ' (Negotiable)' : ''}
               </Text>
            </View>

            {/* Location Information */}
            <View style={styles.infoSection}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="location-outline" size={20} color="#333" />
                  <Text style={styles.sectionTitle}>Location</Text>
               </View>
               <Text style={styles.infoText}>{service.location.address}</Text>
               <Text style={styles.infoText}>
                  Service Radius: {service.location.serviceRadius} {service.location.serviceRadiusUnit}
               </Text>
            </View>

            {/* Availability Information */}
            <View style={styles.infoSection}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={20} color="#333" />
                  <Text style={styles.sectionTitle}>Availability</Text>
               </View>
               <Text style={styles.infoText}>Days: {service.availability.schedule.join(', ')}</Text>
               <Text style={styles.infoText}>Hours: {service.availability.timeSlots.join(', ')}</Text>
               <Text style={styles.infoText}>
                  {service.availability.isAvailableNow ? '✅ Available Now' : '❌ Not Available Now'}
               </Text>
            </View>

            {/* Rating Information */}
            <View style={styles.infoSection}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="star-outline" size={20} color="#333" />
                  <Text style={styles.sectionTitle}>Rating</Text>
               </View>
               <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{service.rating.average.toFixed(1)}</Text>
                  <Text style={styles.infoText}>({service.rating.count} reviews)</Text>
               </View>
            </View>

            {/* Requirements Information*/}
            <View style = {styles.infoSection}>
               <View style = {styles.sectionHeader}>
                  <Ionicons name = "list-outline" size = {20} color = "#333"/>
                  <Text style = {styles.sectionTitle}>Requirements</Text>
               </View>

               {service.requirements?.map((req,index) => (
                  <Text key = {index} style = {styles.requirementText}>• {req}</Text>
               ))}
            </View>

            {/*Verification Status*/}
            <View style = {styles.infoSection}>
               <View style = {styles.sectionHeader}>
                  <Ionicons name = "star" size = {20} color = "#333"/>
                  <Text style = {styles.sectionTitle}>Verification</Text>
               </View>
               <Text style = {styles.infoText}>
                  {service.isVerified ? 
                     '✅ This service provider is verified' : 
                     '❌ This service provider is not verified'}
               </Text>
            </View>

           {/* Service Images */}
           <View style={styles.infoSection}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="images-outline" size={20} color="#333" />
                  <Text style={styles.sectionTitle}>Service Images</Text>
               </View>
               <FlatList 
                  data={service.media}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                     <TouchableOpacity onPress={() => handleImageFocus(index + 1)}>
                        <Image source={ item.url as any} style={styles.image}/>
                     </TouchableOpacity>
                  )}
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imagesContainer}
               />
            </View>

            {/*Booking Request Button */}
            <TouchableOpacity
               style = {styles.bookingButton}
               onPress = {() => sendToBookingRequest(service.id)}
            >
               <Text style = {styles.bookingButtonText}>Send Booking Request</Text>
            </TouchableOpacity>
            {/*End of display */}   
   </View>
      {/*Start of image focus modal */}
      <Modal
            animationType="fade"
            transparent={true}
            visible={isFocusModalVisible}
            onRequestClose={handleCloseFocusModal}
         >
            <View style={styles.focusModalOverlay}>
               <TouchableOpacity 
                  style={styles.closeButtonContainer} 
                  onPress={handleCloseFocusModal}
               >
                  <Ionicons name="close-circle" size={32} color="#fff" />
               </TouchableOpacity>
               
               <View style={styles.imageControlsContainer}>
                  <TouchableOpacity 
                     style={styles.imageControlButton} 
                     onPress={goToPreviousImage}
                  >
                     <Ionicons name="chevron-back" size={36} color="#fff" />
                  </TouchableOpacity>
                  
                  <Image 
                     source={allImages[focusedImageIndex].url as any} 
                     style={styles.focusedImage}
                     resizeMode="contain"
                  />
                  
                  <TouchableOpacity 
                     style={styles.imageControlButton} 
                     onPress={goToNextImage}
                  >
                     <Ionicons name="chevron-forward" size={36} color="#fff" />
                  </TouchableOpacity>
               </View>
               
               <Text style={styles.imageCounter}>
                  {focusedImageIndex + 1} / {allImages.length}
               </Text>
            </View>
         </Modal>

               


      
   </ScrollView>
   ); 


   


   

   

  
};
                     
export default ServiceDetails;
                      
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   heroImage: {
      width: '100%',
      height: 250, 
      resizeMode: 'cover',
   }, 
   title: {
      fontSize: 24, 
      fontWeight: 'bold',
      marginVertical: 8, 
   }, 
   description: {
      fontSize: 16, 
      color: '#555',
      marginBottom: 16, 
   }, 
   infoSection: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 15,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
   },
   infoText: {
      fontSize: 16,
      color: '#444',
      marginBottom: 4,
   },
   requirementText: {
      fontSize: 15,
      color: '#444',
      marginBottom: 4,
      paddingLeft: 5,
   },
   ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ratingText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ff9900',
      marginRight: 8,
   },
   imagesContainer: {
      marginVertical: 8,
   },
   image: {
      width: 120,
      height: 120,
      marginRight: 10,
      borderRadius: 8,
   },
   bookingButton: {
      backgroundColor: '#28a745',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
   },
   bookingButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
   },
   modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
   },
   modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 10,
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   modalForm: {
      maxHeight: 400,
   },
   inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 6,
      marginTop: 12,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
   },
   textArea: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 6,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
      textAlignVertical: 'top',
      minHeight: 100,
   },
   confirmButton: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 10,
   },
   confirmButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
   },
   // New styles for the image focus functionality
   focusModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   closeButtonContainer: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
   },
   imageControlsContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   imageControlButton: {
      padding: 15,
   },
   focusedImage: {
      width: screenWidth * 0.8,
      height: screenWidth * 0.8,
   },
   imageCounter: {
      position: 'absolute',
      bottom: 30,
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
   },
});