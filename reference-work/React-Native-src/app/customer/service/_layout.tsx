import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function ServiceLayout(){
    return (
    <Stack>
        <Stack.Screen name = "[slug]" options = {({navigation}) => ({
            headerShown: true,
            headerLeft: () => 
            <TouchableOpacity onPress = {() => navigation.goBack()}>
                <Ionicons name = "arrow-back" size = {24} color = "black"/>
            </TouchableOpacity>

        
        })}/>
         <Stack.Screen name = "send-booking-request" options = {({navigation}) => ({
                presentation : 'modal',
                headerLeft: () => 
                    <TouchableOpacity onPress = {() => navigation.goBack()}>
                        <Ionicons name = "arrow-back" size = {24} color = "black"/>
                    </TouchableOpacity>
                  

         })}/> 

         <Stack.Screen name = "view-all" options = {({navigation}) => ({
            headerShown: true,
            title:'All Services' , 
            headerLeft: () => 
            <TouchableOpacity onPress = {() => navigation.goBack()}>
                <Ionicons name = "arrow-back" size = {24} color = "black"/>
            </TouchableOpacity>

         })}/>
        
       
    </Stack>
    )
}