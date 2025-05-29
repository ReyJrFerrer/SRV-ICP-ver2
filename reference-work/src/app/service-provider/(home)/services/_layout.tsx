import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons'


export default function ServicesLayout(){
    return (
    <Stack>
        <Stack.Screen name = "services-list" options = {{
            headerShown: false,
            title: 'Services',
        }}/>
      

    </Stack>
    
    )
}