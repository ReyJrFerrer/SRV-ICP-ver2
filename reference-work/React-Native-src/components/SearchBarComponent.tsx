import {View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, Keyboard} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { SERVICES } from '../../assets/services';
import { Service } from '../../assets/types/service/service';
import {useState, useEffect, useRef} from 'react';
import SearchList from './SearchList';
import SearchResults from './SearchResults';
import BottomSheet, {BottomSheetRef} from './BottomSheet';



interface SearchBarComponentProps {
    onPress?: () => void; // onPress of the search bar should transfer the user to the map UI 
    mapScreen?: boolean; // checks first if the user is in the home page
    placeholder?: string; // placeholder message
    services?: Service[];
    onServiceSelect?: (service: Service) => void;
    categoryFilter?: string | null;
  
}

const  SearchBarComponent = ({onPress, mapScreen = false, placeholder = 'Search for service', services = SERVICES, onServiceSelect, categoryFilter} : SearchBarComponentProps) => {
    const [searchText, setSearchText] = useState<string>('');
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const bottomSheetRef = useRef<BottomSheetRef>(null);
  
  
    const handleSearchBarPress = () => {
        if(!mapScreen && onPress){
            onPress();
        };
    };
    // API data for the search bar kunwari 



    const onSearch = (text:string) => {
        setSearchText(text);
        setTyping(true);

        if (text.trim()){
            const filtered = services.filter(service => 
                    service.name.toLowerCase().includes(text.toLowerCase()) ||
                    service.title?.toLowerCase().includes(text.toLowerCase()) ||
                    service.category.name?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredServices(filtered);
            setShowResults(filtered.length > 0);
        } else {
            setFilteredServices([]);
            setShowResults(false);
        }

        // if (typingTimeoutRef.current) {
        //     clearTimeout(typingTimeoutRef.current);
        // }

        // typingTimeoutRef.current = setTimeout(() => {
        //     setTyping(false);

        // }, 1000)
    };


    const handleSubmit = () => {
        Keyboard.dismiss();
        setShowResults(false);
        if (searchText.trim() && filteredServices.length > 0) {
            bottomSheetRef.current?.present(); 
        };
    };

    const handleServiceSelect = (service: Service) => {
        if (onServiceSelect) {
            onServiceSelect(service);
            setSearchText('');
            setShowResults(false);
            Keyboard.dismiss();
            bottomSheetRef.current?.dismiss();
        }
    };

    useEffect(() => {
        if (categoryFilter && mapScreen) {
            setSearchText(categoryFilter);

            const filtered = services.filter(service => 
                service.category.name.toLowerCase() === categoryFilter.toLowerCase()
            );

            setFilteredServices(filtered)
            setShowResults(false);

            if (filtered.length > 0){
                bottomSheetRef.current?.present()
            }
        }
    }, [categoryFilter, services, mapScreen])

    
    return (

        <>
        
       
        <TouchableOpacity 
            style={styles.searchBarContainer} 
            activeOpacity={0.10}
            onPress={handleSearchBarPress}
            disabled={mapScreen}
        >
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    editable={mapScreen}
                    value = {searchText}
                    onChangeText={mapScreen ? onSearch : undefined} 
                    onSubmitEditing={mapScreen ? handleSubmit: undefined}
                    returnKeyType='search'
                      
                />
                {searchText.length > 0 && (
                    <TouchableOpacity
                        onPress = {() => {
                            setFilteredServices([]);
                            setShowResults(false);
                            setSearchText('');
                        }}
                    
                    >
                        <Ionicons name = 'close-circle' size = {20} color = '#666'/>
                    </TouchableOpacity> 
                )}
            </View>
        </TouchableOpacity>

        {showResults && typing && mapScreen && (
            <View style = {styles.dropdownResults}>
                <SearchList 
                    service ={filteredServices.slice(0, 10)}
                    onSelectService = {handleServiceSelect}
                />
            </View>
        )}

        <BottomSheet
            ref = {bottomSheetRef}
            title = 'Results'
            children = {
                <SearchResults
                    services = {filteredServices}
                    onDismiss={() => bottomSheetRef.current?.dismiss()}
                />
            }
        
        />

</>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        paddingVertical: 10,
        width: '100%',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50, // You can increase this value if you want a taller search bar
        width: '100%', 
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
    dropdownResults: {
        position: 'absolute',
        top: 70,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: 300,
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
})

export default SearchBarComponent;



