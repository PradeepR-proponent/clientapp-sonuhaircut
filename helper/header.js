import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { View, StyleSheet, Pressable, Text } from 'react-native'
import configResponse from '../config/constant';
import Icon from "react-native-vector-icons/Feather";
import * as SecureStore from 'expo-secure-store';
import Location from '../screens/Location';
import { AppStateContext } from './AppStateContaxt';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MyHeader = (props) => {

  const { setLocationModal, locationModal, location } = React.useContext(AppStateContext)

  const { options, navigation } = props
  const _goBack = () => navigation.goBack()

  // const _location = async () => {
  //   await SecureStore.setItemAsync("ModalLocation", 'true')
  //   setLocationModal(true)
  // }

  const _location = () => {
    setLocationModal(!locationModal)
  }

  const rightMenu = navigation.canGoBack() ? 'flex' : 'none'


  


  return (
    <Appbar.Header style={styles.TopHeader}>
      {navigation.canGoBack() ? (<Appbar.BackAction onPress={_goBack} />) : (<Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />)}
      <Appbar.Content title={options?.headerTitle} />
      {props.route.name === "Home" && <Text>{location?.city}</Text>}
      <Pressable onPressIn={_location}><MaterialIcons name='location-on' style={styles.icon} size={18} color='black' /></Pressable>
      {/* <Pressable >
        <MaterialCommunityIcons name="bell" style={styles.icon} color='black' size={18} />
      </Pressable> */}
      <Appbar.Action style={{ display: rightMenu }} icon="dots-vertical" onPress={() => navigation.toggleDrawer()} />
      <Location />
    </Appbar.Header>
  )
}

export default MyHeader;

const styles = StyleSheet.create({
  TopHeader: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10
  },
  icon: {
    marginRight: 10
  }

});
