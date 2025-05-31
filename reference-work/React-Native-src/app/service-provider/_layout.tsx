import {Stack} from 'expo-router'


export default function ServiceProviderLayout(){
    return(
        <Stack>
            <Stack.Screen name = '(home)' options = {{
                headerShown: false,
            }}/>
            <Stack.Screen name = 'service-details' options = {{
                headerShown: false,
                presentation: 'modal',
            }}/>
            <Stack.Screen name = 'bookings' options = {{
                headerShown: false,
                presentation: 'modal',
            }}/>
            
             {/* 
             <Stack.Screen name = 'bookings' options = {{
                headerShown: false,
            }}/>
            <Stack.Screen name = 'reviews' options = {{
                headerShown: false,
            }}/> */}


      

        </Stack>
    )
}