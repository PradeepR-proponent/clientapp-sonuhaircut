import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, Image } from 'react-native';
// dependecies imports  
import * as SecureStore from 'expo-secure-store';
import { TextInput } from 'react-native-paper';
import Icon from '../assets/images/icons/icons-feedback.png';
import axios from "axios";
// constants 
import configResponse from '../config/constant';

export default function Feedback() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [name, setName] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [phone, setPhone] = React.useState(null);
    const [message, setMessage] = React.useState(null);
    const [nameError, setNameError] = React.useState(false)
    const [emailError, setEmailError] = React.useState(false)
    const [phoneError, setPhoneError] = React.useState(false)
    const [messageError, setMessageError] = React.useState(false)

    function reset() {
        setNameError(false)
        setEmailError(false)
        setPhoneError(false)
        setMessageError(false)
        setName(null)
        setEmail(null)
        setPhone(null)
        setMessage(null)
    }

    const submitContact = async () => {
        if (!name) {
            setNameError(true)
            configResponse.errorMSG("Please enter your name")

            return
        }

        if (!email) {
            setEmailError(true)
            configResponse.errorMSG("Please enter your email")

            return
        }

        if (!phone) {
            setPhoneError(true)
            configResponse.errorMSG("Please enter your phone ")

            return
        }

        if (!message) {
            configResponse.errorMSG("Please enter your message ")

            setMessageError(true)
            return
        }

        const data = { name, email, phone, message }
        setIsLoading(true)

        try {
            const token = SecureStore.isAvailableAsync('userToken') ? await SecureStore.getItemAsync('userToken') : null
            await axios.post(`${configResponse.baseURL}/auth/contact`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                setIsLoading(false)
                configResponse.successMSG(response?.data?.message);
                reset()
            })
        } catch (error) {
            setIsLoading(false)
            if (error?.response?.status == 400) {
                const output = error?.response?.data?.message
                for (const [key, value] of Object.entries(output)) {
                    configResponse.errorMSG(value[0])
                }
            } else if (error?.response?.status == 500) {
                configResponse.errorMSG(error?.response?.data?.message)
            } else {
                configResponse.errorMSG("Some error found please try again later")
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <View style={styles.container_child}>
                    <Image source={Icon} style={styles.icon} />
                    <TextInput
                        label="Name"
                        value={name}
                        mode="outlined"
                        outlineColor="#e6f6f6"
                        activeOutlineColor={configResponse.primaryColor}
                        onChangeText={text => setName(text)}
                        left={<TextInput.Icon color={configResponse.primaryColor} name="eye" />}
                        style={styles.InputBox}
                        error={nameError}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        mode="outlined"
                        outlineColor="#e6f6f6"
                        activeOutlineColor={configResponse.primaryColor}
                        onChangeText={text => setEmail(text)}
                        left={<TextInput.Icon color={configResponse.primaryColor} name="mail" />}
                        style={styles.InputBox}
                        error={emailError}
                    />
                    <TextInput
                        label="Phone"
                        value={phone}
                        mode="outlined"
                        outlineColor="#e6f6f6"
                        activeOutlineColor={configResponse.primaryColor}
                        onChangeText={text => setPhone(text)}
                        left={<TextInput.Icon color={configResponse.primaryColor} name="phone" />}
                        style={styles.InputBox}
                        error={phoneError}
                    />
                    <TextInput
                        label="Message"
                        value={message}
                        mode="outlined"
                        outlineColor="#e6f6f6"
                        activeOutlineColor={configResponse.primaryColor}
                        onChangeText={text => setMessage(text)}
                        left={<TextInput.Icon color={configResponse.primaryColor} name="message" />}
                        style={styles.InputBox}
                        multiline={true}
                        error={messageError}
                    />
                    <Pressable onPressIn={submitContact} style={styles.SubmitButton} disabled={isLoading}>
                        {(isLoading) ? (
                            <Text style={styles.SubmitButtonText}>Please wait ...</Text>
                        ) : (<Text style={styles.SubmitButtonText}>Submit</Text>)}
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f6f6',
        flexDirection: 'row',
        alignItems: 'center'
    },

    container_child: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        position: 'relative'
    },

    InputBox: {
        borderColor: configResponse.primaryColor,
        borderBottomWidth: 1,
        backgroundColor: '#e6f6f6',
        borderRadius: 8,
        padding: 1
    },

    SubmitButton: {
        width: 200,
        padding: 10,
        backgroundColor: configResponse.primaryBackground,
        borderRadius: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20,
        marginTop: 20,
    },

    SubmitButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: '#000000',
        marginBottom: 5
    },

    scrollStyle: {
        height: 'auto',
    },

    icon: {
        resizeMode: 'cover',
        height: 90,
        width: 90,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});
