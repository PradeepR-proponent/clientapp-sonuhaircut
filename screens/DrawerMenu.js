import * as React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';
import HeaderDrawerMenu from '../components/header';
import ServiceStack from '../helper/serviceStack';
import ChangePassword from '../screens/ChangePassword';
import UpcomingBooking from '../screens/UpcomingBooking';
import Settings from './Settings';
import PrivacyPolicy from './PrivacyPolicy';
import Profile from '../screens/Profile';
import AboutUs from './AboutUs';
import Contact from './Contact';
import Feedback from './Feedback';
import {RootStateContext} from '../helper/RootStateContext'


function DrawerMenu (){
    const Drawer = createDrawerNavigator()
    const [appointmentData, setAppointmentData] = React.useState([])
    const data = {
      appointmentData, setAppointmentData
    }
  
    return (
        <RootStateContext.Provider value={data}>
        <Drawer.Navigator drawerContent={(props) => <HeaderDrawerMenu  {...props}/>}>
            <Drawer.Screen name="ServiceStack" component={ServiceStack} options={{headerShown:false}} />
            <Drawer.Screen name="UpcomingBooking" component={UpcomingBooking} options={{headerShown:true, headerTitle: "Upcoming Booking", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000'}} />
            <Drawer.Screen name="Profile" component={Profile} options={{headerShown:true, headerTitle: "My Profile", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="SettingsScreen" component={Settings} options={{headerShown:true, headerTitle: "Settings", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{headerShown:true, headerTitle: "Privacy Policy", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="AboutUs" component={AboutUs} options={{headerShown:true, headerTitle: "About Sonu Haircut", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="Contact" component={Contact} options={{headerShown:true, headerTitle: "Contact Us", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="Password" component={ChangePassword} options={{headerShown:true, headerTitle: "Change Password", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
            <Drawer.Screen name="Feedback" component={Feedback} options={{headerShown:true, headerTitle: "Feedback", headerStyle:{backgroundColor: '#FFD700'}, headerTintColor: '#000000'}} />
        </Drawer.Navigator>
        </RootStateContext.Provider>
    );
}

export default DrawerMenu;
