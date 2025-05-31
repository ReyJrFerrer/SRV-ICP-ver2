import {FlatList,StyleSheet, Text, View } from 'react-native';
import { SERVICES } from '../../../../assets/services';
import ServiceListItem from '../../../components/ServiceListItem';
import { ListHeader } from '../../../components/ListHeader';

                       
const CustHomeScreen = () => {
   // separated list header 
   // Bug: using flashlist produces a bug where moving past an item you already scrolled by produces a key error issue
   // maybe it's something to do with back keys or caching error

   // The list header bottom modal won't appear when the user clicks on the location icon 
   // if it's unable to determine location 
   // This provides protection from error when accessing the user maps 
   
   return (
       <View style = {styles.container}>
         <ListHeader/>
          <FlatList 
               data = {SERVICES}
               keyExtractor={item => item.id.toString()}
               renderItem = {({item}) => 
               (
               <View style = {styles.flatListGap}>
                   <ServiceListItem service = {item}/>
               </View>
              
               )}
               horizontal = {true}
               contentContainerStyle = {styles.flatListContent}
               showsHorizontalScrollIndicator = {false}
           
             
               
               />
       </View>
   )
}
                     
export default CustHomeScreen;
                      
const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 10,
   },
   flatListContent : {
      paddingVertical: 10,
   }, 
   flatListGap: {
      paddingRight: 15,
   }
  
}
)
