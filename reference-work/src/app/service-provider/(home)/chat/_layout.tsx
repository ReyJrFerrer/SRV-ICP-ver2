import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons'


export default function ChatLayout(){
    return (
    <Stack>
        <Stack.Screen name = "index" options = {{
            headerShown: false,
            title: 'Chat',
        }}/>

    </Stack>
    
    )
}