import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Service } from '../../assets/types/service/service';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface SearchListProps {
    service: Service[];
    onSelectService: (service: Service) => void;
    isEndType?: boolean;
}

const SearchList = ({ service, onSelectService, isEndType = false }: SearchListProps) => {
    return (
        <View style={styles.container}>
            {service.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.resultItem}
                    onPress={() => onSelectService(item)}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name={item.category.icon} size={16} color="#666" />
                    </View>
                    
                    <View style={styles.textContainer}>
                        <Text style={styles.primaryText} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={styles.secondaryText} numberOfLines={1}>
                            {item.title || item.category.name} • {item.location.address}
                        </Text>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    primaryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    secondaryText: {
        fontSize: 12,
        color: '#666',
    },
});

export default SearchList;