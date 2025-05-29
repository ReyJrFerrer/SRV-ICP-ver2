import { FlashList } from "@shopify/flash-list";
import {View, Text, StyleSheet,  TouchableOpacity} from 'react-native';
import { CATEGORIES } from "../../assets/categories";
import { FontAwesome5 } from '@expo/vector-icons';

interface MapFiltersProps {
    onCategorySelect: (categoryName: string) => void;
    selectedCategory?: string | null;
}

const MapFilters = ({onCategorySelect, selectedCategory} : MapFiltersProps) => {
    return(
        <FlashList 
            data = {CATEGORIES}
            renderItem={({item}) => (
                <TouchableOpacity 
                style={[
                    styles.filterButton,
                    selectedCategory === item.name ? styles.selectedFilter : {}
                    ]}
                onPress = {() => onCategorySelect(item.name)}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5
                            name = {item.icon}
                            size = {10}
                            color = {selectedCategory === item.name ? '#ffffff' : '#484848'}
                        />
                        <Text 
                            style={[
                                styles.filterText,
                                selectedCategory === item.name ? styles.selectedFilterText : {}
                            ]}
                         >
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            
            )}
            horizontal 
            showsHorizontalScrollIndicator = {false}
            estimatedItemSize={80}
            contentContainerStyle={styles.listContainer}
        />
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        
    },
    filterButton: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 8,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
        height: 30,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        
    },
    filterText: {
        fontSize: 12,
        marginLeft: 6,
        color: '#484848',
        fontWeight: '500',
    },
    selectedFilter: {
        backgroundColor: '#007AFF',
    },
    selectedFilterText: {
        color: '#ffffff',
        fontWeight: '600',
    },

});

export default MapFilters;