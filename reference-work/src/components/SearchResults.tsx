import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Service } from '../../assets/types/service/service';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchResultsProps {
    services: Service[];
    onDismiss: () => void;
}

const SearchResults = ({ services,  onDismiss}: SearchResultsProps) => {
    const router = useRouter();
    const handleViewFullDetails = (service: Service) => {
        if (onDismiss) {
            onDismiss();
        }
        console.log(service.slug)

        router.push(`/customer/service/${service.slug}`);
    };
    const renderItem = ({ item }: { item: Service }) => {
        return (
            <TouchableOpacity 
                style={styles.resultItem} 
                onPress={() => handleViewFullDetails(item)}
                activeOpacity={0.7}
            >
                <View style={styles.leftContainer}>
                    {item.heroImage ? (
                        <Image 
                            source={item.heroImage} 
                            style={styles.providerImage} 
                        />
                    ) : (
                        <View style={[styles.providerImage, styles.iconContainer]}>
                            <FontAwesome5 
                                name={item.category.icon || "briefcase"} 
                                size={22} 
                                color="#555" 
                            />
                        </View>
                    )}
                </View>
                
                <View style={styles.middleContainer}>
                    <Text style={styles.nameText} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {item.title || item.category.name}
                    </Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                        {item.location.address}
                    </Text>
                </View>
                
                <View style={styles.rightContainer}>
                    <Text style={styles.priceText}>
                        ${item.price.amount}
                    </Text>
                    <Text style={styles.unitText}>
                        per {item.price.unit}
                    </Text>
                    {item.availability.isAvailableNow ? (
                        <View style={styles.availabilityBadge}>
                            <Text style={styles.availabilityText}>Available</Text>
                        </View>
                    ) : (
                        <View style={[styles.availabilityBadge, styles.unavailableBadge]}>
                            <Text style={[styles.availabilityText, styles.unavailableText]}>Busy</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {services.length > 0 ? (
                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No services found</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingVertical: 8,
    },
    resultItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    leftContainer: {
        marginRight: 12,
    },
    providerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f0f0',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    titleText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    addressText: {
        fontSize: 12,
        color: '#888',
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 80,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2196F3',
    },
    unitText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    availabilityBadge: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    availabilityText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#388e3c',
    },
    unavailableBadge: {
        backgroundColor: '#ffebee',
    },
    unavailableText: {
        color: '#d32f2f',
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});

export default SearchResults;