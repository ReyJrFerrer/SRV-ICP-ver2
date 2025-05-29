import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { PROVIDER_ORDERS } from '../../../../assets/providerOrders';
import { ProviderOrder } from '../../../../assets/types/provider/provider-order';

const { width: screenWidth } = Dimensions.get('window');

const UpcomingJobs = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    // Get upcoming (confirmed) jobs from provider orders
    const upcomingJobs = useMemo(() => {
        return PROVIDER_ORDERS.filter(order => order.status === 'CONFIRMED');
    }, []);
    
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
        Alert.alert('Navigate to the job details screen')
        // router.push(`/service-provider/bookings/job-details?id=${jobId}`);
    };
    
    // Navigate to chat with client
    const goToChat = (clientId: string) => {
        Alert.alert('Navigate to client chats')
        // router.push(`/service-provider/chat/${clientId}`);
    };
    
    // Cancel booking
    const cancelBooking = (jobId: string) => {
        // In a real app, this would call an API to update the status
        console.log(`Cancelling booking: ${jobId}`);
        Alert.alert('Show confirmation dialog')
        // Show confirmation dialog, then perform cancellation
    };
    
    // Create the marked dates object for the calendar
    const markedDates = useMemo(() => {
        const dates: { [date: string]: any } = {};
        
        // Mark the selected date
        dates[selectedDate] = { selected: true, selectedColor: '#007BFF' };
        
        // Mark dates with upcoming jobs
        upcomingJobs.forEach(job => {
            const jobDate = job.scheduledStartTime.toISOString().split('T')[0];
            
            if (dates[jobDate]) {
                // If date already exists (e.g., selected date), merge properties
                dates[jobDate] = {
                    ...dates[jobDate],
                    marked: true,
                    dotColor: '#28a745'
                };
                
                // If it's both selected and has jobs
                if (jobDate === selectedDate) {
                    dates[jobDate].selected = true;
                }
            } else {
                // New date entry for job
                dates[jobDate] = {
                    marked: true,
                    dotColor: '#28a745'
                };
            }
        });
        
        return dates;
    }, [upcomingJobs, selectedDate]);
    
    // Handle date selection on calendar
    const handleDateSelect = (day: DateData) => {
        setSelectedDate(day.dateString);
    };
    
    // Filter jobs for the selected date
    const jobsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        
        return upcomingJobs.filter(job => {
            const jobDate = job.scheduledStartTime.toISOString().split('T')[0];
            return jobDate === selectedDate;
        });
    }, [upcomingJobs, selectedDate]);
    
    // Render a job card
    const renderJobCard = (job: ProviderOrder) => {
        return (
            <View key={job.id} style={styles.jobCard}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: '#28a745' }]}>
                    <Text style={styles.statusText}>Confirmed</Text>
                </View>
                
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
                    {/* Date & Time */}
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            {formatDateTime(job.scheduledStartTime)}
                        </Text>
                    </View>
                    
                    {/* Duration */}
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                            Duration: {formatDuration(job.scheduledStartTime, job.scheduledEndTime)}
                        </Text>
                    </View>
                    
                    {/* Location */}
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>{job.location.address}</Text>
                    </View>
                    
                    {/* Price */}
                    <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>₱{job.quotedPrice.toFixed(2)}</Text>
                    </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => goToJobDetails(job.id)}
                    >
                        <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.contactButton]}
                        onPress={() => goToChat(job.clientId)}
                    >
                        <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => cancelBooking(job.id)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    // Find the next upcoming job
    const getNextUpcomingJob = (): ProviderOrder | null => {
        if (upcomingJobs.length === 0) return null;
        
        const now = new Date();
        
        // Sort jobs by scheduled start time
        const sortedJobs = [...upcomingJobs].sort(
            (a, b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime()
        );
        
        // Find the next job that hasn't started yet
        return sortedJobs.find(job => job.scheduledStartTime > now) || sortedJobs[0];
    };
    
    // Get the next upcoming job
    const nextJob = getNextUpcomingJob();
    
    // Format date for display in the header
    const formatDateHeader = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: "Upcoming Jobs" }} />
            
            {/* Next Job Summary */}
            {nextJob && (
                <View style={styles.nextJobContainer}>
                    <Text style={styles.nextJobTitle}>Your Next Job</Text>
                    <View style={styles.nextJobCard}>
                        <View style={styles.nextJobDetails}>
                            <Text style={styles.nextJobClientName}>{nextJob.clientName}</Text>
                            <Text style={styles.nextJobService}>{nextJob.serviceTitle}</Text>
                            <View style={styles.nextJobSchedule}>
                                <Ionicons name="calendar" size={16} color="#4CAF50" />
                                <Text style={styles.nextJobScheduleText}>
                                    {formatDateTime(nextJob.scheduledStartTime)}
                                </Text>
                            </View>
                            <View style={styles.nextJobLocation}>
                                <Ionicons name="location" size={16} color="#FF9800" />
                                <Text style={styles.nextJobLocationText}>
                                    {nextJob.location.address}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.nextJobButton}
                            onPress={() => goToJobDetails(nextJob.id)}
                        >
                            <Text style={styles.nextJobButtonText}>View</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            
            {/* Calendar Section */}
            <View style={styles.calendarContainer}>
                <Text style={styles.sectionTitle}>Job Schedule</Text>
                <Calendar
                    current={selectedDate}
                    onDayPress={handleDateSelect}
                    markedDates={markedDates}
                    theme={{
                        selectedDayBackgroundColor: '#007BFF',
                        todayTextColor: '#007BFF',
                        arrowColor: '#007BFF',
                        dotColor: '#28a745',
                        selectedDotColor: '#fff'
                    }}
                />
            </View>
            
            {/* Jobs for Selected Date */}
            <View style={styles.jobsContainer}>
                <Text style={styles.dateHeader}>
                    {selectedDate === new Date().toISOString().split('T')[0] 
                        ? 'Today\'s Jobs' 
                        : `Jobs for ${formatDateHeader(new Date(selectedDate))}`
                    }
                </Text>
                
                {jobsForSelectedDate.length > 0 ? (
                    jobsForSelectedDate.map(job => renderJobCard(job))
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="calendar-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyStateText}>No jobs scheduled for this date</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Select a date with a green dot to view scheduled jobs
                        </Text>
                    </View>
                )}
            </View>
            
            {/* All Upcoming Jobs Section */}
            {upcomingJobs.length > 0 && jobsForSelectedDate.length === 0 && (
                <View style={styles.allUpcomingContainer}>
                    <Text style={styles.sectionTitle}>All Upcoming Jobs</Text>
                    {upcomingJobs.map(job => renderJobCard(job))}
                </View>
            )}
        </ScrollView>
    );
};

export default UpcomingJobs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    nextJobContainer: {
        marginBottom: 20,
    },
    nextJobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    nextJobCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nextJobDetails: {
        flex: 1,
    },
    nextJobClientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    nextJobService: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    nextJobSchedule: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    nextJobScheduleText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
    },
    nextJobLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextJobLocationText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
    },
    nextJobButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    nextJobButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    jobsContainer: {
        marginBottom: 20,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
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
    cancelButton: {
        backgroundColor: '#f8f9fa',
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
    cancelButtonText: {
        fontWeight: '600',
        fontSize: 13,
        color: '#dc3545',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 10,
    },
    emptyStateText: {
        fontSize: 16,
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
    allUpcomingContainer: {
        marginBottom: 24,
    },
});