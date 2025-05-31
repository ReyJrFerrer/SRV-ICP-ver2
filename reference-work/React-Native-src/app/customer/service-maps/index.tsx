import {StyleSheet, Text, View, Platform, } from 'react-native';
import {StatusBar} from 'expo-status-bar';
import React from 'react';
import CurrentLocationMap from '../../../components/ServiceLocationMap';
import Map from '../../../components/Map';
const ServiceMap = () => {
   return (
      <View style={styles.container}>
         <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'}/>
         <Map/>
      </View>
   )
}
                
                   
export default ServiceMap;
                      
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   }
})