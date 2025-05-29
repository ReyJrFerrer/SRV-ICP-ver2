import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';


export default function CategoriesLayout(){
    return (

   
               <Stack>
                    <Stack.Screen name = "[slug]" options = {({navigation}) => ({
                        headerShown: false,
                        headerLeft: () => 
                        <TouchableOpacity onPress = {() => navigation.goBack()}>
                            <Ionicons name = "arrow-back" size = {24} color = "black"/>
                        </TouchableOpacity>
                        
                    })}/>

                    <Stack.Screen name = "all-service-types" options = {{
                        headerShown: false,
                   }}/>
                </Stack>
      
 
    )
}