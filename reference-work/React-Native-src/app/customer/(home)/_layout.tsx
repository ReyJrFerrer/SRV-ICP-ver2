import {Tabs} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome} from '@expo/vector-icons';
import {StyleSheet} from 'react-native';


function TabBarIcon (props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size = {24} {...props} style = {{color: 'white'}}/>

}

export default function TabLayout(){
    return (
       <SafeAreaView edges = {['top']} style = {styles.safeArea}>
             <Tabs
          screenOptions = {{
            tabBarActiveTintColor: 'white',
            headerStyle: {
                backgroundColor: '#205781',
            },
            headerShadowVisible: false, 
            headerTintColor: 'white',
            tabBarStyle: {
                backgroundColor: '#205781',
            },
            headerShown: false,
          }}
        >
            <Tabs.Screen 
                name = 'index' 
                options = {{
                    title: 'Home', 
                    tabBarIcon(props) {
                        return <TabBarIcon {...props} name = 'home'/>
                    },
                headerShown: false

                }}

            />

            {/**Commenting unused tab screens for the demo presentation -> remake the project directories
             * 
             */}

            {/* <Tabs.Screen 
                name = 'payment' 
                options = {{
                    title: 'Payment',
                    tabBarIcon(props) {
                        return <TabBarIcon {...props} name = 'money'/>
                    },
                    headerShown: false
                    }}/>
 */}

            <Tabs.Screen 
                name = 'chat' 
                options = {{
                    title: 'Chat',
                    tabBarIcon(props) {
                        return <TabBarIcon {...props} name = 'envelope'/>
                    },
                    headerShown: false
                    }}/>
                    

            {/* <Tabs.Screen 
                name = 'activity' 
                options = {{
                    title: 'History',
                    tabBarIcon(props) {
                        return <TabBarIcon {...props} name = 'clock-o'/>
                    },
                    headerShown: false
                    }}/> */}

            
{/* 
            <Tabs.Screen 
                name = 'profile' 
                options = {{
                    title: 'Profile',
                    tabBarIcon(props) {
                        return <TabBarIcon {...props} name = 'user'/>
                    },
                    headerShown: false
                    }}/> */}
        </Tabs>

       </SafeAreaView>
      
    );

}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    }
})