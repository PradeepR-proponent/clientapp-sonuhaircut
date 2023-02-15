import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
} from "react-native";

// packages 
import * as SecureStore from 'expo-secure-store';
import Loader from "../helper/loader";
import Icon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
// constants 
import configResponse from "../config/constant";
// services 
import { AllLocation } from "../service/Location";
import { AppStateContext } from "../helper/AppStateContaxt";


export default function Location() {

    const { locationModal, setLocationModal, location, setLocations } = React.useContext(AppStateContext)
    const [isLoading, setIsLoading] = useState(false);
    const [getLocation, setLocation] = useState([]);
    const [modalLocation, setModalLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(1);

    async function selectLocation(loc) {
        await SecureStore.setItemAsync("location", `${loc.id}`)
        // await SecureStore.setItemAsync("ModalLocation", 'false')
        setLocations(loc)
        setModalLocation(false)
        setLocationModal(!locationModal)
    }

    function Item() {
        const itemdata = [];
        for (const [key, value] of Object.entries(getLocation)) {
            itemdata.push(
                <Pressable
                    key={value["id"]}
                    onPressIn={() => selectLocation(value)}
                    style={[styles.SubUlgrid, styles.shadowProp, location.id == value["id"] ? styles.SubUlgridActive : '']}
                >
                    {/* <Ionicons size={18} name="location-outline" style={styles.icons} color={ configResponse.primaryBackground}  /> */}
                    <Entypo size={18} name="location" style={styles.icons} color={userLocation == value["id"] ? "#ffffff" : configResponse.primaryBackground} />
                    <Text style={[styles.locationName, userLocation == value["id"] ? styles.locationNameActive : '']}>{value["name"]}</Text>
                </Pressable>
            );
        }
        return itemdata
    }

    // const closeModel = async () => {
    //     await SecureStore.setItemAsync("ModalLocation", 'false')
    //     setModalLocation(false)
    // }

    useEffect(() => {
        const getData = () => {
            configResponse.userLocation().then((response) => {
                setUserLocation(response)
            })
            setIsLoading(true)
            AllLocation().then((response) => {
                setIsLoading(false)
                if (response?.status == 200) {
                    const output = response?.data?.data
                    setLocation(output)
                }
            }).catch((error) => {
                configResponse.errorMSG(error.message);
            });
        }

        getData();

    }, []);


    useEffect(() => {
        if (getLocation.length) {
            const loc = getLocation.find((l) => userLocation == l.id)
            setLocations(loc)
        }
    }, [getLocation])


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={locationModal}
            onRequestClose={() => {
                setLocationModal(!locationModal);
            }}
        >

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <Pressable onPressIn={() => setLocationModal(!locationModal)} style={styles.closeModel}>
                                <Icon style={styles.LeftIcon} name='x-circle'></Icon>
                            </Pressable>
                            <Item />
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

// StyleSheet
const styles = StyleSheet.create({
    SubUlgrid: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    icons: {
        marginRight: 8
    },
    locationName: {
        fontFamily: configResponse.fontFamily,
        fontSize: 14,
        color: '#000000'
    },
    SubUlgridActive: {
        backgroundColor: configResponse.primaryBackground
    },
    locationNameActive: {
        color: '#ffffff'
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
    bottomText: {
        fontSize: 13,
        fontFamily: configResponse.fontFamily,
        color: '#70757a'
    },
    Headingtitle: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: '#000000',
        fontWeight: '400',
        marginBottom: 5,
        width: '100%'
    },
    errorBottomText: {
        fontSize: 14,
        fontFamily: configResponse.fontFamily,
        color: '#70757a',
        marginBottom: 10
    },
    CancelBookingText: {
        color: '#ffffff',
        fontFamily: configResponse.fontFamily,
        fontSize: 14,
        textAlign: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000a8'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#ffffff',
        minHeight: 300,
        borderRadius: 5,
        paddingVertical: 30,
        width: '80%',
        position: 'relative'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    closeModel: {
        width: 30,
        height: 30,
        textAlign: "center",
        justifyContent: "center",
        alignItems: 'center',
        position: 'absolute',
        top: -10,
        right: -6,
        borderRadius: 30
    },
    LeftIcon: {
        fontFamily: configResponse.fontFamily,
        fontSize: 26,
        color: '#ffffff',
        backgroundColor: configResponse.primaryBackground,
        borderRadius: 26,
    }
});
