import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, Modal,SafeAreaView, Alert
} from 'react-native';
import { SERVICES } from '../../../../assets/services';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sample images for completed work
const sampleImages = [
  require('../../../../assets/images/CleaningService-VerWork1.jpeg'),
  require('../../../../assets/images/CleaningService-VerWork2.jpeg'),
  require('../../../../assets/images/CleaningService-VerWork3.jpeg'),
];

const ConfirmWork = () => {
  const serviceProvider = SERVICES[0]; // Using the first service provider (Mary Gold)
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < sampleImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <FontAwesome
            name={i <= rating ? 'star' : 'star-o'}
            size={24}
            color={i <= rating ? '#FFD700' : '#C4C4C4'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image Carousel Card */}
        <View style={styles.imageCarouselCard}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleImagePress}>
            <Image 
              source={sampleImages[currentImageIndex]} 
              style={styles.carouselImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
          
          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <TouchableOpacity 
              style={[styles.arrowButton, styles.leftArrow]} 
              onPress={handlePrevImage}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          
          {currentImageIndex < sampleImages.length - 1 && (
            <TouchableOpacity 
              style={[styles.arrowButton, styles.rightArrow]} 
              onPress={handleNextImage}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}
          
          {/* Image Indicator */}
          <View style={styles.indicatorContainer}>
            {sampleImages.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  index === currentImageIndex && styles.activeIndicator
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.requestChangesButton} onPress = {() => Alert.alert('This will go to the request changes page')}>
            <Text style={styles.requestChangesText}>Request Changes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.approveButton} onPress = {() => Alert.alert('This would mark that you approved the service')}>
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>

        {/* Service Summary Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Service Summary</Text>
          <View style={styles.card}>
            <View style={styles.serviceDetailRow}>
              <Text style={styles.serviceDetailLabel}>Service Type</Text>
              <Text style={styles.serviceDetailValue}>{serviceProvider.title}</Text>
            </View>
            <View style={styles.serviceDetailRow}>
              <Text style={styles.serviceDetailLabel}>Duration</Text>
              <Text style={styles.serviceDetailValue}>2.5 Hours</Text>
            </View>
            <View style={styles.serviceDetailRow}>
              <Text style={styles.serviceDetailLabel}>Total Amount</Text>
              <Text style={styles.serviceDetailAmount}>
                ₱{(serviceProvider.price.amount * 2.5).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment method</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentCard, 
              selectedPayment === 'cash' && styles.selectedPaymentCard
            ]}
            onPress={() => setSelectedPayment('cash')}
          >
            <View style={styles.paymentCardContent}>
              <MaterialCommunityIcons name="cash" size={24} color="#4CAF50" />
              <View style={styles.paymentCardTextContainer}>
                <Text style={styles.paymentCardTitle}>Cash</Text>
                <Text style={styles.paymentCardSubtitle}>Pay in person</Text>
              </View>
            </View>
            {selectedPayment === 'cash' && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentCard, 
              selectedPayment === 'gcash' && styles.selectedPaymentCard
            ]}
            onPress={() => setSelectedPayment('gcash')}
          >
            <View style={styles.paymentCardContent}>
              <View style={styles.gcashIconContainer}>
                <Text style={styles.gcashIcon}>G</Text>
              </View>
              <View style={styles.paymentCardTextContainer}>
                <Text style={styles.paymentCardTitle}>GCash</Text>
                <Text style={styles.paymentCardSubtitle}>Pay with GCash</Text>
              </View>
            </View>
            {selectedPayment === 'gcash' && (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Rating & Review Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Rating & Review</Text>
          <View style={styles.card}>
            <View style={styles.providerInfoContainer}>
              <Image 
                source={serviceProvider.heroImage} 
                style={styles.providerAvatar} 
              />
              <View style={styles.providerDetails}>
                <Text style={styles.providerName}>{serviceProvider.name}</Text>
                <Text style={styles.providerTitle}>{serviceProvider.title}</Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              {renderStars()}
            </View>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              multiline
              numberOfLines={3}
              value={review}
              onChangeText={setReview}
            />
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Modal for zoom view */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            style={styles.closeModal} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image 
            source={sampleImages[currentImageIndex]} 
            style={styles.modalImage} 
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConfirmWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  imageCarouselCard: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  requestChangesButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  requestChangesText: {
    color: 'white',
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  approveText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceDetailLabel: {
    fontSize: 15,
    color: '#666',
  },
  serviceDetailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  serviceDetailAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPaymentCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCardTextContainer: {
    marginLeft: 12,
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentCardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  gcashIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0070E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gcashIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  providerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  providerDetails: {
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  providerTitle: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    marginRight: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: width,
  },
  closeModal: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});