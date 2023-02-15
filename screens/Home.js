import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, TextInput, Image } from 'react-native';
import Loader from '../helper/loader';
// constants imports 
import configResponse from '../config/constant';
import { AuthContext } from '../helper/AuthContext'
// images imports/
import Icon1 from '../assets/images/icons/icon-1.png';
import Icon2 from '../assets/images/icons/icon-2.png';
import Icon3 from '../assets/images/icons/icon-3.png';
import Icon4 from '../assets/images/icons/icon-4.png';
import Icon5 from '../assets/images/icons/icon-5.png';
import Icon6 from '../assets/images/icons/icon-6.png';
import Icon7 from '../assets/images/icons/icon-7.png';
import Icon8 from '../assets/images/icons/icon-8.png';
import Icon9 from '../assets/images/icons/icon-9.png';
// services 
import { getCategory } from '../service/CategoryWiseService';

function Home({ navigation }) {
    const [isLoading, setIsLoading] = useState(false)
    const [getCategoryData, setCategory] = useState([])
    const { signOut } = React.useContext(AuthContext)

    function Item() {
        const itemdata = []
        const itemIcon = {
            'Haircut & Beard': Icon1,
            'Men Color Hair & Beard': Icon2,
            'Threading': Icon3,
            'Body Wax': Icon4,
            'Perming/Curls': Icon5,
            'Smooth & Straight Hairs': Icon6,
            'Girl Hair cut & Styling': Icon7,
            'Facial': Icon8,
            'Wig & Patch': Icon9
        }

        for (const [key, value] of Object.entries(getCategoryData)) {
            itemdata.push(
                <View style={styles.serviceCol} key={value['id']}>
                    <Pressable onPressIn={() => navigation.navigate('Service', { id: value['id'] })} style={[styles.SubUlgrid, styles.shadowProp]}>
                        <Image resizeMode='cover' source={itemIcon[value['name']] ?? Icon1} />
                        <Text style={styles.SubLigrid}>{value['name']}</Text>
                    </Pressable>
                </View>
            );
        }

        return itemdata
    }

    useEffect(() => {
        setIsLoading(true)
        getCategory().then((response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                const output = response?.data?.data
                setCategory(output);
            } else {
                configResponse.errorMSG(response?.data?.message)
                signOut()
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        });
        return () => {
            setIsLoading(false)
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <View style={styles.MasterView}>
                    {!isLoading ? (
                        <Item />
                    ) : (
                        <Loader />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    MasterView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 20,
    },
    serviceCol: {
        width: '50%',
        height: 'auto',
        padding: 5,
        marginBottom: 10,
    },
    SubUlgrid: {
        borderRadius: 20,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 135,
        width: 135,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
    },
    SubLigrid: {
        fontSize: 13,
        fontFamily: configResponse.fontFamily,
        color: '#70757a',
        marginTop: 15,
        textAlign: 'center'
    },
    scrollStyle: {
        height: 'auto'
    }
});