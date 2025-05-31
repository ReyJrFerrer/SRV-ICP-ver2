import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import {FontAwesome5} from '@expo/vector-icons';



interface CurrentLocationComponentProps{
    onPress?: () => void;
    showMapMarker?: boolean;
}

const CurrentLocationComponent= ({onPress, showMapMarker = true} : CurrentLocationComponentProps) => {
    const handleAddressIconPress = () => {
        if(onPress){
            onPress();
        };
    }
 
    const [locationText, setLocationText] = useState<String | null>('Fetching location...');
    const [errorMsg, setErrorMsg] = useState<String | null>(null);

    useEffect(
        () => {
            (async () => {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                try {
                    const location = await Location.getCurrentPositionAsync({});
                    const {latitude, longitude} = location.coords;

                    // const response = await fetch(
                    //      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    // );
                    // const data = await response.json();
                    // console.log(data);

                    // Attempt 1 to fix the bug 
                    // assumption of the issue: On android devices, there might be an issue with a header requirement not being met
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                        {
                            headers: {
                                'User-Agent': 'ServicePalsDemoApp/1.0',
                                'Accept': 'application/json'
                            }
                        }
                    );
                    // Check if response is ok before parsing
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error response from API:', response.status, errorText);
                        throw new Error(`API returned status ${response.status}`);
                    }
                    console.log('Response content-type:', response.headers.get('content-type'));
    
                    // Try to parse as JSON
                    const responseText = await response.text();
                    console.log('Response text preview:', responseText.substring(0, 100));
                    
                    const data = JSON.parse(responseText);

                    if (data && data.address) {
                        const street = data.address.road || data.address.street || data.address.quarter ||'';
                        const city = data.address.city || data.address.town || data.address.village || '';
                        const province = data.address.state || data.address.province || data.address.region ||'';
                        
                        const formattedAddress = [street, city, province]
                            .filter(part => part)  // Remove empty parts
                            .join(', ');
                            
                        setLocationText(formattedAddress || 'Address found but incomplete details');
                    } else{
                        setLocationText('Location found, but address unavailable');
                    }
                } catch (error) {
                    console.error('Error getting location:', error);
                    setErrorMsg('Unable to determine your location');
                }
            }) ();
        }, []
    );

    return (
        <View style = {styles.container}>
            
            {   errorMsg ? 
              ( <View style = {styles.errorContainer}>
                     <FontAwesome5 name="exclamation-circle" size={20} color="#e74c3c" />
                     <Text style={styles.errorText}>{errorMsg}</Text>
                </View>) : (
                    <View style={styles.locationContainer}>
                        {showMapMarker && (
                            <TouchableOpacity style={styles.markerIcon} onPress={handleAddressIconPress}>
                                <FontAwesome5 name="map-marker-alt" size={25} color="#4F959D" /> 
                            </TouchableOpacity>
                        )}
                        <Text style={styles.locationText}>
                            {locationText}
                        </Text>
                    </View>
                )
            }
            
        </View>
    )
}
                     
export default CurrentLocationComponent;
                      
const styles = StyleSheet.create({
    container: {
        padding: 5,
        width: '80%',
    }, 
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    markerIcon: {
        marginRight: 8,
    },
    locationText: {
        fontSize: 14, 
        color: '#555',
        flex: 1,
    }, 
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14, 
        color: '#e74c3c',
        marginLeft: 5,
    }
})
