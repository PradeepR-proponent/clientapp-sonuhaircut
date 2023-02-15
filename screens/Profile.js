import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Pressable,
    TextInput,
    Image,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from '../helper/AuthContext';
import { Dropdown } from "react-native-element-dropdown";
import { ShowProfile, UpdateProfileData, UpdateProfile } from "../service/MyProfile";
import Spinner from 'react-native-loading-spinner-overlay';
// constants 
import configResponse from "../config/constant";



const data = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
];

function Profile({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(false)
    const [image, setImage] = React.useState(null);
    const { signOut } = React.useContext(AuthContext)
    const [first_name, onChangeFirstName] = React.useState(null)
    const [last_name, onChangeLastName] = React.useState(null)
    const [email, onChangeEmail] = React.useState(null)
    const [gender, onChangegender] = React.useState('male')
    const [phone, onChangePhone] = React.useState('');

    function myProfileLoad() {
        setIsLoading(true)
        ShowProfile().then(async (response) => {
            setIsLoading(false)
            if (response.status == 200) {
                const output = response?.data
                const pic = { uri: output['pic'] }
                onChangeFirstName(output['first_name'])
                onChangeLastName(output['last_name'])
                onChangegender(output['gender'])
                onChangeEmail(output['email'])
                onChangePhone(output['phone'])
                setImage(pic)
            } else {
                signOut()
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }

    React.useEffect(() => {
        myProfileLoad()
    }, [])


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.cancelled) {
            // uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', '')
            const profile = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            UpdateProfile(profile).then((response) => {
                if (response?.status == 200) {
                    myProfileLoad()
                    configResponse.successMSG("Profile Updated !")
                } else if (response?.status == 404) {
                    configResponse.errorMSG('Image not found')
                } else {
                    configResponse.errorMSG('Unexpected error occurred while uploading profile')
                }
            }).catch((error) => {
                configResponse.errorMSG(error.message)
            })
        }
    }

    const UpdateMyProfile = () => {
        if (!first_name) {
            configResponse.errorMSG('Please enter first name')
            return
        }

        if (!last_name) {
            configResponse.errorMSG('Please enter last name')
            return
        }

        if (!email) {
            configResponse.errorMSG('Please enter email id.')
            return
        }

        if (!gender) {
            configResponse.errorMSG('Please select your gender')
            return
        }

        if (!phone) {
            return configResponse.errorMSG(`Enter phone number`);
        }

        const data = { first_name, last_name, email, gender, phone }
        setIsLoading(true)
        UpdateProfileData(data).then(async (response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                configResponse.successMSG("Profile Updated !")
                await SecureStore.setItemAsync('userPhone', phone)
                const goNextValue = route?.params?.data;
                if (goNextValue?.phone) {
                    navigation.navigate('Booking', { goNextValue })
                }
            } else {
                configResponse.errorMSG('Please fill all required fields.')
            }
        }).catch((error) => {
            configResponse.errorMSG(error.message)
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.headerBacground}>
                    <View style={styles.picoutline}>
                        <Image
                            resizeMode="cover"
                            style={styles.pic}
                            source={image}
                        />
                    </View>
                    <Pressable onPressIn={pickImage}>
                        <Text style={styles.userName}>Edit Photo</Text>
                    </Pressable>
                </View>
                <View style={styles.MasterView}>
                    <View style={styles.serviceCol}>
                        <View style={styles.from}>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="user"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="First Name"
                                    value={first_name}
                                    onChangeText={onChangeFirstName}
                                />
                            </View>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="user"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="Last Name"
                                    value={last_name}
                                    onChangeText={onChangeLastName}
                                />
                            </View>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="at-sign"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="Email Id"
                                    value={email}
                                    onChangeText={onChangeEmail}
                                />
                            </View>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="phone"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="Contact No."
                                    value={phone}
                                    onChangeText={onChangePhone}
                                />
                            </View>
                            <View style={styles.from_group}>
                                <Dropdown
                                    style={[
                                        styles.input
                                    ]}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    iconStyle={styles.iconStyle}
                                    data={data}
                                    maxHeight={110}
                                    labelField="label"
                                    valueField="value"
                                    value={gender}
                                    onChange={(item) => {
                                        onChangegender(item.value);
                                    }}
                                    renderLeftIcon={() => (
                                        <Icon
                                            style={styles.icon}
                                            color='#70757a'
                                            name="user-plus"
                                            size={16}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                        <Pressable onPressIn={UpdateMyProfile} style={styles.button} disabled={isLoading}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Profile;


// StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    MasterView: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    serviceCol: {
        width: "100%",
        padding: 10,
    },
    scrollStyle: {
        height: "auto",
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden'
    },
    userName: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: 'black',
        marginTop: 15,
        marginBottom: 5,
        width: "100%",
        textAlign: "center",
        fontWeight: "bold"
    },
    from: {
        marginVertical: 10,
    },
    from_group: {
        position: "relative",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: "#70757a",
    },
    input: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: "#70757a",
        width: "100%",
        paddingLeft: 35,
        paddingBottom: 5
    },
    icons: {
        position: "absolute",
        left: 5,
        top: 6,
    },
    icon: {
        position: "absolute",
        left: -25,
        top: 6,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: "#70757a",
        paddingLeft: 5,
        paddingBottom: 5,
    },
    button: {
        backgroundColor: '#FFD700',
        width: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 5,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: configResponse.fontFamily,
        color: "black",
        marginTop: 1,
        marginBottom: 5,
        width: "100%",
        textAlign: "center",
    },
    headerBacground: {
        backgroundColor: '#FFD700',
        padding: 20
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});
