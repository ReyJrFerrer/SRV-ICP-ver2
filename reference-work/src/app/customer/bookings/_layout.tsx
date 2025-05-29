import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function BookingsLayout(){
    return (
    <Stack>
        <Stack.Screen name = "[slug]" options = {({navigation}) => ({
            headerShown: false,
            headerLeft: () => 
            <TouchableOpacity onPress = {() => navigation.goBack()}>
                <Ionicons name = "arrow-back" size = {24} color = "black"/>
            </TouchableOpacity>
            
        })}/>
        <Stack.Screen name = "booking-details" options = {({navigation}) => ({
            headerShown: false,
            headerLeft: () => 
            <TouchableOpacity onPress = {() => navigation.goBack()}>
                <Ionicons name = "arrow-back" size = {24} color = "black"/>
            </TouchableOpacity>
            
        })}/>
         <Stack.Screen name = "confirm-work" options = {({navigation}) => ({
            title: 'Verify Completed Work',
            headerLeft: () => 
            <TouchableOpacity onPress = {() => navigation.goBack()}>
                <Ionicons name = "arrow-back" size = {24} color = "black"/>
            </TouchableOpacity>
            
        })}/>
       
    </Stack>
    )
}