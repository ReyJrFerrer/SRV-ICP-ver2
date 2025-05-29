import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { PROVIDER_BOOKING_REQUESTS } from '../../../../assets/providerOrders';
import { ProviderOrder } from '../../../../assets/types/provider/provider-order';

const { width: screenWidth } = Dimensions.get('window');

const BookingRequests = () => {
    const router = useRouter();
    const [serviceVisible, setServiceVisible] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showCalendar, setShowCalendar] = useState(false);
    
    // Format date and time for display
    const formatDateTime = (date: Date) => {
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    // Format duration in hours
    const formatDuration = (start: Date, end: Date) => {
        const durationMs = end.getTime() - start.getTime();
        const durationHours = Math.round(durationMs / (1000 * 60 * 60));
        return `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`;
    };
    
    // Navigate to job details
    const goToJobDetails = (jobId: string) => {
        Alert.alert('Navigate to job details')
        // router.push(`/service-provider/bookings/request-details?id=${jobId}`);
    };
    
    // Navigate to chat with client
    const goToChat = (clientId: string) => {
        Alert.alert('Navigate to chats')
        // router.push(`/service-provider/chat/${clientId}`);
    };
    
    // Accept booking request
    const acceptRequest = (jobId: string) => {
        // In a real app, this would call an API to update the status
        console.log(`Accepting request: ${jobId}`);
        // Show success message or navigate
    };
    
    // Reject booking request
    const rejectRequest = (jobId: string) => {
        // In a real app, this would call an API to update the status
        console.log(`Rejecting request: ${jobId}`);
        // Show success message or navigate
    };
    
    // Toggle service visibility
    const toggleServiceVisibility = () => {
        setServiceVisible(!serviceVisible);
    };
    
    // Filter requests (all, today, this week)
    const filterRequests = (filter: string) => {
        setSelectedFilter(filter);
    };
    
    // Toggle calendar view
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };
    
    // Filter requests based on selected filter
    const getFilteredRequests = () => {
        if (selectedFilter === 'all') {
            return PROVIDER_BOOKING_REQUESTS;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        if (selectedFilter === 'today') {
            return PROVIDER_BOOKING_REQUESTS.filter(request => {
                const requestDate = new Date(request.scheduledStartTime);
                requestDate.setHours(0, 0, 0, 0);
                return requestDate.getTime() === today.getTime();
            });
        } else if (selectedFilter === 'thisWeek') {
            return PROVIDER_BOOKING_REQUESTS.filter(request => {
                const requestDate = new Date(request.scheduledStartTime);
                return requestDate >= today && requestDate < nextWeek;
            });
        }
        
        return PROVIDER_BOOKING_REQUESTS;
    };
    
    // Render a single request card
    const renderRequestCard = (request: ProviderOrder) => {
        return (
            <View key={request.id} style={styles.requestCard}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: '#FFC107' }]}>
                    <Text style={styles.statusText}>Pending</Text>
                </View>
                
                {/* Client Info */}
                <View style={styles.clientSection}>
                    <View style={styles.clientCircle}>
                        <Text style={styles.clientInitial}>{request.clientName.charAt(0)}</Text>
                    </View>
                    <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{request.clientName}</Text>
                        <Text style={styles.serviceTitle}>{request.serviceTitle}</Text>
                    </View>
                </View>
                
                {/* Request Details */}
                <View style={styles.detailsSection}>
                    {/* Date & Time */}
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            {formatDateTime(request.scheduledStartTime)}
                        </Text>
                    </View>
                    
                    {/* Duration */}
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            Duration: {formatDuration(request.scheduledStartTime, request.scheduledEndTime)}
                        </Text>
                    </View>
                    
                    {/* Location */}
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>{request.location.address}</Text>
                    </View>
                    
                    {/* Price */}
                    <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>₱{request.quotedPrice.toFixed(2)}</Text>
                    </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => goToJobDetails(request.id)}
                    >
                        <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.contactButton]}
                        onPress={() => goToChat(request.clientId)}
                    >
                        <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => rejectRequest(request.id)}
                    >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => acceptRequest(request.id)}
                    >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    // Get filtered requests
    const filteredRequests = getFilteredRequests();
    
    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: "Booking Requests" }} />
            
            {/* Visibility Toggle */}
            <View style={styles.visibilityContainer}>
                <Text style={styles.visibilityTitle}>Service Visibility</Text>
                <View style={styles.visibilityToggle}>
                    <Text style={styles.visibilityLabel}>
                        {serviceVisible ? "Your service is visible to clients" : "Your service is hidden from clients"}
                    </Text>
                    <Switch
                        value={serviceVisible}
                        onValueChange={toggleServiceVisibility}
                        trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                        thumbColor={serviceVisible ? "#fff" : "#f4f3f4"}
                    />
                </View>
            </View>
            
            {/* Filter & Calendar Section */}
            <View style={styles.filterContainer}>
                <View style={styles.filterButtons}>
                    <TouchableOpacity 
                        style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]} 
                        onPress={() => filterRequests('all')}
                    >
                        <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>All</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, selectedFilter === 'today' && styles.filterButtonActive]} 
                        onPress={() => filterRequests('today')}
                    >
                        <Text style={[styles.filterButtonText, selectedFilter === 'today' && styles.filterButtonTextActive]}>Today</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, selectedFilter === 'thisWeek' && styles.filterButtonActive]} 
                        onPress={() => filterRequests('thisWeek')}
                    >
                        <Text style={[styles.filterButtonText, selectedFilter === 'thisWeek' && styles.filterButtonTextActive]}>This Week</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.calendarButton} 
                        onPress={toggleCalendar}
                    >
                        <Ionicons name="calendar" size={20} color="#007BFF" />
                    </TouchableOpacity>
                </View>
                
                {/* Calendar View (simplified mockup) */}
                {showCalendar && (
                    <View style={styles.calendarView}>
                        <Text style={styles.calendarHeader}>Availability Calendar</Text>
                        <Text style={styles.calendarSubtext}>Here you can manage your available time slots</Text>
                        {/* In a real app, integrate a proper calendar component */}
                    </View>
                )}
            </View>
            
            {/* Request List */}
            <View style={styles.requestsContainer}>
                <Text style={styles.sectionTitle}>
                    Booking Requests ({filteredRequests.length})
                </Text>
                
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(request => renderRequestCard(request))
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="calendar-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No booking requests available</Text>
                        <Text style={styles.emptyStateSubtext}>
                            New booking requests will appear here
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default BookingRequests;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    visibilityContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    visibilityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    visibilityToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    visibilityLabel: {
        fontSize: 14,
        color: '#555',
    },
    filterContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f1f1f1',
    },
    filterButtonActive: {
        backgroundColor: '#007BFF',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#555',
    },
    filterButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calendarButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f1f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarView: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    calendarHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    calendarSubtext: {
        fontSize: 14,
        color: '#666',
    },
    requestsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    requestCard: {
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
    clientSection: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    clientCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clientInitial: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#495057',
    },
    clientInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    clientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    serviceTitle: {
        fontSize: 14,
        color: '#666',
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
    viewButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    contactButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    rejectButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    acceptButton: {
        backgroundColor: '#28a745',
    },
    viewButtonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#007bff',
    },
    contactButtonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#007bff',
    },
    rejectButtonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#dc3545',
    },
    acceptButtonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#fff',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
});