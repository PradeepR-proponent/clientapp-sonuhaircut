import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Pressable, TextInput } from 'react-native';
// dependencies import 
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { OtpVerificationRequest, ResendOtpRequest } from '../service/Otp';
import Spinner from 'react-native-loading-spinner-overlay';
// constants import 
import configResponse from '../config/constant';
// images imports 
import Background from '../assets/images/background/Hair_Salon_Stations.jpg';

function OtpVerification({ navigation, route }) {
    const [otp, onChangeOtp] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    let [fontsLoaded] = useFonts({
        Inter_400Regular, Inter_700Bold
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const OtpUpRequest = () => {
        if (!otp) {
            return configResponse.errorMSG('Enter otp');
        }

        const data = `otp=${otp}`
        setIsLoading(true);

        OtpVerificationRequest(data).then((response) => {
            setIsLoading(false);
            if (response?.status == 200 || response?.status == 201) {
                onChangeOtp(null);
                navigation.navigate(route.params.nextpageurl)
            } else if (response?.status == 400 || response?.status == 500) {
                configResponse.errorMSG(response.data.errors);
            } else if (response?.status == 401) {
                configResponse.errorMSG(response.data.message);
            } else {
                const resultError = response?.data?.errors;
                let errorlist = '';
                for (const [key, value] of Object.entries(resultError)) {
                    errorlist += `${value}\n`;
                }
                configResponse.errorMSG(errorlist);
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message);
        });
    }

    const resendOtp = () => {
        setIsLoading(true);
        ResendOtpRequest().then((response) => {
            setIsLoading(false);
            if (response?.status == 200 || response?.status == 201) {
                configResponse.successMSG(response.data.message);
            } else {
                configResponse.errorMSG(response.data.errors);
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image}>
                <View style={styles.container_child}>
                    <View style={styles.container_mid}>
                        <Spinner
                            visible={isLoading}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                        <Text style={styles.heading}>OTP Verification</Text>
                        <Text style={styles.text_dis}>Please enter the verification code sent to your register mobile number. </Text>
                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangeOtp} value={otp} placeholder="Enter OTP" />

                        <Pressable onPressIn={OtpUpRequest} style={styles.SubmitButton}>
                            <Text style={styles.SubmitButtonText}>Confirm OTP</Text>
                        </Pressable>

                        <Pressable onPressIn={resendOtp}  >
                            <Text style={styles.LinkButton}>Resend otp</Text>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default OtpVerification;

// StyleSheet 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container_child: {
        backgroundColor: "#000000c0",
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap'
    },
    container_mid: {
        padding: 10
    },
    image: {
        flex: 1,
        justifyContent: 'center'
    },
    heading: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: "700",
        color: '#ffffff',
        marginBottom: 10,
        fontFamily: 'Inter_700Bold'
    },
    text_dis: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 16,
        fontFamily: 'Inter_400Regular'
    },
    input: {
        borderColor: '#ddd',
        backgroundColor: '#ffffff',
        width: 340,
        height: 50,
        borderWidth: 1,
        marginBottom: 18,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 2,
        color: '#000000',
        fontSize: 16,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        fontFamily: 'Inter_400Regular'
    },
    LinkButton: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 16
    },
    SubmitButton: {
        width: 300,
        padding: 10,
        backgroundColor: '#FFC000',
        borderRadius: 3,
        width: 300,
        padding: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        marginTop: 20,
    },
    SubmitButtonText: {
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 18
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});