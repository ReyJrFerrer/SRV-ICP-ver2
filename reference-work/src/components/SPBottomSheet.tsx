import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ServiceDetailsContentProps {
  service: any; 
  onDismiss?: () => void;
}

const ServiceDetailsContent = ({ service, onDismiss }: ServiceDetailsContentProps) => {
  const router = useRouter();

  const sendToBookingRequest = (serviceID : string) => {
    if (onDismiss) {
      onDismiss();
  }
    router.push({
       pathname: 'customer/service/send-booking-request',
       params: {serviceID}
    })

 }

  const handleViewFullDetails = () => {
    if (onDismiss) {
      onDismiss();
    }

    router.push(`customer/service/${service.slug}`);
  };
  
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={16} color="#FFD700" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Ionicons key="half-star" name="star-half" size={16} color="#FFD700" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-star-${i}`} name="star-outline" size={16} color="#FFD700" />);
    }
    
    return stars;
  };
  
  return (
    <ScrollView style={styles.container}>
      <Image source={service.heroImage} style={styles.heroImage} />
      
      <View style={styles.contentContainer}>
        {/* Header with provider details */}
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{service.name}</Text>
            {service.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color="#28a745" style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.subtitle}>{service.title}</Text>
          
          {/* Category */}
          <View style={styles.categoryContainer}>
            <Ionicons name={service.category?.icon || "grid-outline"} size={14} color="#666" />
            <Text style={styles.categoryText}>{service.category?.name || "Service"}</Text>
          </View>
        </View>
        
        {/* Description */}
        <Text style={styles.description}>{service.description}</Text>
        
        {/* Rating Information */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={18} color="#333" />
            <Text style={styles.sectionTitle}>Rating</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(service.rating.average)}
            </View>
            <Text style={styles.ratingText}>{service.rating.average.toFixed(1)}</Text>
            <Text style={styles.infoText}>({service.rating.count} reviews)</Text>
          </View>
        </View>
        
        {/* Price Information */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={18} color="#333" />
            <Text style={styles.sectionTitle}>Price</Text>
          </View>
          <Text style={styles.infoText}>
            ₱{service.price.amount.toFixed(2)} {service.price.unit}
            {service.price.isNegotiable ? ' (Negotiable)' : ''}
          </Text>
        </View>
        
        {/* Address/Location */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color="#333" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.infoText}>{service.location.address}</Text>
          <Text style={styles.serviceRadius}>Service radius: {service.location.serviceRadius} {service.location.serviceRadiusUnit}</Text>
        </View>
        
        {/* Availability Information */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color="#333" />
            <Text style={styles.sectionTitle}>Availability</Text>
          </View>
          <View style={styles.availabilityDetails}>
            <Text style={service.availability.isAvailableNow ? styles.availableNow : styles.notAvailableNow}>
              {service.availability.isAvailableNow ? '● Available Now' : '● Not Available Now'}
            </Text>
            <Text style={styles.scheduleText}>
              {service.availability.schedule.join(', ')} • {service.availability.timeSlots.join(', ')}
            </Text>
          </View>
        </View>
        
        {/* Requirements */}
        {service.requirements && service.requirements.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={18} color="#333" />
              <Text style={styles.sectionTitle}>Requirements</Text>
            </View>
            <View style={styles.requirementsList}>
              {service.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark" size={14} color="#28a745" />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Booking Button */}
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => sendToBookingRequest(service.id)}
        >
          <Text style={styles.bookingButtonText}>Send Booking Request</Text>
        </TouchableOpacity>
        
        {/* View More Details Link */}
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={handleViewFullDetails}
        >
          <Text style={styles.viewMoreText}>View Full Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 6,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginTop: 2,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  serviceRadius: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  availabilityDetails: {
    marginTop: 4,
  },
  availableNow: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  notAvailableNow: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  scheduleText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9900',
    marginRight: 6,
  },
  requirementsList: {
    marginTop: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
  },
  bookingButton: {
    backgroundColor: '#4285F4', // Google Maps blue
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 2,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewMoreText: {
    color: '#4285F4', // Google Maps blue
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ServiceDetailsContent;