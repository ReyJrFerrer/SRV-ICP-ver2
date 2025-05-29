import { Stack } from "expo-router";


export default function ActiveJobsLayout(){
    return(
        <Stack>
        <Stack.Screen name = "booking-notifications" options = {{
            headerShown: true,
        }}
        />
       
        </Stack>
       
    );
}
   
