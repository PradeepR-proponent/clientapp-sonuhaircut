import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, TextInput, Image } from 'react-native';
import Loader from '../helper/loader';
// services 
import { getService } from '../service/CategoryWiseService';
// constants 
import configResponse from '../config/constant';


function Service({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(false);
    const [getServiceData, setService] = useState([])

    function Item() {
        const itemdata = []

        for (const [key, value] of Object.entries(getServiceData)) {
            const image = { uri: value['image'] }
            itemdata.push(
                <View style={styles.serviceCol} key={value['id']}>
                    <Pressable onPressIn={() => navigation.navigate('Staff', { id: value['id'] })} style={[styles.SubUlgrid, styles.shadowProp]}>
                        <Image resizeMode='cover' style={styles.pic} source={image} />
                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={2}  >{value['name']}</Text>
                            <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text>
                            <Text style={[styles.duration, styles.bottomText]}>Duration: {value['duration']} </Text>
                        </View>
                    </Pressable>
                </View>
            );
        }

        return itemdata;
    }

    useEffect(() => {
        setIsLoading(true)
        const data = route.params.id
        getService(data).then((response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                const output = response?.data?.data
                setService(output);
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message);
        })
    }, [])

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

export default Service;

// stylesheet 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FF'
    },
    MasterView: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 20,
    },
    serviceCol: {
        width: '95%',
        height: 'auto',
        padding: 5,
        marginBottom: 5,
    },
    SubUlgrid: {
        borderRadius: 10,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        width: '100%'
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
    title: {
        fontSize: 15,
        fontFamily: configResponse.fontFamily,
        color: '#70757a',
        fontWeight: '700',
        marginBottom: 5,
        width: 200,
    },
    pic: {
        height: 80,
        width: 80,
        borderRadius: 6,
        marginRight: 20
    },
    bottomText: {
        fontSize: 13,
        fontFamily: configResponse.fontFamily,
        color: '#70757a'
    },
    scrollStyle: {
        height: 'auto'
    }
});