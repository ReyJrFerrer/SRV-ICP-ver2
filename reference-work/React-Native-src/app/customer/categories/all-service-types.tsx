import {View,Text, StyleSheet, Pressable} from 'react-native'
import { FlashList } from '@shopify/flash-list';
import { CATEGORIES } from '../../../../assets/categories';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
const AllServiceTypes = () => {
    return (
        <View style = {styles.container}>
            <FlashList 
                data = {CATEGORIES}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                    <View style={styles.itemContainer}>
                        <Link asChild href={`/customer/categories/${item.slug}`}>
                            <Pressable style={styles.category}>
                                <View style={styles.categoryIconContainer}>
                                    <FontAwesome5 
                                        name={item.icon} 
                                        size={24} 
                                        color="#4F959D"/>
                                </View>
                                <Text style={styles.categoryText}>{item.name}</Text>
                            </Pressable>
                        </Link>
                    </View>
                }
                estimatedItemSize={60}
            />
        </View>
    )
}
export default AllServiceTypes;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        padding: 16,
    },
    itemContainer: {
        marginBottom: 8,
    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#E8F5E9',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        flex: 1,
        textAlign: 'right',
        marginLeft: 16,
    },
})