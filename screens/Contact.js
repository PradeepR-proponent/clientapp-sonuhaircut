import React from 'react'
// package imports 
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Icon from "react-native-vector-icons/Feather";
// constants 
import configResponse from "../config/constant";
// images 
// import Logo from "../assets/images/logo.jpg";
import { WebView } from 'react-native-webview';




const Contact = () => {
  return (
    <WebView source={{ uri: configResponse.constactUsUrl }} />
  )
}

export default Contact



