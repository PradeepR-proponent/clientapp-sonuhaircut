import * as React from 'react';
// dependencies 
import moment from 'moment';
import CalendarStrip from "swipeable-calendar-strip-react-native";
import Loader from '../helper/loader';
import { View, Text, StyleSheet,FlatList, ScrollView, SafeAreaView, Pressable, TouchableHighlight, Image } from 'react-native';
// services 
import { getStaff, getSlot } from '../service/Staff';
// constants 
import configResponse from '../config/constant';
import { AppStateContext } from '../helper/AppStateContaxt';


function TimeSlot({ navigation, route }) {
    const { location } = React.useContext(AppStateContext)
    const [selectDate, setDateSelect] = React.useState(false)
    const [selectStaff, setStaffSelect] = React.useState(false)
    const [goNext, setgoNext] = React.useState(false)
    const [goNextValue, setgoNextValue] = React.useState(null)
    const [getStaffData, setStaff] = React.useState([])
    const [getSlotData, setSlot] = React.useState([])
    const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'))
    const [staff, setStaffId] = React.useState(null)
    const [selectedSlot, setselectedSlot] = React.useState(null)
    const [selectedArtist, setselectedArtist] = React.useState(null)

    const service = route.params.id


    function pressDay(day) {
        const date = moment(day).format('YYYY-MM-DD')
        setDate(date)
        const data = `location=${location.id}&service_id=${service}&date=${date}`

        getStaff(data).then((response) => {
            if (response.status == 200) {
                const output = response?.data?.data
                setStaff(output)
                setDateSelect(true)
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }


    function FindStaff() {
        const itemData = []

        for (const [key, value] of Object.entries(getStaffData)) {
            const image = { uri: value['profile'] }
            itemData.push(
                <Pressable key={value['id']} style={[styles.staff, selectedArtist == value['id'] ? styles.staffActive : '']} onPressIn={() => { PressStaff(value['id']) }}>
                    <Image resizeMode='cover' style={styles.pic} source={image} />
                    <Text style={styles.bottomText}>{value['name']}</Text>
                </Pressable>
            )
        }

        if (itemData.length < 1) {
            configResponse.errorMSG('No specialist available')
            itemData.push(
                <Text key={1}>No specialist available</Text>
            )
        }

        return itemData
    }

    function PressStaff(id) {
        setStaffId(id)
        setselectedArtist(id)
        const data = {
            staff_id: id,
            service_id: service,
            date: date
        }
        getSlot(data).then((response) => {
            if (response.status == 200) {
                const output = response?.data
                setSlot(output);
                setStaffSelect(true)
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }

    function FindSlot(id) {
        const itemData = []

        for (let key = 0; key < getSlotData.length; key++) {
            itemData.push(
                <Pressable key={key} onPressIn={() => { pressSlot(getSlotData[key]) }} style={[styles.slotButton, selectedSlot === getSlotData[key] ? styles.slotButtonActive : '']}>
                    <Text style={[styles.slotText, selectedSlot === getSlotData[key] ? styles.slotTextActive : '']}>{getSlotData[key]}</Text>
                </Pressable>
            );
        }

        if (itemData.length < 1) {
            configResponse.errorMSG('No slot available')
            itemData.push(
                <Text key={1}>No slot available</Text>
            )
        }

        return itemData
    }

    function pressSlot(slot) {
        setselectedSlot(slot)
        const data = {
            'service_id': service,
            'date': date,
            'staff_id': staff,
            'start_time': slot
        }
        setgoNextValue(data)
        setgoNext(true)
    }

    React.useEffect(() => {
        const data = `location=${location.id}&service_id=${service}&date=${date}`
        getStaff(data).then((response) => {
            if (response.status == 200) {
                const output = response?.data?.data
                setStaff(output)
                setDateSelect(true)
            } else {
                configResponse.errorMSG(response?.data?.message)
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        });
    }, [date,service,location])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.MasterScroll} contentContainerStyle={styles.scrollStyle}>
                <CalendarStrip style={styles.CalenderStyle} headerText={styles.HeaderStyle} dateNameStyle={styles.NameStyle} dateNumberStyle={styles.NumberStyle} dayPressed={(day) => { pressDay(day) }} activeDayBorderColor='black' />
                <View style={styles.MasterView}>
                    {selectDate ? (
                        <View>
                            <Text style={styles.title}>Select Specialist</Text>
                            <FlatList
                                horizontal
                                data={getStaffData}
                                renderItem={({item}) => <Pressable key={item.id} style={[styles.staff, selectedArtist == item.id ? styles.staffActive : '']} onPressIn={() => { PressStaff(item.id) }}>
                                    <Image resizeMode='cover' style={styles.pic} source={{ uri: item.profile }} />
                                    <Text style={styles.bottomText}>{item.name}</Text>
                                </Pressable>}
                                keyExtractor={(item) => item.name}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    ) : (
                        <Loader />
                    )}
                    {selectStaff ? (
                        <>
                            <Text style={styles.title}>Available Slots</Text>
                            <View style={styles.SlotBox}>
                                <FindSlot />
                            </View>
                        </>
                    ) : null}
                </View>
            </ScrollView>
            {goNext ? (
                <View style={styles.nextButtonView}>
                    <TouchableHighlight onPress={() => { navigation.navigate('Booking', { goNextValue }) }} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableHighlight>
                </View>
            ) : (<Text></Text>)}
        </SafeAreaView>
    )
}

export default TimeSlot;

// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FF'
    },
    MasterScroll: {
        paddingBottom: 60
    },
    MasterView: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    staff: {
        width: 100,
        height: 'auto',
        overflow: 'hidden',
        marginRight: 5,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    pic: {
        width: 70,
        height: 70,
        borderRadius: 70,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    title: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: '#000000',
        marginTop: 15,
        marginLeft: 5,
        marginBottom: 15,
        fontWeight: '500',
        width: '100%'
    },
    bottomText: {
        fontSize: 14,
        fontFamily: configResponse.fontFamily,
        color: '#70757a',
        textAlign: 'center',
        marginTop: 10
    },
    staffActive: {
        borderColor: configResponse.primaryBackground
    },
    scrollStyle: {
        height: 'auto'
    },
    SlotBox: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    slotButton: {
        width: '30%',
        height: 'auto',
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    slotText: {
        textAlign: 'center',
        color: '#000000',
        fontSize: 14,
        fontFamily: configResponse.fontFamily,
    },
    slotButtonActive: {
        backgroundColor: configResponse.primaryBackground
    },
    slotTextActive: {
        color: '#000000'
    },
    CalenderStyle: {
        backgroundColor: configResponse.primaryBackground,
        padding: 10,
        height: 120,
        width: '100%',
        paddingBottom: 20
    },
    HeaderStyle: {
        fontFamily: configResponse.fontFamily,
        fontWeight: '500',
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 15
    },
    NameStyle: {
        fontFamily: configResponse.fontFamily,
        fontSize: 13,
        color: '#ffffff',
    },
    NumberStyle: {
        fontFamily: configResponse.fontFamily,
        fontSize: 14,
        color: '#ffffff'
    },
    horizontalScroll: {
        height: 'auto',
        width: '100%',
        flexDirection: 'column',
        borderWidth: 1
    },
    normalColor: {
        color: '#ffffff',
        fontFamily: configResponse.fontFamily,
        fontSize: 14,
    },
    highlightDateNumberContainer: {
        backgroundColor: configResponse.primaryBackground,
        color: '#000'
    },
    highlightColor: {
        backgroundColor: configResponse.primaryBackground,
        color: '#fff'
    },
    nextButtonView: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
        zIndex: 1,
    },
    nextButton: {
        backgroundColor: configResponse.primaryBackground,
        padding: 10,
        width: 150,
        borderRadius: 5,
        marginHorizontal: 'auto',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    nextButtonText: {
        textAlign: 'center',
        color: '#000000',
        fontSize: 14,
        fontFamily: configResponse.fontFamily
    }
});
