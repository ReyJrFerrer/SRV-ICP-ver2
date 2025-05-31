import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

import { PROVIDER_ORDERS, PROVIDER_BOOKING_REQUESTS } from '../../../../assets/providerOrders';

const { width: screenWidth } = Dimensions.get('window');

const BookingNotifications = () => {
    const router = useRouter();

    // Filter orders based on status
    const activeJobs = PROVIDER_ORDERS.filter(order => order.status === 'IN_PROGRESS');
    const upcomingJobs = PROVIDER_ORDERS.filter(order => order.status === 'CONFIRMED');
    // Use the booking requests from the imported array
    const jobRequests = PROVIDER_BOOKING_REQUESTS;

    const goToJobDetails = (jobId: string) => {
        // Navigate to job details page
        Alert.alert('Goes to the job details page')
        // router.push(`/service-provider/jobs/${jobId}`);
    };

    const goToChat = (clientId: string) => {
        // Navigate to chat with client
        Alert.alert('Navigates to client chats')
        router.push(`/service-provider/chat/${clientId}`);
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case "CONFIRMED": return "#28a745"; // Green
            case "IN_PROGRESS": return "#007bff"; // Blue
            case "COMPLETED": return "#17a2b8"; // Teal
            case "CANCELLED": return "#dc3545"; // Red
            default: return "#6c757d"; // Gray
        }
    };

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    const renderJobCard = (job: any, type: string) => {
        return (
            <View key={job.id} style={styles.jobCard}>
                {/* Status Badge */}
                {type !== 'request' && (
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                        <Text style={styles.statusText}>
                            {job.status === 'CONFIRMED' ? 'Confirmed' : 
                             job.status === 'IN_PROGRESS' ? 'In Progress' : job.status}
                        </Text>
                    </View>
                )}
                
                {/* Client Info */}
                <View style={styles.clientSection}>
                    <View style={styles.clientCircle}>
                        <Text style={styles.clientInitial}>{job.clientName.charAt(0)}</Text>
                    </View>
                    <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{job.clientName}</Text>
                        <Text style={styles.serviceTitle}>{job.serviceTitle}</Text>
                    </View>
                </View>
                
                {/* Job Details */}
                <View style={styles.detailsSection}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            {formatDateTime(job.scheduledStartTime)}
                        </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            Duration: {
                                Math.round(
                                    (job.scheduledEndTime - job.scheduledStartTime) / (1000 * 60 * 60)
                                )
                            } hours
                        </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>{job.location.address}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>${job.quotedPrice.toFixed(2)}</Text>
                    </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    {type === 'request' ? (
                        <>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.viewButton]}
                                // onPress={() => goToJobDetails(job.id)}
                                onPress={() => Alert.alert('Navigates to the details page')}
                            >
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                                <Text style={[styles.buttonText, { color: '#dc3545' }]}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Accept</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.contactButton]} 
                                onPress={() => goToChat(job.clientId)}
                            >
                                <Text style={styles.buttonText}>Contact</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.viewButton]}
                                onPress={() => goToJobDetails(job.id)}
                            >
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: "Bookings & Notifications" }} />
            
            {/* Active Jobs Section - Displayed Prominently */}
            {activeJobs.length > 0 && (
                <View style={styles.activeJobsContainer}>
                    <Text style={styles.activeJobsHeader}>Active Bookings</Text>
                    {activeJobs.map(job => renderJobCard(job, 'active'))}
                </View>
            )}

            {/* Job Requests Section */}
            {jobRequests.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>New Booking Requests</Text>
                    {jobRequests.map(job => renderJobCard(job, 'request'))}
                </>
            )}

            {/* Upcoming Jobs Section */}
            {upcomingJobs.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>Upcoming Bookings</Text>
                    {upcomingJobs.map(job => renderJobCard(job, 'upcoming'))}
                </>
            )}

            {/* No Jobs Message */}
            {activeJobs.length === 0 && upcomingJobs.length === 0 && jobRequests.length === 0 && (
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="calendar-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyStateText}>No jobs available at the moment</Text>
                    <Text style={styles.emptyStateSubtext}>
                        New job notifications will appear here
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default BookingNotifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 12,
        color: '#333',
    },
    activeJobsContainer: {
        marginBottom: 24,
    },
    activeJobsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#007bff',
    },
    jobCard: {
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
    contactButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    viewButton: {
        backgroundColor: '#f8f9fa',
    },
    rejectButton: {
        backgroundColor: '#f8f9fa',
        borderRightWidth: 1,
        borderRightColor: '#eee',
    },
    acceptButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#007bff',
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
        color: '#888',
        marginTop: 8,
        textAlign: 'center',
    }
});