import {Stack} from 'expo-router'

export default function CustomerLayout(){
    return (
            <Stack screenOptions={{
            contentStyle: {
                backgroundColor: 'transparent'
            }
        }}>
            
            <Stack.Screen name = "(home)" options = {{
                headerShown: false,
            }}/>
            <Stack.Screen name = "bookings" options = {{
                presentation: 'modal',  
                title: 'Bookings',
            }}/>
            <Stack.Screen name = "categories" options = {{
                headerShown: true,
                title: 'Categories',
            }}/>
            <Stack.Screen name = "service-maps" options = {{
                title: 'Service Maps',
            }}/>
    
            <Stack.Screen name = "service" options = {{
                headerShown: false,
                title: 'Service',
            }}/>
            <Stack.Screen name = "address" options = {{
                title: 'Address',
                presentation: 'formSheet',
                gestureDirection: 'vertical',
                animation: 'slide_from_bottom',
                sheetGrabberVisible: true,
                sheetInitialDetentIndex: 0,
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetCornerRadius: 20,
                sheetExpandsWhenScrolledToEdge: true,
                sheetElevation: 24,
            }}/>
            
        </Stack>

        

        
        
      
    )
}


