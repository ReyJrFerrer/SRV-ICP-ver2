import {StyleSheet, Text, View, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import CurrentLocationComponent from './UserLocationComponent';
import BottomSheet, { BottomSheetRef } from './BottomSheet';
import CurrentLocationMap from './ServiceLocationMap';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Responsive sizing check
const isSmallDevice = wp('100%') < 375;

export const SPHeader = ({ providerName }: { providerName: string }) => {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    const handleLocationMarkerPress = () => { 
        Alert.alert('This opens the address modal screen');
        // bottomSheetRef.current?.present();
    };

    const handleAddressMapPress = () => {
        router.push('/service-provider/service-maps');
    }

    const handleActiveJobsPress = () => {
      router.push('/service-provider/active-jobs');
    }
    
    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarContainer}>
                            <CurrentLocationComponent onPress={handleLocationMarkerPress}/>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Link style={styles.jobsContainer} href="/service-provider/bookings/booking-notifications" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <View>
                                        <FontAwesome5
                                            name="briefcase"
                                            size={wp('6.5%')}
                                            color="gray"
                                            style={{marginRight: wp('4%'), opacity: pressed ? 0.5 : 1}}/>
                                        <View style={styles.badgeContainer}>
                                            <Text style={styles.badgeText}>
                                                3
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </Pressable>
                        </Link>
                    </View>
                </View>

                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome, {providerName}!</Text>
                    <Text style={styles.subText}>Manage your services and bookings</Text>
                </View>
            </View>
            
            {/* Bottom sheet*/}
            <BottomSheet title='Where are you providing services today?' ref={bottomSheetRef} children = {
              <View>
                <View style = {styles.addressMapsContainer}>
                  <CurrentLocationMap onPress={handleAddressMapPress}/>
                  <CurrentLocationComponent showMapMarker = {false} />
                </View>

                <View>
                  <Text style={styles.locationText}>Use my current location</Text>
                  <Text style={styles.locationText}>Add a service location</Text>
                </View>
              </View>
            }/>
        </>
    );
}

export default SPHeader;

const styles = StyleSheet.create({
    headerContainer: {
        gap: hp('1.5%'),
        marginBottom: hp('2%'),
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
    },
    welcomeContainer: {
        marginTop: hp('0.5%'),
    },
    welcomeText: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: wp('3.8%'),
        color: '#666',
        marginTop: hp('0.5%'),
    },
    addressMapsContainer: {
        width: '100%',
        height: '70%',
        paddingBottom: hp('3.7%'),
    },
    jobsContainer: {
        padding: wp('2.7%'),
    },
    badgeContainer: {
        position: 'absolute',
        top: -hp('0.6%'),
        right: wp('2.7%'),
        backgroundColor: '#4F959D',
        borderRadius: wp('2.7%'),
        width: wp('5.3%'),
        height: wp('5.3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: wp('3.2%'),
        fontWeight: 'bold',
    },
    locationText: {
        fontSize: wp('4%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        marginBottom: hp('0.5%'),
    },
})