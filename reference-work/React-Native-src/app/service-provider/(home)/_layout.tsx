import {Tabs} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome5} from '@expo/vector-icons';
import {StyleSheet} from 'react-native';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome5>['name'];
    color: string;
}) {
    return <FontAwesome5 size={22} {...props} style={{color: props.color}}/>
}

export default function TabLayout(){
    return (
       <SafeAreaView edges={['top']} style={styles.safeArea}>
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
                name="index" 
                options={{
                    title: 'Dashboard', 
                    tabBarIcon: ({color}) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                }}
            />

            <Tabs.Screen 
                name="chat" 
                options={{
                    title: 'Chat', 
                    tabBarIcon: ({color}) => (
                        <TabBarIcon name="envelope" color={color} />
                    ),
                }}
            />

            {/** Uncomment to continue developing on this pages */}
              {/* <Tabs.Screen 
                name="activity" 
                options={{
                    title: 'Activity', 
                    tabBarIcon: ({color}) => (
                        <TabBarIcon name="history" color={color} />
                    ),
                }}
            /> */}


            <Tabs.Screen 
                name="services" 
                options={{
                    title: 'Services', 
                    tabBarIcon: ({color}) => (
                        <TabBarIcon name="tools" color={color} />
                    ),
                }}
            />
            

    

            {/* <Tabs.Screen 
                name="earnings" 
                options={{
                    title: 'Earnings', 
                    tabBarIcon: ({color}) => (
                        <TabBarIcon name="dollar-sign" color={color} />
                    ),
                }}
            /> */}

        </Tabs>
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    }
})