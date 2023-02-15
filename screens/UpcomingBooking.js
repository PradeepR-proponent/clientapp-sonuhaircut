import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, Modal, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
// constants 
import configResponse from '../config/constant';
// services 
import { MyBooking, CancelApointment } from '../service/BookingService';
import { RootStateContext } from './../helper/RootStateContext'

function UpcomingBooking() {

    const { appointmentData, setAppointmentData } = React.useContext(RootStateContext)
    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [reason, setreason] = useState(null)
    const [cancelid, setCancelId] = useState(null)

    function UpcomingBooking() {
        const itemdata = []

        for (const [key, value] of Object.entries(appointmentData)) {
            if (value['status'] == 'pending') {
                const image = { uri: value['service_profile'] }
                itemdata.push(
                    <View style={styles.serviceCol} key={key}>
                        <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
                            <Image resizeMode='cover' style={styles.pic} source={image} />
                            <View style={styles.details}>
                                <Text style={styles.title}>{value['service']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Specialist: {value['staff_name']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Date: {value['date']}</Text>
                                <Text style={[styles.duration, styles.bottomText]}>Time: {`${value['start_time']} to ${value['end_time']}`} </Text>
                                <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text>

                            </View>
                            <Pressable
                                style={styles.CancelBookingButton}
                                onPress={
                                    () => {
                                        setModalVisible(true)
                                        setCancelId(value['id'])
                                    }
                                }>
                                <Text style={styles.CancelBookingText}>Cancel</Text>
                            </Pressable>
                        </Pressable>
                    </View>
                )
            }
        }

        if (itemdata.length < 1) {
            itemdata.push(
                <Text style={styles.errorBottomText}>No booking available.</Text>
            )
        }

        return itemdata;
    }

    function CancelBooking() {
        const itemdata = []

        for (const [key, value] of Object.entries(appointmentData)) {
            if (value['status'] == 'cancelled') {
                const image = { uri: value['service_profile'] }
                itemdata.push(
                    <View style={styles.serviceCol} key={"cancel" + value['id']}>
                        <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
                            <Image resizeMode='contain' style={styles.pic} source={image} />
                            <View style={styles.details}>
                                <Text style={styles.title}>{value['service']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Specialist: {value['staff_name']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Date: {value['date']}</Text>
                                <Text style={[styles.duration, styles.bottomText]}>Time: {`${value['start_time']} to ${value['end_time']}`} </Text>
                                <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text>
                            </View>
                        </Pressable>
                    </View>
                )
            }
        }

        if (itemdata.length < 1) {
            itemdata.push(
                <Text style={styles.errorBottomText}>No booking available.</Text>
            )
        }

        return itemdata;
    }

    function PreviousBooking() {
        const itemdata = []

        for (const [key, value] of Object.entries(appointmentData)) {
            if (value['status'] == 'complete') {
                const image = { uri: value['service_profile'] }
                itemdata.push(
                    <View style={styles.serviceCol} key={"complete" + value['id']}>
                        <Pressable style={[styles.SubUlgrid, styles.shadowProp]}>
                            <Image resizeMode='contain' style={styles.pic} source={image} />
                            <View style={styles.details}>
                                <Text style={styles.title}>{value['service']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Specialist: {value['staff_name']}</Text>
                                <Text style={[styles.time, styles.bottomText]}>Date: {value['date']}</Text>
                                <Text style={[styles.duration, styles.bottomText]}>Time: {`${value['start_time']} to ${value['end_time']}`} </Text>
                                <Text style={[styles.time, styles.bottomText]}>Price: ${value['price']}</Text>
                            </View>
                        </Pressable>
                    </View>
                )
            }
        }

        if (itemdata.length < 1) {
            itemdata.push(
                <Text style={styles.errorBottomText}>No booking available.</Text>
            )
        }

        return itemdata;
    }

    const cancelAppointment = () => {
        if (!reason) {
            configResponse.errorMSG("Please enter cancellation reason")
            return
        }

        if (!cancelid) {
            configResponse.errorMSG("Unexpected error please try again")
            setModalVisible(!modalVisible)
            return
        }

        const data = {
            booking_id: cancelid,
            remark: reason
        }
        setIsLoading(true)
        CancelApointment(data).then((response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                const output = response?.data
                configResponse.successMSG(output?.message)
                setreason(null)
                setModalVisible(!modalVisible);
                loadData()
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message);
        })
    }

    function loadData() {
        setIsLoading(true)
        const data = { action: 'all' }
        MyBooking(data).then((response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                const output = response?.data
                setAppointmentData(output)
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message);
        })
    }
    ``
    useEffect(() => {
        loadData()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <Spinner visible={isLoading} textContent={'Please wait...'} textStyle={styles.spinnerTextStyle} />
                <View style={styles.MasterView}>
                    <Text style={styles.Headingtitle} key="title1"> Upcoming Booking</Text>
                    <UpcomingBooking key="item1" />

                    <Text style={styles.Headingtitle} key="title2"> Previous Booking</Text>
                    <PreviousBooking key="item2" />

                    <Text style={styles.Headingtitle} key="title3"> Cancelled Booking</Text>
                    <CancelBooking key="item3" />

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.Headingtitle}>Enter Reason</Text>
                                <TextInput style={styles.input} multiline={true} onChangeText={setreason} value={reason} />
                                <View style={styles.cancelbottomdiv}>
                                    <Pressable onPress={cancelAppointment} style={styles.sendButton}>
                                        <Text style={styles.CancelBookingText}>Submit</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={
                                            () => {
                                                setModalVisible(!modalVisible);
                                                setreason(null)
                                            }
                                        }
                                        style={[styles.sendButton, styles.btndanger]}>
                                        <Text style={styles.CancelBookingText}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default UpcomingBooking;

// StyleSheet
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
        paddingHorizontal: 10
    },
    serviceCol: {
        width: '100%',
        height: 'auto',
        padding: 5,
        marginBottom: 5,
        position: "relative",
    },
    SubUlgrid: {
        borderRadius: 10,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        width: '100%',
        position: 'relative',
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
        color: '#000000',
        marginBottom: 5,
        width: '100%'
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
    scrollStyle: {
        height: 'auto'
    },
    CancelBookingButton: {
        backgroundColor: configResponse.primaryBackground,
        paddingHorizontal :7,
        borderRadius: 4,
        position:"absolute",
        right:5,
        bottom:5
    },
    sendButton: {
        backgroundColor: configResponse.primaryBackground,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 100,
        borderRadius: 4,
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
        marginLeft: 5,
    },
    btndanger: {
        backgroundColor: '#A40000',
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
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%'
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
    cancelbottomdiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    input: {
        width: "100%",
        borderColor: '#ddd',
        height: 100,
        marginBottom: 18,
        borderRadius: 2,
        color: '#000000',
        fontSize: 16,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingLeft: 10,
        fontFamily: configResponse.fontFamily
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});