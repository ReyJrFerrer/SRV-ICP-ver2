import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import { SERVICES } from '../../../../assets/services';
import CurrentLocationComponent from '../../../components/UserLocationComponent';
import CurrentLocationMap from '../../../components/ServiceLocationMap';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define types for status values
type BookingStatusType = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
type PaymentStatusType = 'paid' | 'on-hold' | 'refunded' | 'failed';

const mockService = SERVICES[0];

const mockBookingStatus = 'completed' as BookingStatusType;
const mockPaymentStatus = 'on-hold' as PaymentStatusType;

const BookingDetails = () => {
    const [mapExpanded, setMapExpanded] = useState(false);
    const router = useRouter();

    const goToConfirmWork = () => {
        router.push('customer/bookings/confirm-work');
    }

    // Calculate progress based on status
    const getProgressPercentage = (status: BookingStatusType): number => {
        switch(status) {
            case 'pending': return 25;
            case 'confirmed': return 50;
            case 'in-progress': return 75;
            case 'completed': return 100;
            case 'cancelled': return 0;
            default: return 0;
        }
    };
    
    const progressPercentage = getProgressPercentage(mockBookingStatus);

    // Handle expanding/collapsing the map
    const handleMapPress = () => {
        setMapExpanded(!mapExpanded);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={18} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Details</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Provider Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.profileRow}>
                    <Image 
                        source={mockService.heroImage} 
                        style={styles.providerImage} 
                    />
                    <View style={styles.providerInfo}>
                        <Text style={styles.providerName}>{mockService.name}</Text>
                        <Text style={styles.categoryText}>{mockService.category.name}</Text>
                        <View style={styles.ratingContainer}>
                            <FontAwesome5 name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>{mockService.rating.average} ({mockService.rating.count} reviews)</Text>
                        </View>
                    </View>
                </View>

                {/* Location Information */}
                <View style={styles.locationContainer}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <CurrentLocationComponent />
                    <View style={styles.mapContainer}>
                        {mapExpanded ? (
                            <View style={styles.expandedMapContainer}>
                                <CurrentLocationMap onPress={handleMapPress} fullScreen={true} />
                                <TouchableOpacity 
                                    style={styles.collapseButton}
                                    onPress={handleMapPress}
                                >
                                    <FontAwesome5 name="compress-alt" size={16} color="white" />
                                    <Text style={styles.collapseButtonText}>Collapse Map</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.mapPreviewContainer}>
                                <CurrentLocationMap onPress={handleMapPress} fullScreen={false} />
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Activity Status Section */}
            <View style={styles.statusSection}>
                <Text style={styles.sectionTitle}>Activity Status</Text>
                <View style={styles.statusCard}>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusIndicator, { backgroundColor: mockBookingStatus === 'in-progress' ? '#1BC464' : '#ccc' }]} />
                        <Text style={styles.statusText}>
                            {mockBookingStatus === 'in-progress' ? 'Currently Active' : 'Inactive'}
                        </Text>
                    </View>
                    <Text style={styles.statusDescription}>
                        {mockBookingStatus === 'in-progress' 
                            ? 'Service provider is currently working on your request.'
                            : mockBookingStatus === 'pending' 
                                ? 'Waiting for service provider to confirm.'
                                : mockBookingStatus === 'confirmed'
                                    ? 'Service is confirmed and scheduled.'
                                    : mockBookingStatus === 'completed'
                                        ? 'Service has been completed.'
                                        : 'Service has been cancelled.'
                        }
                    </Text>
                </View>
            </View>

            {/* Progress Status Section */}
            <View style={styles.progressSection}>
                <Text style={styles.sectionTitle}>Progress Status</Text>
                <View style={styles.progressCard}>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
                    </View>
                    <View style={styles.progressStepsContainer}>
                        <View style={styles.progressStep}>
                            <View style={[styles.stepIndicator, { backgroundColor: progressPercentage >= 25 ? '#1BC464' : '#e0e0e0' }]} />
                            <Text style={styles.stepText}>Pending</Text>
                        </View>
                        <View style={styles.progressStep}>
                            <View style={[styles.stepIndicator, { backgroundColor: progressPercentage >= 50 ? '#1BC464' : '#e0e0e0' }]} />
                            <Text style={styles.stepText}>Confirmed</Text>
                        </View>
                        <View style={styles.progressStep}>
                            <View style={[styles.stepIndicator, { backgroundColor: progressPercentage >= 75 ? '#1BC464' : '#e0e0e0' }]} />
                            <Text style={styles.stepText}>In Progress</Text>
                        </View>
                        <View style={styles.progressStep}>
                            <View style={[styles.stepIndicator, { backgroundColor: progressPercentage >= 100 ? '#1BC464' : '#e0e0e0' }]} />
                            <Text style={styles.stepText}>Completed</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Payment Details Section */}
            <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Status</Text>
                        <View style={styles.paymentStatusContainer}>
                            <Text style={[styles.paymentStatus, { 
                                color: mockPaymentStatus === 'paid' ? '#1BC464' : 
                                        mockPaymentStatus === 'on-hold' ? '#FF9800' : 
                                        mockPaymentStatus === 'refunded' ? '#3498db' : '#e74c3c'
                            }]}>
                                {mockPaymentStatus === 'paid' ? 'Paid' : 
                                 mockPaymentStatus === 'on-hold' ? 'On Hold' : 
                                 mockPaymentStatus === 'refunded' ? 'Refunded' : 'Failed'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Amount</Text>
                        <Text style={styles.paymentValue}>
                            ${mockService.price.amount.toFixed(2)} {mockService.price.unit}
                        </Text>
                    </View>
                    {/* <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Initial Payment Method</Text>
                        <Text style={styles.paymentValue}>Credit Card</Text>
                    </View> */}
                    {/* <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Transaction ID</Text>
                        <Text style={styles.paymentValue}>TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</Text>
                    </View> */}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
                <TouchableOpacity style={styles.primaryButton} onPress = {() => Alert.alert('This will go to your chat page of Mary Gold')}>
                    <Text style={styles.primaryButtonText}>Contact Service Provider</Text>
                </TouchableOpacity>
                
                {mockBookingStatus !== 'completed' && mockBookingStatus !== 'cancelled' && (
                    <TouchableOpacity style={styles.secondaryButton} onPress = {() => Alert.alert('This will go to the issue page')}>
                        <Text style={styles.secondaryButtonText}>
                            {mockBookingStatus === 'pending' || mockBookingStatus === 'confirmed' 
                                ? 'Cancel Booking' 
                                : 'Report Issue'}
                        </Text>
                    </TouchableOpacity>
                )}
                {mockBookingStatus === 'completed' && (
                      <TouchableOpacity style={styles.secondaryButton} onPress = {goToConfirmWork}>
                      <Text style={styles.completedButtonText}>
                          Verify Work
                      </Text>
                  </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

export default BookingDetails;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 28,
    },
    profileSection: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    providerImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    providerInfo: {
        flex: 1,
    },
    providerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    locationContainer: {
        marginTop: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    mapContainer: {
        marginTop: 10,
    },
    mapPreviewContainer: {
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    expandedMapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.8,
        zIndex: 999,
        backgroundColor: 'white',
    },
    collapseButton: {
        position: 'absolute',
        bottom: 20,
        left: width / 2 - 80,
        backgroundColor: '#1BC464',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
    },
    collapseButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '600',
    },
    statusSection: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 10,
    },
    statusCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statusDescription: {
        fontSize: 14,
        color: '#666',
    },
    progressSection: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
    },
    progressCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#1BC464',
        borderRadius: 4,
    },
    progressStepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressStep: {
        alignItems: 'center',
        width: '25%',
    },
    stepIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 5,
    },
    stepText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    paymentSection: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
    },
    paymentCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 14,
        color: '#666',
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    paymentStatusContainer: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    paymentStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionSection: {
        padding: 15,
        marginBottom: 30,
    },
    primaryButton: {
        backgroundColor: '#1BC464',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'white',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    secondaryButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    completedButtonText: {
        color: 'green',
        fontSize: 16,
        fontWeight: '600',
    },
});