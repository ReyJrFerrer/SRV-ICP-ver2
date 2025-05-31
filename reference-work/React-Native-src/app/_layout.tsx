import {Stack} from 'expo-router';
import { StyleSheet } from 'react-native';

export default function RootLayout(){
    return (
        <Stack>
            <Stack.Screen name="customer" options = {{
                headerShown: false,
            }}  />
            <Stack.Screen name="service-provider" options = {{
                headerShown: false,
                title: "Service Provider"
            }}/>
            <Stack.Screen name = "index" options = {{
                headerShown: false,
                title: "Login"
            }}/>
        </Stack>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});