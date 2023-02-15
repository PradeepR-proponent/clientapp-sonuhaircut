import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    Image
} from "react-native";

// constants import
import configResponse from "../config/constant";

// images import 
import Logo from "../assets/images/logo.png";
import Background from '../assets/images/background/Hair_Salon_Stations.jpg';

export default function AboutUs() {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={Background} resizeMode="cover" style={styles.image}>
                <View style={styles.container_child}>
                    <Image source={Logo} style={styles.Logo} />
                    <Text style={styles.title}>About Sonu Hair Cut</Text>
                    <Text style={styles.Para}>Enhancing beauty since 1997, Sonu Haircut has developed a familiar and reliable industry brand. We are Surrey and Delta's go to beauty salon for waxing, Laser, Dermalase facials threading, hair styling, make-up and all kind Bridal and Non Bridal services, and so much more. We do all kind Home Services for Bridal. Rest assured you will walk out of Sonu Haircut feeling confident, looking beautiful, and party ready.</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

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
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingVertical: 20,
        paddingHorizontal: 30
    },
    image: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 22,
        fontFamily: 'Inter_700Bold',
        color: configResponse.primaryBackground,
        marginBottom: 10
    },
    Para: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: '#ffffff',
        width: '100%',
        textAlign: 'center'
    },
    Logo: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        marginBottom: 10
    }
});