import * as React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native'
import * as SecureStore from 'expo-secure-store';
// package imports 
import moment from 'moment'
import Spinner from 'react-native-loading-spinner-overlay';
import { Root, Popup } from 'react-native-popup-confirm-toast'
// constants import 
import configResponse from '../config/constant'
// services imports 
import { getStaffById, getServiceById } from '../service/Staff'
import { BookApointment,MyBooking } from '../service/BookingService'
import {RootStateContext} from './../helper/RootStateContext'


function BookingConfirmation({ navigation, route }) {
    const {   setAppointmentData } = React.useContext(RootStateContext)

    const [AppLoading, setApploading] = React.useState(false)
    const [ArtistImage, setArtistImage] = React.useState(null)
    const [ArtistName, setArtistName] = React.useState(null)
    const [ArtistSelf, setArtistSelf] = React.useState(null)
    const [ServiceName, setServiceName] = React.useState(null)
    const [ServiceDuration, setServiceDuration] = React.useState(null)
    const [TimeSlot, setTimeSlot] = React.useState(null)

    const data = route?.params?.goNextValue

    React.useEffect(() => {
        const staff_id = `id=${data?.staff_id}`
        const service_id = `id=${data?.service_id}`
        const start_time = data?.start_time
        setApploading(true)
        getStaffById(staff_id).then((response) => {
            if (response.status == 200) {
                const output = response?.data
                setArtistName(output.name)
                setArtistSelf(output.about)
                setArtistImage({ uri: output.staff_profile })
                getServiceById(service_id).then((response) => {
                    if (response.status == 200) {
                        const serviceData = response?.data?.data
                        setServiceName(serviceData[0].name)
                        setServiceDuration(serviceData[0].duration)
                        const end_time = moment(start_time, 'hh:mm A').add(serviceData[0].duration.replace(' Minutes', ''), 'minutes').format('hh:mm A')
                        setTimeSlot(`${start_time} - ${end_time}`)
                        setApploading(false)
                    } else {
                        configResponse.errorMSG(response?.data?.message)
                    }
                }).catch((error) => {
                    configResponse.errorMSG(error.message)
                })
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }, [])


    function loadAppointments() {
        const data = { action: 'all' }
        MyBooking(data).then((response) => {
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



    const bookApointment = async () => {
        const bookingdata = {
            service_id: data?.service_id,
            date: data?.date,
            staff_id: data?.staff_id,
            start_time: data?.start_time
        }
        const userPhone = await SecureStore.getItemAsync('userPhone');
        if (!userPhone) {
            data.phone = true;
            configResponse.errorMSG('Please complete your profile.')
            navigation.navigate('Profile', { data })
            return
        }
        setApploading(true)
        BookApointment(bookingdata).then((response) => {
            if (response.status == 200) {
                setApploading(false)
                loadAppointments()
                Popup.show({
                    type: 'success',
                    title: 'Done',
                    textBody: response?.data?.message,
                    buttonText: 'Show Booking Details',
                    callback: () => {
                        Popup.hide();
                        navigation.navigate('UpcomingBooking');
                    }
                });
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }

    




    return (
        <Root style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <View style={styles.MasterView}>
                    <Spinner visible={AppLoading} textContent={'Please wait...'} textStyle={styles.spinnerTextStyle} />
                    <View style={styles.serviceCol}>
                        <View style={styles.outerBox}>
                            <View style={styles.picoutline}>
                                <Image resizeMode='contain' style={styles.pic} source={ArtistImage} />
                            </View>
                            <Text style={styles.userName}>{ArtistName}</Text>
                            <Text style={styles.textDis}>{ServiceName}</Text>
                            <Text style={styles.textDis}>{`Duration: ${ServiceDuration}`}</Text>

                            <Text style={styles.title}>Date/Time</Text>
                            <Text style={styles.textDis}>{moment(data.date).format("MMM DD, YYYY")}</Text>
                            <Text style={styles.textDis}>{TimeSlot}</Text>

                            <Text style={styles.title}>About Stylist</Text>
                            <Text style={styles.textDis}>{ArtistSelf}</Text>
                            <Pressable style={styles.button} onPressIn={bookApointment}>
                                <Text style={styles.buttonText}>Confirm Appointment</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Root>
    )
}

export default BookingConfirmation;

// StyleSheet 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FF'
    },
    MasterView: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingVertical: 20,
    },
    serviceCol: {
        width: '100%',
        height: 'auto',
        padding: 10
    },
    outerBox: {
        backgroundColor: '#fff08d',
        borderRadius: 15,
        padding: 10,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 40
    },
    scrollStyle: {
        height: 'auto'
    },
    pic: {
        height: 100,
        width: 100,
        borderRadius: 100
    },
    picoutline: {
        height: 110,
        width: 110,
        backgroundColor: "#ffffff",
        borderRadius: 110,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        overflow: 'hidden'
    },
    title: {
        fontSize: 17,
        fontFamily: 'Inter_700Bold',
        color: '#000000',
        marginTop: 15,
        marginBottom: 5,
        width: '100%',
        textAlign: 'center'
    },
    textDis: {
        fontSize: 14,
        fontFamily: configResponse.fontFamily,
        color: '#000000',
        marginTop: 1,
        marginBottom: 5,
        width: '100%',
        textAlign: 'center'
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#000000',
        marginTop: 15,
        marginBottom: 5,
        width: '100%',
        textAlign: 'center'
    },
    button: {
        backgroundColor: configResponse.primaryBackground,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginVertical: 10
    },
    buttonText: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: '#000000',
        marginTop: 1,
        marginBottom: 5,
        width: '100%',
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
    spinnerTextStyle: {
        color: '#FFF'
    }
});
