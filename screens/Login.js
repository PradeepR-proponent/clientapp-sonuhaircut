import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    SafeAreaView, Image,
    Pressable
} from "react-native";
// packages 
import {
    useFonts,
    Inter_400Regular,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import PhoneInput from "react-native-phone-number-input";
import Spinner from 'react-native-loading-spinner-overlay';
import AppLoading from "expo-app-loading";
// constants 
import configResponse from "../config/constant";
// services 
import { loginUpRequest } from '../service/User';
// images 
import logo from '../assets/logo2.png'
import Background from "../assets/images/background/Hair_Salon_Stations.jpg";
// pages 
// import SocialLogin from "./SocialLogin";

function Login({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [phone, onChangePhone] = React.useState(null);
    const [country_code, setCode] = React.useState(1);
    const phoneInput = React.useRef(null);
    const [formattedValue, setFormattedValue] = React.useState("");
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }
    const LoginRequest = () => {

        if (!country_code) {
            return configResponse.errorMSG(`Enter phone number or select country code`);
        }
        if (!phone) {
            return configResponse.errorMSG(`Please enter your phone number`);
        }
        setIsLoading(true);
        const data = {
            phone,
            country_code
        };
    
        loginUpRequest(data).then(async (response) => {
            setIsLoading(false)
            if (response.status == 200) {
                onChangePhone(null)
                configResponse.successMSG(response.data.message)
                navigation.navigate('LoginOtpVerification',{token: response?.data?.token} );
            } else {
                configResponse.errorMSG(response.data.errors)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image} >
                <Spinner visible={isLoading} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                <View style={styles.container_child}>
                    <View style={styles.bottomLogoContainer}>
                        <Image source={logo} style={styles.bottomLogo} />
                    </View>
                    <Text style={styles.heading}>Login Now</Text>
                    <Text style={styles.text_dis}> Please Login to continue using our App </Text>
                     {/* <SocialLogin /> */}
                    {/* <Text style={[styles.text_dis,{fontWeight:"bold"}]}>-----  Or  -----</Text>  */}
                    <Text style={[styles.text_dis, { fontWeight: "bold" }]}>Login with phone number</Text>
                    <PhoneInput
                        ref={phoneInput}
                        value={phone}
                        defaultCode="CA"
                        // countries={[ "CA","US","IN"]}
                        layout="first"
                        onChangeText={(text) => onChangePhone(text)}
                        onChangeFormattedText={(text) => setFormattedValue(text)}
                        onChangeCountry={(country) => setCode(country.callingCode[0]) }
                        containerStyle={styles.phoneContainerStyle}
                        textInputStyle={styles.textInputStyle}
                        codeTextStyle={styles.codeTextStyle}
                    />
                    {/* 
                    <Pressable
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        <Text style={styles.LinkButton}>Forgot Password?</Text>
                    </Pressable> */}
                    <Pressable onPressIn={LoginRequest} style={styles.SubmitButton}>
                        <Text style={styles.SubmitButtonText}>Login</Text>
                    </Pressable>
                    <Pressable style={styles.signUp} onPress={() => navigation.navigate("SignUp")}>
                        <Text style={[styles.LinkButton, { marginRight: 5 }]}> Don't have an account ? </Text>
                        <Text style={[styles.LinkButton, { fontWeight: "bold" }]}>
                            Sign Up
                        </Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default Login;

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signUp: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    bottomLogoContainer: {
        marginBottom: 30
    },
    bottomLogo: {
        height: 120,
        width: 120
    },
    container_child: {
        backgroundColor: "#000000c0",
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        justifyContent: "center",
    },
    heading: {
        fontSize: 26,
        textAlign: "center",
        fontWeight: "700",
        color: "#FFC000",
        marginBottom: 10,
        fontFamily: "Inter_700Bold",
    },
    text_dis: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "Inter_400Regular",
        marginTop: 20
    },
    phoneContainerStyle: {
        borderColor: '#ddd',
        borderWidth: 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 250,
        height: 40,
        borderRadius: 3,
        marginTop: 20
    },
    textInputStyle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#000000',
        height: 20
    },
    codeTextStyle: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        height: 20,
        top: -2,
        color: '#000000',
    },
    LinkButton: {
        color: "#fff",
        textAlign: "center",
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        marginTop: 20
    },
    SubmitButton: {
        width: 250,
        height: 40,
        padding: 7,
        backgroundColor: "#FFC000",
        borderRadius: 3,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 20,
    },
    SubmitButtonText: {
        color: "#000000",
        textAlign: "center",
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        fontWeight: "bold"
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});
