import {StyleSheet, Text, View, Image, Pressable, TouchableOpacity, FlatList, Dimensions, Platform, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { CATEGORIES } from '../../assets/categories';
import CurrentLocationComponent from './UserLocationComponent'
import { useRouter } from 'expo-router';
import SearchBarComponent from './SearchBarComponent';
import BottomSheet, { BottomSheetRef } from './BottomSheet';
import CurrentLocationMap from './ServiceLocationMap';
import { useCallback } from 'react';
//replaced FlatList with FlashList
import { FlashList } from '@shopify/flash-list';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Responsive sizing check
const isSmallDevice = wp('100%') < 375;
const isLargeDevice = wp('100%') >= 768;

export const ListHeader = () => {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheetRef>(null);

const handleSearchBarPress = () => {
      router.push('/customer/service-maps');
    }

    const handleLocationMarkerPress = () => { 
        // bottomSheetRef.current?.present();
        router.push('/customer/address');
        // Alert.alert('This will open the address modal');
    };
    const handleAddressMapPress = () => {
      router.push('/customer/service-maps');
    }

    const handleViewAllPress = () => {
      router.navigate('/customer/service/view-all')
    };

    const handleMoreCategoriesPress = () => {
      router.navigate('/customer/categories/all-service-types')
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
                        <Link style={styles.cartContainer} href="./bookings" asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <View>
                                        <FontAwesome5
                                            name="calendar-check"
                                            size={wp('6.5%')}
                                            color="gray"
                                            style={{marginRight: wp('4%'), opacity: pressed ? 0.5 : 1}}/>
                                        <View style={styles.badgeContainer}>
                                            <Text style={styles.badgeText}>
                                                {/* {getBookingCount()} */}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </Pressable>
                        </Link>
                        {/* <TouchableOpacity style={styles.signOutButton}>
                            <FontAwesome5 name="sign-out-alt" size={25} color="red"/>
                        </TouchableOpacity> */}
                    </View>
                </View>
                {/* <View style = {styles.locationContainer}>
                  <Text style = {styles.locationTitle}> My Location</Text>
                  <CurrentLocationComponent/>
                </View>
               */}

                <View style={styles.searchBarContainer}>
                    {/* <CurrentLocationMap onPress={handleMapPress}/> */}
                    {/* <Text>Insert search bar Here</Text> */}
                    <SearchBarComponent onPress = {handleSearchBarPress}/>
                </View>
                  
                <View style={styles.categoriesContainer}>

                    {/* <Text style={styles.sectionTitle}>Service Categories</Text> */}
                    <View style = {styles.categoriesRow}>
                    <FlashList
                        data={CATEGORIES.slice(0,3)}
                        renderItem={({item}) => (
                            <Link asChild href={`/customer/categories/${item.slug}`}>
                                <Pressable style={styles.category}>
                                    <View style={styles.categoryIconContainer}>
                                        <FontAwesome5 
                                            name={item.icon} 
                                            size={wp('8%')} 
                                            color="#4F959D"/>
                                    </View>
                                    <Text style={styles.categoryText}>{item.name}</Text>
                                </Pressable>
                            </Link>
                        )}
                        keyExtractor={item => item.name}
                        horizontal
                        scrollEnabled = {false}
                        showsHorizontalScrollIndicator={false}
                        estimatedItemSize={4}
                    />
                    <Pressable style={styles.moreButton} onPress={handleMoreCategoriesPress}>
                      <View style={styles.categoryIconContainer}>
                          <FontAwesome5 
                              name="ellipsis-h" 
                              size={wp('8%')} 
                              color="#4F959D"/>
                      </View>
                      <Text style={styles.categoryText}>More</Text>
                    </Pressable>

                      
                    </View>
                
        
                </View>
                <View style = {styles.rowComponent}>
                      <Text style={styles.sectionTitle}>Top Picks!</Text>
                  
                        <TouchableOpacity onPress = {handleViewAllPress}>
                        <Text style = {styles.viewAllStyle}>View All</Text>
                        </TouchableOpacity>
                
                    
                    </View>
          
            </View>
            
            {/* Bottom sheet*/}
            <BottomSheet title = 'Where do you like to meet your service provider?'  ref={bottomSheetRef} children = {
              <View>
              <View style = {styles.addressMapsContainer}>
                
                <CurrentLocationMap onPress={handleAddressMapPress}/>
                <CurrentLocationComponent showMapMarker = {false} />
    
              </View>


              <View>
                <Text>Use my current location</Text>
                <Text>Add a new address</Text>

              </View>
     
              </View>

            
              }/>
            
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        gap: hp('2.5%'),
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
    avatarImage: {
        width: wp('10.7%'),
        height: wp('10.7%'),
        borderRadius: wp('5.3%'),
        marginRight: wp('2.7%'),
    },
    avatarText: {
        fontSize: wp('4.3%'),
    },
    addressMapsContainer: {
        width: '100%',
        height: '70%',
        paddingBottom: hp('3.7%'),
    },
    cartContainer: {
        padding: wp('2.7%'),
    },
    signOutButton: {
        padding: wp('2.7%'),
    },
    heroContainer: {
        width: '100%',
        height: hp('24.7%'),
        borderRadius: wp('5.3%'),
        overflow: 'hidden',
    },
    searchBarContainer: {
        width: '100%', 
        height: hp('7.4%'), 
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: wp('5.3%'),
    },
    locationContainer: {
        paddingHorizontal: wp('1.3%'),
    },
    locationTitle: {
        fontSize: wp('4.8%'), 
        fontWeight: 'bold',
        marginBottom: hp('0.6%'),
    },
    categoriesContainer: {
        // Platform-specific styling
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            }
        }),
    },
    categoriesParent: {
        padding: wp('2.7%')
    },
    sectionTitle: {
        fontSize: wp('6.4%'),
        fontWeight: 'bold',
    },
    viewAllStyle: {
        fontSize: wp('4.8%'),
    },
    category: {
        width: isSmallDevice ? wp('24%') : wp('24%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    categoryImage: {
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8%'),
        marginBottom: hp('1%'),
    },
    categoryText: {
        fontSize: wp('3.7%'),
    },
    badgeContainer: {
        position: 'absolute',
        top: -hp('0.6%'),
        right: wp('2.7%'),
        backgroundColor: '#1BC464',
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
    categoryIconContainer: {
        width: wp('16%'),
        height: wp('16%'),
        backgroundColor: '#E8F5E9',
        borderRadius: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    rowComponent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    categoriesRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
    },
    moreButton: {
        width: isSmallDevice ? wp('24%') : wp('26.7%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
        marginLeft: isSmallDevice ? wp('-1.3%') : wp('-2.7%')
    },
})