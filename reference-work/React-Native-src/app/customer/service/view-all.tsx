import { Text, StyleSheet, View } from "react-native"
import { SERVICES } from '../../../../assets/services';
import ServiceListItem from '../../../components/ServiceListItem';
import { FlashList } from '@shopify/flash-list';
const ViewAllServices = () => {
    
    return (
        <View style = {styles.container}>

            <FlashList
                data = {SERVICES}
                renderItem={({item}) => 
                    <View>
                        <ServiceListItem inCategories = {true} service={item}/>
                    </View>
                }
                keyExtractor={item => item.id.toString()}
                estimatedItemSize={200}
                />
        </View>
       
    )
}
export default ViewAllServices 

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        padding: 16,
        alignContent: 'center'
    }

})