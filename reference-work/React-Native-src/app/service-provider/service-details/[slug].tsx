import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SERVICES } from '../../../../assets/services';
import { Service } from '../../../../assets/types/service/service';
import { Package } from '../../../../assets/types/service/service-package';

const ServiceDetails = () => {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState(false);

  useEffect(() => {
    // Find the service by id or slug
    const foundService = SERVICES.find(
      s => s.id === slug || s.slug === slug
    );
    
    if (foundService) {
      setService(foundService);
    }
    setLoading(false);
  }, [slug]);

  const handleEditService = () => {
    // Navigate to the edit service page
    if (service) {
      Alert.alert('Navigate to the edit service page')
      // router.push(`/service-provider/service-details/edit-service`);
    }
  };

  const handleDeleteService = () => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            // Handle service deletion
            Alert.alert("Service deleted successfully");
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderPackageCard = (pkg: Package, isPopular?: boolean) => {
    return (
      <View key={pkg.id} style={[styles.packageCard, isPopular && styles.popularPackageCard]}>
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
            <FontAwesome5 name="check" size={wp('3%')} color="#4CAF50" />
            <Text style={styles.packageFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading service details...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5 name="exclamation-circle" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {/* <Stack.Screen 
        options={{
          headerTitle: service.title,
          headerBackTitle: "Services",
        }} 
      /> */}
      <ScrollView style={styles.container}>
      <Stack.Screen options = {{title: service.title}}/>
        {/* Header with service image */}
        <View style={styles.header}>
          <Image 
            source={service.heroImage} 
            style={styles.heroImage}
          />
          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <View style={styles.categoryBadge}>
                <FontAwesome5 name={service.category.icon} size={wp('3%')} color="#FFF" />
                <Text style={styles.categoryText}>{service.category.name}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.statusButton}
            onPress={() => Alert.alert("Toggle status", "This will toggle the service availability status")}
          >
            <View style={[styles.statusDot, { backgroundColor: service.isActive ? '#4CAF50' : '#FF9800' }]} />
            <Text style={styles.statusText}>{service.isActive ? 'Active' : 'Inactive'}</Text>
          </TouchableOpacity>

          <View style={styles.mainActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditService}
            >
              <FontAwesome5 name="edit" size={wp('4%')} color="#FFF" />
              <Text style={styles.buttonText}>Customize</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteService}
            >
              <FontAwesome5 name="trash-alt" size={wp('4%')} color="#FFF" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Details Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Title</Text>
              <Text style={styles.detailValue}>{service.title}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{service.description}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>₱</Text>
                <Text style={styles.amount}>{service.price.amount}</Text>
                <Text style={styles.unit}>{service.price.unit}</Text>
                {service.price.isNegotiable && (
                  <View style={styles.negotiableBadge}>
                    <Text style={styles.negotiableText}>Negotiable</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Service Packages Section */}
        {service.packages && service.packages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Packages</Text>
            {/* <Text style={styles.sectionSubtitle}>Choose a package that best fits your client's needs</Text> */}
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packagesContainer}
            >
              {service.packages.map((pkg) => renderPackageCard(pkg, pkg.isPopular))}
            </ScrollView>
          </View>
        )}

        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Availability</Text>
          <View style={styles.availabilityCard}>
            <View style={styles.daysContainer}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const fullDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
                const isAvailable = service.availability.schedule.includes(fullDay);
                
                return (
                  <View key={day} style={styles.dayItem}>
                    <Text style={styles.dayText}>{day}</Text>
                    <View style={[styles.dayIndicator, { backgroundColor: isAvailable ? '#4CAF50' : '#E0E0E0' }]} />
                  </View>
                );
              })}
            </View>
            
            <View style={styles.timeSlotSection}>
              <Text style={styles.timeSlotLabel}>Time Slots:</Text>
              {service.availability.timeSlots.map((slot, index) => (
                <View key={index} style={styles.timeSlot}>
                  <FontAwesome5 name="clock" size={wp('4%')} color="#4F959D" />
                  <Text style={styles.timeSlotText}>{slot}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Requirements</Text>
          <View style={styles.requirementsCard}>
            {service.requirements && service.requirements.length > 0 ? (
              service.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <FontAwesome5 name="check-circle" size={wp('4%')} color="#4F959D" />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noRequirementsText}>No requirements specified</Text>
            )}
          </View>
        </View>

        {/* Terms and Conditions Section */}
        {service.terms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <View style={styles.termsCard}>
              <View style={styles.termsHeader}>
                <Text style={styles.termsTitle}>{service.terms.title}</Text>
                <Text style={styles.termsVersion}>v{service.terms.version}</Text>
              </View>
              
              <Text style={styles.termsLastUpdated}>
                Last updated: {service.terms.lastUpdated.toLocaleDateString()}
              </Text>
              
              {service.terms.acceptanceRequired && (
                <View style={styles.acceptanceRequiredBadge}>
                  <FontAwesome5 name="exclamation-circle" size={wp('3%')} color="#FF6B6B" />
                  <Text style={styles.acceptanceRequiredText}>Client acceptance required</Text>
                </View>
              )}
              
              <View style={styles.termsContentContainer}>
                <Text 
                  style={[
                    styles.termsContent, 
                    !expandedTerms && { height: hp('10%') }
                  ]}
                  numberOfLines={expandedTerms ? undefined : 6}
                >
                  {service.terms.content}
                </Text>
                
                {!expandedTerms && (
                  <TouchableOpacity 
                    style={styles.expandTermsButton}
                    onPress={() => setExpandedTerms(true)}
                  >
                    <Text style={styles.expandTermsButtonText}>Show Full Terms</Text>
                    <FontAwesome5 name="chevron-down" size={wp('3%')} color="#4F959D" />
                  </TouchableOpacity>
                )}
                
                {expandedTerms && (
                  <TouchableOpacity 
                    style={styles.expandTermsButton}
                    onPress={() => setExpandedTerms(false)}
                  >
                    <Text style={styles.expandTermsButtonText}>Collapse Terms</Text>
                    <FontAwesome5 name="chevron-up" size={wp('3%')} color="#4F959D" />
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity style={styles.editTermsButton}>
                <FontAwesome5 name="edit" size={wp('3.5%')} color="#4F959D" />
                <Text style={styles.editTermsButtonText}>Edit Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Media Gallery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
            {service.media.map((item, index) => (
              <Image 
                key={index}
                source={item.url}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Stats</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <FontAwesome5 name="star" size={wp('4%')} color="#FFC107" />
              <Text style={styles.statValue}>{service.rating.average}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <FontAwesome5 name="comment" size={wp('4%')} color="#4F959D" />
              <Text style={styles.statValue}>{service.rating.count}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <FontAwesome5 name="map-marker-alt" size={wp('4%')} color="#FF6B6B" />
              <Text style={styles.statValue}>{service.location.serviceRadius}</Text>
              <Text style={styles.statLabel}>km Radius</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  errorText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#555',
    marginVertical: hp('2%'),
  },
  backButton: {
    backgroundColor: '#4F959D',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('5%'),
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    height: hp('25%'),
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: wp('5%'),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F959D',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2.5%'),
    borderRadius: wp('5%'),
  },
  categoryText: {
    color: 'white',
    marginLeft: wp('1%'),
    fontSize: wp('3%'),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('5%'),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  statusDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    marginRight: wp('1.5%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  mainActions: {
    flexDirection: 'row',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F959D',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
    marginRight: wp('2%'),
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  buttonText: {
    color: 'white',
    marginLeft: wp('1.5%'),
    fontSize: wp('3.5%'),
  },
  section: {
    padding: wp('5%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  sectionSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1.5%'),
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    marginBottom: hp('1.5%'),
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  detailValue: {
    fontSize: wp('4%'),
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  amount: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: wp('0.5%'),
  },
  unit: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
  },
  negotiableBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: hp('0.3%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('5%'),
    marginLeft: wp('2%'),
  },
  negotiableText: {
    fontSize: wp('3%'),
    color: '#4CAF50',
  },
  // Packages styles
  packagesContainer: {
    paddingVertical: hp('1%'),
    paddingRight: wp('5%'),
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginRight: wp('4%'),
    width: wp('70%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  popularPackageCard: {
    borderColor: '#4F959D',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: wp('-2%'),
    right: wp('5%'),
    backgroundColor: '#4F959D',
    paddingVertical: hp('0.3%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('4%'),
  },
  popularBadgeText: {
    color: 'white',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  packageName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  packageDescription: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1.5%'),
  },
  packagePriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: hp('1.5%'),
  },
  packageCurrency: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packagePrice: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packageDuration: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('1%'),
  },
  packageFeaturesTitle: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  packageFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  packageFeatureText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginLeft: wp('2%'),
    flex: 1,
  },
  // Terms & conditions styles
  termsCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  termsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  termsTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  termsVersion: {
    fontSize: wp('3%'),
    color: '#666',
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('0.2%'),
    paddingHorizontal: wp('1.5%'),
    borderRadius: wp('4%'),
  },
  termsLastUpdated: {
    fontSize: wp('3%'),
    color: '#666',
    marginBottom: hp('1%'),
  },
  acceptanceRequiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1.5%'),
  },
  acceptanceRequiredText: {
    fontSize: wp('3%'),
    color: '#FF6B6B',
    marginLeft: wp('1%'),
  },
  termsContentContainer: {
    position: 'relative',
  },
  termsContent: {
    fontSize: wp('3.5%'),
    color: '#555',
    lineHeight: wp('5%'),
    overflow: 'hidden',
  },
  expandTermsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('0.8%'),
    borderRadius: wp('1%'),
    marginTop: hp('1%'),
  },
  expandTermsButtonText: {
    fontSize: wp('3.5%'),
    color: '#4F959D',
    marginRight: wp('1%'),
  },
  editTermsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4F959D',
    borderRadius: wp('1%'),
    paddingVertical: hp('1%'),
    marginTop: hp('1.5%'),
  },
  editTermsButtonText: {
    fontSize: wp('3.5%'),
    color: '#4F959D',
    marginLeft: wp('1%'),
  },
  // Existing availability styles
  availabilityCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  dayItem: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: wp('3.5%'),
    color: '#555',
    marginBottom: hp('0.5%'),
  },
  dayIndicator: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
  },
  timeSlotSection: {
    marginTop: hp('1%'),
  },
  timeSlotLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1%'),
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: wp('2%'),
    borderRadius: wp('1%'),
    marginBottom: hp('0.5%'),
  },
  timeSlotText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginLeft: wp('2%'),
  },
  requirementsCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  requirementText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginLeft: wp('2%'),
    flex: 1,
  },
  noRequirementsText: {
    fontSize: wp('3.5%'),
    color: '#999',
    fontStyle: 'italic',
  },
  galleryContainer: {
    flexDirection: 'row',
    marginVertical: hp('1%'),
  },
  galleryImage: {
    width: wp('40%'),
    height: wp('30%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: hp('0.5%'),
  },
  statLabel: {
    fontSize: wp('3%'),
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
    height: '80%',
    alignSelf: 'center',
  },
});