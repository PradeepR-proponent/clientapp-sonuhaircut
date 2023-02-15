import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Pressable, TextInput } from 'react-native';
// packages import 
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Spinner from 'react-native-loading-spinner-overlay';
// images import 
import Background from '../assets/images/background/Hair_Salon_Stations.jpg';
// constants import 
import configResponse from '../config/constant';
// services imports
import { NewPasswordRequest } from '../service/User';

function NewPassword({ navigation }) {
    const [new_password, onChangePassword] = React.useState(null)
    const [confirm_password, onChangeConfirmPassword] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false);

    let [fontsLoaded] = useFonts({
        Inter_400Regular, Inter_700Bold
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const NewPasswordClick = () => {
        if (!new_password) {
            configResponse.errorMSG('Please enter new password')
            return
        }

        if (!confirm_password) {
            configResponse.errorMSG('Please enter confirm password')
            return
        }

        if (new_password != confirm_password) {
            configResponse.errorMSG('Password and confirm password mismatch')
            return
        }

        const data = { new_password, confirm_password }
        setIsLoading(true)

        NewPasswordRequest(data).then((response) => {
            setIsLoading(false)
            if (response.status == 200) {
                onChangePassword(null)
                onChangeConfirmPassword(null)
                configResponse.successMSG(response.data.message)
            } else {
                configResponse.errorMSG(response.data.errors)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        });

    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image}>
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.container_child}>
                    <View style={styles.container_mid}>
                        <Text style={styles.heading}>New Password </Text>
                        <Text style={styles.text_dis}>You can reset your password here</Text>

                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangePassword} value={new_password} placeholder="New Password" secureTextEntry={true} />
                        <TextInput style={styles.input} placeholderTextColor="#000000" onChangeText={onChangeConfirmPassword} value={confirm_password} placeholder="Confirm Password" secureTextEntry={true} />

                        <Pressable onPressIn={NewPasswordClick} style={styles.SubmitButton}>
                            <Text style={styles.SubmitButtonText}>Create New Password</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate('Login')}  >
                            <Text style={styles.LinkButton}>Back to login</Text>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default NewPassword;

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
        marginBottom: 10,
        fontFamily: 'Inter_400Regular'
    },
    input: {
        width: 340,
        borderColor: '#ddd',
        backgroundColor: '#ffffff',
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
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        marginTop: 20,
    },
    SubmitButtonText: {
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'Inter_400Regular',
        fontSize: 16
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});
