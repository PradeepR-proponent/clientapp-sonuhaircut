import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyHeader from './header';
import Home from '../screens/Home';
import Service from '../screens/Service';
import TimeSlot from '../screens/TimeSlot';
import BookingConfirmation from '../screens/BookingConfirmation';
import { AppStateContext } from './AppStateContaxt';

function ServiceStack() {
    const Stack = createNativeStackNavigator();
const [locationModal,setLocationModal]=React.useState(false)
const [location,setLocations]=React.useState("")

const data={
    locationModal,
    setLocationModal,
    location,setLocations
}
    return (
    <AppStateContext.Provider value={data}>
        <Stack.Navigator screenOptions={{headerMode: 'float', header: (props) => <MyHeader {...props} />}}>
            <Stack.Screen name="Home" options={{headerShown: true, headerTitle: ''}} component={Home} />
            <Stack.Screen name="Service" options={{headerShown: true, headerTitle: 'Choose Service'}} component={Service} />
            <Stack.Screen name="Staff" component={TimeSlot} options={{headerShown: true, headerTitle: 'Date & Time'}} />
            <Stack.Screen name="Booking" component={BookingConfirmation} options={{headerShown: true, headerTitle: 'Confirm Booking'}} />
        </Stack.Navigator>
    </AppStateContext.Provider>

    );
  }
  
  export default ServiceStack;