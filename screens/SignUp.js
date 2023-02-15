import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Pressable, TextInput, Image, ScrollView } from 'react-native';
// dependencies 
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { signUpRequest } from '../service/User';
import * as SecureStore from 'expo-secure-store';
import PhoneInput from "react-native-phone-number-input";
import Spinner from 'react-native-loading-spinner-overlay';
// constants 
import configResponse from '../config/constant';
// images 
import logo from '../assets/logo2.png'
import Background from '../assets/images/background/Hair_Salon_Stations.jpg';


function SignUp({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [first_name, onChangeFirstName] = React.useState(null);
    const [last_name, onChangeLastName] = React.useState(null);
    const [email, onChangeEmail] = React.useState(null);
    const [phone, onChangePhone] = React.useState(null);
    const phoneInput = React.useRef(null);
    const [formattedValue, setFormattedValue] = React.useState("");

    let [fontsLoaded] = useFonts({
        Inter_400Regular, Inter_700Bold
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const SignUpRequest = () => {
        const country_code = formattedValue;
        const dial_code = phoneInput.current?.getCountryCode();

        if (!first_name) {
            return configResponse.errorMSG('Enter first name');
        }

        if (!last_name) {
            return configResponse.errorMSG('Enter last name');
        }

        if (!email) {
            return configResponse.errorMSG('Enter email id');
        }

        if (!country_code) {
            return configResponse.errorMSG(`Enter phone number or select country code`);
        }

        setIsLoading(true);

        const data = {
            first_name,
            last_name,
            email,
            phone,
            country_code,
            dial_code
        }

        signUpRequest(data).then(async (response) => {
            setIsLoading(false);

            if (response?.status == 200 || response?.status == 201) {
                onChangeFirstName(null);
                onChangeLastName(null);
                onChangeEmail(null);
                onChangePhone(null);
                navigation.navigate('LoginOtpVerification',{ token :response?.data?.data?.token});
            } else {
                const resultError = response?.data?.errors?.validate;
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

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image}>
                <ScrollView contentContainerStyle={styles.scrollStyle}>

                    <View style={styles.container_child}>


                        <View style={styles.bottomLogoContainer}>
                            <Image
                                source={logo}
                                style={styles.bottomLogo}
                            />
                        </View>
                        <Spinner
                            visible={isLoading}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                        <Text style={styles.heading}>Sign up Now</Text>
                        <Text style={styles.text_dis}>Please Sign up to continue using our App</Text>

                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangeFirstName} value={first_name} placeholder="First Name" />

                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangeLastName} value={last_name} placeholder="Last Name" />

                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangeEmail} value={email} placeholder="Email" />

                        <PhoneInput
                            ref={phoneInput}
                            value={phone}
                            defaultCode="CA"
                            layout="first"
                            onChangeText={(text) => {
                                onChangePhone(text);
                            }}
                            onChangeFormattedText={(text) => {
                                setFormattedValue(text);
                            }}
                            containerStyle={styles.phoneContainerStyle}
                            textInputStyle={styles.textInputStyle}
                            codeTextStyle={styles.codeTextStyle}
                        />

                        <Pressable onPressIn={SignUpRequest} style={styles.SubmitButton}>
                            <Text style={styles.SubmitButtonText}>Sign Up</Text>
                        </Pressable>

                        <Pressable style={styles.signIn} onPress={() => navigation.navigate('Login')}  >
                            <Text style={styles.LinkButton}>Already have an account ? </Text>
                            <Text style={[styles.LinkButton, { fontWeight: "bold" }]}>Login</Text>
                        </Pressable>


                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    signIn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
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
        alignItems: 'center',
        justifyContent: 'center'
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
        marginBottom: 20,
        fontFamily: 'Inter_400Regular'
    },
    input: {
        width: 250,
        borderColor: '#ddd',
        backgroundColor: '#ffffff',
        height: 40,
        borderWidth: 1,
        marginBottom: 18,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 3,
        color: '#000000',
        fontSize: 14,
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
        width: 250,
        height: 40,
        padding: 7,
        backgroundColor: '#FFC000',
        borderRadius: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        marginTop: 20,
    },
    SubmitButtonText: {
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        fontWeight: "bold"
    },
    scrollStyle: {
        flex: 1,
        height: 'auto',
    },
    phoneContainerStyle: {
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 18,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 250,
        height: 40,
        borderRadius: 3
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
        color: '#000000',
        height: 20,
        top: -2
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});
