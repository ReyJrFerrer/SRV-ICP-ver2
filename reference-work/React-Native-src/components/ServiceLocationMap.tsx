import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { SERVICES } from '../../assets/services';
import { useRouter } from 'expo-router';
import { set } from 'react-hook-form';
import SearchBarComponent from './SearchBarComponent';


interface CurrentLocationMapProps{
    onPress: () => void;
    fullScreen?: boolean;
}
                       
const CurrentLocationMap = ({onPress, fullScreen = false} : CurrentLocationMapProps) => {
    const [region, setRegion] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    useEffect(() => {
        ( async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                const location = await Location.getCurrentPositionAsync({});
                const {latitude, longitude} = location.coords;
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: fullScreen ? 0.05 : 0.01,
                    longitudeDelta: fullScreen ? 0.05 : 0.01,
                });
                setLoading(false);
            } catch(error){
                console.error('Error getting location:', error);
                setErrorMsg('Unable to determine your location');
                setLoading(false);
            }
        }) ();
    }, [fullScreen]);


    const handleMapPress = () => {
        if (!fullScreen && onPress) {
            onPress();
        }
    }; 

    // this adjust the styles based on the fullScreen prop
    const containerStyle = fullScreen 
        ? styles.fullScreenContainer
        : styles.container;
    const loadingContainerStyle = fullScreen
        ? styles.fullScreenLoadingContainer
        : styles.loadingContainer;
    const errorContainerStyle = fullScreen
        ? styles.fullScreenErrorContainer
        : styles.errorContainer;

    if (loading) {
        return (
            <TouchableOpacity
                style = {loadingContainerStyle}
                onPress = {handleMapPress}
                activeOpacity={fullScreen ? 1 : 0.7}
                disabled = {fullScreen}
            >
                <ActivityIndicator size="large" color="#1BC464" />
                {!fullScreen && <Text style={styles.tapText}>Tap to expand</Text>}
            </TouchableOpacity>
        )
    }
    if (errorMsg) {
        return (
            <TouchableOpacity
                style = {errorContainerStyle}
                onPress = {handleMapPress}
                activeOpacity={fullScreen ? 1 : 0.7}
                disabled = {fullScreen}
            >
                <FontAwesome5 name="map-marked-alt" size={40} color="#ccc" />
                <Text style={styles.errorText}>{errorMsg}</Text>
                {!fullScreen && <Text style={styles.tapText}>Tap to view full map</Text>}
                
            </TouchableOpacity>
        )
    }

    if (!region) {
        return (
            <TouchableOpacity
                style = {errorContainerStyle}
                onPress = {handleMapPress}
                activeOpacity={fullScreen ? 1 : 0.7}
                disabled = {fullScreen}
            >
                <FontAwesome5 name = "map-marked-alt" size = {40} color = "#ccc"/>
                <Text style = {styles.errorText}> Location data unavailable</Text>
                {!fullScreen && <Text style = {styles.tapText}>Tap to view full map</Text>}
            </TouchableOpacity>
        )
    }
    // For full screen mode, show all services but add distance-based sorting
    // For small map, only show nearby services
    const displayServices = fullScreen 
    ? SERVICES.sort((a, b) => {
        // Sort by distance from user
        const aLat = a.location.coordinates.latitude;
        const aLng = a.location.coordinates.longitude;
        const bLat = b.location.coordinates.latitude;
        const bLng = b.location.coordinates.longitude;
        const userLat = region.latitude;
        const userLng = region.longitude;
        
        const distA = Math.sqrt(
            Math.pow(aLat - userLat, 2) + 
            Math.pow(aLng - userLng, 2)
        );
        
        const distB = Math.sqrt(
            Math.pow(bLat - userLat, 2) + 
            Math.pow(bLng - userLng, 2)
        );
        
        return distA - distB;
        }) 
    : SERVICES.filter(service => {
        const serviceLat = service.location.coordinates.latitude;
        const serviceLng = service.location.coordinates.longitude;
        const userLat = region.latitude;
        const userLng = region.longitude;
        
        const distance = Math.sqrt(
            Math.pow(serviceLat - userLat, 2) + 
            Math.pow(serviceLng - userLng, 2)
        );
        
        return distance < 0.05;
        });

    const MapContainer = fullScreen ? View : TouchableOpacity;
    const mapContainerProps = fullScreen 
    ? {} 
    : { onPress: handleMapPress, activeOpacity: 0.9 };



    return (
        <MapContainer style = {containerStyle} {...mapContainerProps}>
            <MapView
                style = {styles.map}
                region = {region}
                showsUserLocation
                zoomEnabled = {fullScreen}
                rotateEnabled = {fullScreen}
                scrollEnabled = {fullScreen}
                pitchEnabled = {fullScreen}
                showsCompass = {fullScreen}
                showsScale = {fullScreen}
                showsTraffic = {fullScreen}
                mapType = "standard"
            >
                {/* Shows user's current location marker  */}
                <Marker 
                    coordinate = {{
                        latitude: region.latitude,
                        longitude: region.longitude,
                    }}    
                    pinColor='#1BC464'
                    title = "You are here"
                />

                {/* Shows service provider markers */}
                {displayServices.map((service) => (
                    <Marker 
                        key = {service.id}
                        coordinate = {{
                            latitude: service.location.coordinates.latitude,
                            longitude: service.location.coordinates.longitude,
                        }}
                        title = {service.title}
                        description = {service.description}
                        pinColor='#FF9800'
                    >
                        <View style = {styles.markerContainer}>
                            <Text style = {styles.markerText}>{service.name}</Text>
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Search bar overlay
            <View style={[
                styles.searchBarOverlay, 
                { top: fullScreen ? 1 : 10 }
            ]}>
                <SearchBarComponent mapScreen={true} />
            </View> */}
        </MapContainer>
    )
}
                     
export default CurrentLocationMap;
                      
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
      },
      fullScreenContainer: {
        flex: 1,
        position: 'relative',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      loadingContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
      },
      fullScreenLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      },
      errorContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 20,
      },
      fullScreenErrorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
      },
      errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
      },
      markerContainer: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
      },
      markerText: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      overlayContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
      },
      tapHintContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
      },
      tapHint: {
        color: '#fff',
        fontSize: 12,
        marginRight: 5,
      },
      expandIcon: {
        marginLeft: 3,
      },
      tapText: {
        marginTop: 10,
        color: '#1BC464',
        fontSize: 14,
      },
      searchBarOverlay: {
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 100,
        backgroundColor: 'transparent',
      },
})