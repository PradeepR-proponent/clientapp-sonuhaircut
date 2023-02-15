import Toast from 'react-native-root-toast';
import * as SecureStore from 'expo-secure-store';

const AuthLocation = async function LocationCheck() {
    if(SecureStore.isAvailableAsync('location')){
        const location = await SecureStore.getItemAsync('location')
        if(location == null){
            return '1'
        }else{
            return location
        }
    }else{
        return '1'
    }
}

const successMSG = function (message){
    Toast.show(message, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
        textColor: '#ffffff',
        opacity: 1,
        backgroundColor: '#28a745'
    });
} 

const errorMSG = function (message){
    Toast.show(message, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
        textColor: '#ffffff',
        opacity: 1,
        backgroundColor: '#b50101'
    });
} 

const infoMSG = function (message){
    Toast.show(message, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
        textColor: '#ffffff',
        opacity: 1,
        backgroundColor: '#17a2b8'
    });
} 

const configResponse = {
    // baseURL: 'http://192.168.1.112:8000/api', 
    baseURL: 'https://api.sonuhaircut.com/api',
    constactUsUrl:'https://sonuhaircut.com/contact' ,
    primaryBackground: '#d4af37',
    primaryColor: '#d4af37',
    fontFamily: 'primary_font',
    userLocation: AuthLocation,
    successMSG: successMSG,
    errorMSG: errorMSG,
    infoMSG: infoMSG,
    facebookAppId: '653254003148206',
    googleClientId: '57321145049-nq2sqj27iqq7k1s8ihesrppte1fia7p6.apps.googleusercontent.com'
};

export default configResponse;
