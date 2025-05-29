import {StyleSheet, Text, View, Image, FlatList } from 'react-native';
import {Redirect, Stack, useLocalSearchParams} from 'expo-router';
import { CATEGORIES } from '../../../../assets/categories';
import { SERVICES } from '../../../../assets/services';
import ServiceListItem from '../../../components/ServiceListItem';
// adding Flashlist to replace FlatList
import { FlashList } from '@shopify/flash-list';
                       
const Category = () => {

   const {slug} = useLocalSearchParams(); 
   const category = CATEGORIES.find(category => category.slug === slug);
   if (!category) return <Redirect href = '/404'/>

   const services = SERVICES.filter(service => service.category.slug === slug);


   return (
         <View style= {styles.container}>
          <Stack.Screen options= {{title: category.name}}/>
          <Image source = {category.imageUrl} style = {styles.categoryImage}/>
          <Text style = {styles.categoryName}> {category.name}</Text>
         <FlashList 
            data = {services}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => 
            <View style = {styles.serviceList}> 
             <ServiceListItem inCategories = {true} service= {item} />
            </View>
            
            }
            estimatedItemSize = {250}
            />
       </View>
   )
}
                     
export default Category;
                      
const styles = StyleSheet.create({
   container: {
      flex: 1, 
      backgroundColor: '#fff',
      padding: 16,
   },
   categoryImage: {
      width: '100%', 
      height: 200, 
      resizeMode: 'cover',
      borderRadius: 8,
      marginBottom: 16,
   }, 
   categoryName: {
      fontSize: 24,   
      fontWeight: 'bold',
      marginBottom: 16,
   },
   serviceList: {
      flexGrow: 1,
   },
   serviceRow: {
      justifyContent: 'space-between'
   }, 
   serviceContainer: {
      flex: 1, 
      margin: 8,
   },
   serviceImage: {
      width: '100%', 
      height: 150, 
      resizeMode: 'cover',
      borderRadius: 8,
      
   }, 
   serviceTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
   },
   servicePrice: {
      fontSize: 16,
      color: '#888',
      marginTop: 4,
      
   }, 
})