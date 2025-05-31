import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { SERVICES } from '../../assets/services';
import SearchBarComponent from './SearchBarComponent';
import MapFilters from './MapFilters';
// import zustand here soon to let users book an sp. 
import BottomSheet, {BottomSheetRef} from './BottomSheet';
import ServiceDetailsContent from './SPBottomSheet';

// Category color mapping
const getCategoryColor = (categoryName: string): string => {
    // Predefined colors for common categories
    const colorMap: Record<string, string> = {
        'cleaning': '#2196F3',    // Blue
        'plumbing': '#4CAF50',    // Green
        'electrical': '#FFC107',  // Amber
        'gardening': '#8BC34A',   // Light Green
        'carpentry': '#795548',   // Brown
        'painting': '#FF9800',    // Orange
        'moving': '#9C27B0',      // Purple
        'tutoring': '#00BCD4',    // Cyan
        'beauty': '#E91E63',      // Pink
        'cooking': '#FF5722',     // Deep Orange
        'pet': '#3F51B5',         // Indigo
        'technology': '#607D8B',  // Blue Grey
    };
    
    // Convert category name to lowercase for case-insensitive matching
    const lowerCaseName = categoryName.toLowerCase();
    
    // Check if we have a predefined color for this category
    for (const [key, color] of Object.entries(colorMap)) {
        if (lowerCaseName.includes(key)) {
            return color;
        }
    }
    
    // Default color if no match is found
    return '#FF4D4D';  // Default red
};

interface MapProps{
    
}

const Map = ({} : MapProps) => {
    const [region, setRegion] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<any>(false);
    const bottomSheetRef = useRef<BottomSheetRef>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handleMarkerPress = (service) => {
        setSelectedService(service);
        bottomSheetRef.current?.present();
    };

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategories(prevCategories => {
            // Check if the category is already selected
            if (prevCategories.includes(categoryName)) {
                // If it is, remove it from the array
                return prevCategories.filter(cat => cat !== categoryName);
            } else {
                // If it's not, add it to the array
                return [...prevCategories, categoryName];
            }
        });
    };

    const handleServiceSelect = handleMarkerPress;

    useEffect(() => {
        (
            (async () => {

                try {
                    const {status} = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted'){
                        setErrorMsg('Permission to access location was denied');
                        return;
                    };
                    const location = await Location.getCurrentPositionAsync({});
                    const {latitude, longitude} = location.coords;
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    });
                    setLoading(false);

                } catch(error){
                    console.log('Error getting location', error);
                    setErrorMsg('Unable to determine your location');
                    setLoading(false);
                }
             
            }

        ))();
    }, []);


    // subject to change by the search function, for now. Simple display 
    const displayServices = region ? SERVICES.sort((a,b) => {
       
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
    }) : SERVICES;

    // Filter services based on selected categories
    const filteredServices = React.useMemo(() => {
        if (selectedCategories.length === 0) {
            return displayServices; // Show all services if no categories selected
        }
        
        return displayServices.filter(service => 
            selectedCategories.includes(service.category.name)
        );
    }, [displayServices, selectedCategories]);

    return (
        <View style = {styles.container}>
            {loading ? (  
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Getting your location...</Text>
                </View>
        ) : errorMsg ?  (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        ): (
            <>
                <MapView
                    style = {styles.map}
                    region = {region}
                    showsUserLocation
                    showsMyLocationButton = {false}
                    zoomEnabled = {true}
                    rotateEnabled = {true}
                    scrollEnabled = {true}
                    pitchEnabled = {true}
                    showsCompass = {true}
                    showsScale = {true}
                    mapType = "standard"
                
                >
                    
                    {filteredServices.map((service) => {
                        const categoryColor = getCategoryColor(service.category.name);
                        return (
                            <Marker 
                                key = {service.id}
                                coordinate = {{
                                    latitude: service.location.coordinates.latitude,
                                    longitude: service.location.coordinates.longitude,
                                }}
                                onPress = {() => handleMarkerPress(service)}
                            >
                                
                                    <View style={styles.customMarker}>
                                        <View style={[styles.markerContent, { backgroundColor: categoryColor }]}>
                                            <Text style={styles.availabilityIndicator}>
                                                {service.availability.isAvailableNow ? '✅' : '⛔️'}
                                            </Text>
                                            
                                            <View style={styles.markerIconContainer}>
                                                <FontAwesome5 
                                                    name={service.category.icon} 
                                                    size={14} 
                                                    color="#FFFFFF" 
                                                />
                                            </View>
                                            {/* <Text style={styles.providerName} numberOfLines={1} ellipsizeMode="tail">
                                                {service.name}
                                            </Text> */}
                                        </View>
                                        <View style={[styles.markerTriangle, { borderTopColor: categoryColor }]} />
                                    </View>
                     
                              
                            </Marker>
                        );
                    })}
                </MapView> 
                <BottomSheet 
                    ref={bottomSheetRef}
                    isFullHeight = {true}
                    title={selectedService?.title || "Service Details"}
                    snapToPoints = {true}
                    children = {     
                            selectedService && <ServiceDetailsContent 
                                                    service={selectedService} 
                                                    onDismiss={() => bottomSheetRef.current?.dismiss()}/>
                      
                                                    
                    }
                   
                    
                />         


                <View style={[
                    styles.searchBarOverlay, 
                    { top: 1 }
                ]}>
                    <SearchBarComponent mapScreen={true} onServiceSelect={handleServiceSelect} categoryFilter={selectedCategories.length > 0 ? selectedCategories[0] : null} />
                    <MapFilters onCategorySelect={handleCategorySelect} selectedCategories={selectedCategories}/>
                </View>
            


                
            </>
        )}

        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
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
    searchBarOverlay: {
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 100,
        backgroundColor: 'transparent',
    },
    mapFilterOverlay: {
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 100,
        backgroundColor: 'transparent',
    }, 
    
    customMarker: {
        alignItems: 'center',
       
    },
    markerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3, 
        position: 'relative', 
        minWidth: 'auto', 
        overflow: 'visible',
    },
    markerIconContainer: {
        padding: 2,
        // marginRight: 6,
    },
    providerName: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
        maxWidth: 120,
    },
    markerTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopWidth: 8,
        marginTop: -1,
    },

    availabilityIndicator: {
        position: 'absolute',
        top: -1,
        right: -2,
        fontSize: 10,
        zIndex: 10,
    },
})

export default Map