import {StyleSheet, Text, View, Image, Pressable, Platform, Dimensions } from 'react-native';
import { Service } from '../../assets/types/service/service';
import {Link} from 'expo-router';
import {FontAwesome5} from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Responsive sizing check
const isSmallDevice = wp('100%') < 375;
const isLargeDevice = wp('100%') >= 768;

interface ServiceListItemProps {
    inCategories ?: boolean
    service : Service
}

// crazy thought, service radius and ratings are pressable which leads them to ratings and reviews and maps 
const ServiceListItem = ({inCategories = false , service}: ServiceListItemProps) => {
   return (
      <Link asChild href={`/customer/service/${service.slug}`}>
         <Pressable style={inCategories ?  styles.itemCategoriesPage : styles.itemHomePage}>
            <View style={styles.itemImageContainer}>
               <Image source={service.heroImage} style={styles.serviceImage}/>
            </View>
            <View style={styles.serviceTextContainer}>
                <View>
                <View style = {styles.topRowContainer}>
                    <Text style = {styles.serviceName}>{service.name}</Text>
                    <Text style = {styles.serviceRatings}> {<FontAwesome5 name = 'star' size = {wp('4%')} style = {{color: '#27548A',}}/>} {service.rating.average} ({service.rating.count})</Text>
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                </View>
                <View style = {inCategories ? styles.bottomRowContainer: styles.categoriesRowContainer}>
                    <Text style={styles.servicePrice}>₱ {service.price.amount.toFixed(2)} {service.price.unit}</Text>
                    <Text style = {styles.serviceLocationRadius}>
                        {<FontAwesome5 name = 'map-marker-alt' size = {wp('4%')}/>} {service.location.serviceRadius} {service.location.serviceRadiusUnit}
                    </Text>
              
                </View>
            </View>
         </Pressable>
      </Link>
   );
};

export default ServiceListItem;

const styles = StyleSheet.create({
    itemCategoriesPage: {
        width: isSmallDevice ? wp('85%') : wp('92%'),
        height: hp('27%'),
        backgroundColor: 'white',
        marginVertical: hp('1%'), 
        borderRadius: wp('2.5%'),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            }
        }),
    },
    itemHomePage: {
        width: isSmallDevice ? wp('75%') : wp('80%'),
        height: hp('39%'),
        backgroundColor: 'white',
        marginVertical: hp('1%'), 
        borderRadius: wp('2.5%'),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            }
        }),
    },
    itemImageContainer: {
        borderRadius: wp('2.5%'),
        width: '100%',
        height: '60%',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    serviceTextContainer: {
        padding: wp('2%'), 
        alignItems: 'flex-start',
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
    },
    serviceTitle: {
        fontSize: wp('4%'),
        color: '#27548A',
    },
    serviceName: {
        fontSize: wp('5.8%'),
        color: '#27548A', 
        fontWeight: 'bold',
    },
    servicePrice: {
        fontSize: wp('5.3%'),
        fontWeight: 'bold',
        color: '#27548A', 
    }, 
    serviceRatings: {
        color: '#27548A',
        fontSize: wp('4.8%'),
    }, 
    serviceLocationRadius: {
        color: '#27548A',
        fontSize: wp('4.8%'),
    },
    topRowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        width: '100%',
    },
    bottomRowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        width: '100%',
    },
    categoriesRowContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        width: '100%'
    },
})