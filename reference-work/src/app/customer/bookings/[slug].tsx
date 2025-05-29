import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { SERVICES } from '../../../../assets/services';

const { width: screenWidth } = Dimensions.get('window');

const Bookings = () => {

   const router = useRouter();
   const onGoingBookingDetails = () => {
      router.push('customer/bookings/booking-details');
   };
   const goToChat = () => {
    // router.push('customer/bookings/chat')
    Alert.alert('This will go to the chat page of Mary Gold');
   };
    //  mock bookings data using the services
    const mockBookings = [
        {
            id: "bk-0001",
            serviceId: "svc-001", // Professional House Maid Service
            status: "Confirmed",
            dateTime: "August 15, 2023 - 09:00 AM",
            duration: "3 hours",
            price: 75.00,
            location: "Baguio City - Session Road",
            createdAt: "August 10, 2023"
        },
        // {
        //     id: "bk-0002",
        //     serviceId: "svc-002", // Emergency Plumbing Service
        //     status: "Pending",
        //     dateTime: "August 17, 2023 - 02:00 PM",
        //     duration: "2 hours",
        //     price: 160.00,
        //     location: "Baguio City - Mines View Park",
        //     createdAt: "August 14, 2023"
        // },
        // {
        //     id: "bk-0003",
        //     serviceId: "svc-003", // Appliance Repair Technician
        //     status: "Completed",
        //     dateTime: "August 5, 2023 - 10:00 AM",
        //     duration: "1.5 hours",
        //     price: 90.00,
        //     location: "Baguio City - Burnham Park",
        //     createdAt: "August 1, 2023"
        // }
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case "Pending": return "#FFC107";
            case "Confirmed": return "#28a745";
            case "Completed": return "#17a2b8";
            case "Cancelled": return "#dc3545";
            default: return "#6c757d";
        }
    };

    const getService = (serviceId) => {
        return SERVICES.find(service => service.id === serviceId) || SERVICES[0];
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: "My Bookings" }} />
            
            <Text style={styles.header}>My Bookings</Text>
            
            {mockBookings.map((booking) => {
                const service = getService(booking.serviceId);
                
                return (
                    <View key={booking.id} style={styles.bookingCard}>
                        {/* Status Badge */}
                        <View 
                            style={[
                                styles.statusBadge, 
                                { backgroundColor: getStatusColor(booking.status) }
                            ]}
                        >
                            <Text style={styles.statusText}>{booking.status}</Text>
                        </View>
                        
                        {/* Service Provider Info */}
                        <View style={styles.providerSection}>
                            <Image source={service.heroImage} style={styles.providerImage} />
                            <View style={styles.providerInfo}>
                                <Text style={styles.providerTitle}>{service.title}</Text>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={14} color="#ff9900" />
                                    <Text style={styles.ratingText}>
                                        {service.rating.average.toFixed(1)}
                                    </Text>
                                    <Text style={styles.reviewCount}>
                                        ({service.rating.count} reviews)
                                    </Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* Booking Details */}
                        <View style={styles.detailsSection}>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={16} color="#555" />
                                <Text style={styles.detailText}>{booking.dateTime}</Text>
                            </View>
                            
                            <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={16} color="#555" />
                                <Text style={styles.detailText}>Duration: {booking.duration}</Text>
                            </View>
                            
                            <View style={styles.detailItem}>
                                <Ionicons name="location-outline" size={16} color="#555" />
                                <Text style={styles.detailText}>{booking.location}</Text>
                            </View>
                            
                            <View style={styles.detailItem}>
                                <Ionicons name="cash-outline" size={16} color="#555" />
                                <Text style={styles.detailText}>${booking.price.toFixed(2)}</Text>
                            </View>
                        </View>
                        
                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            {/* <TouchableOpacity style={[styles.actionButton, styles.modifyButton]}>
                                <Text style={styles.buttonText}>Modify</Text>
                            </TouchableOpacity>
                             */}
                            <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress= {goToChat}>
                                <Text style={styles.buttonText}>Contact</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={[styles.actionButton, styles.viewButton]}
                              onPress={onGoingBookingDetails}
                            >
                                <Text style={styles.buttonText}>View Booking</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    statusBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderBottomLeftRadius: 8,
        zIndex: 1,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    providerSection: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    providerImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    providerInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    providerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ff9900',
        marginLeft: 4,
    },
    reviewCount: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
    detailsSection: {
        padding: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#444',
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modifyButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    contactButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    viewButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',

    },
    buttonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#007bff',
    },
});