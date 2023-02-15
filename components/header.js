import * as React from "react"
import { View, StyleSheet, Platform, Linking, Share } from "react-native"
import {
    Avatar,
    Title,
    Caption,
    Drawer
} from 'react-native-paper'
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from "@react-navigation/drawer"
import Icon from 'react-native-vector-icons/Feather'
import {AuthContext} from '../helper/AuthContext'
import * as SecureStore from 'expo-secure-store';
import configResponse from '../config/constant';
import {ShowProfile, UpdateProfileData, UpdateProfile} from "../service/MyProfile";


function HeaderDrawerMenu(props) {

    const { signOut } = React.useContext(AuthContext)
    const [UserName, setName] = React.useState(null)
    const [UserEmail, setEmail] = React.useState(null)
    const [UserPic, setProfile] = React.useState(null)

    global.GOOGLE_PACKAGE_NAME = 'com.sonuhaircut';
    global.APPLE_STORE_ID = 'id284882215';
   
    const openStore = () => {
        if (Platform.OS != 'ios') {
          Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
            alert('Please check for the Google Play Store'),
          );
        } else {
          Linking.openURL(
            `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`,
          ).catch(err => alert('Please check for the App Store'));
        }
    };

    const ShareApp = async () => {
        let text =
          "Want more styles to try for your hair ? Let's make your lifestyle get more eyeballs..Download Sonuhaircut App ";
        let url = "https://play.google.com/store/apps/details?id=com.sonuhaircut";
        if (Platform.OS === 'android') {
          text = text.concat(
            'https://play.google.com/store/apps/details?id=com.sonuhaircut',
          );
        } else {
          text = text.concat(
            'https://apps.apple.com/ca/app/sonu-hair-cut/id1505076368',
          );
          url = "https://apps.apple.com/ca/app/sonu-hair-cut/id1505076368";
        }
        try {
          const result = await Share.share(
            {
              message: text,
              subject: 'Download Sonuhaircut App Now',
              url: url,
              title: 'Sonu Hair Cut , Style for lifestyle',
            },
            {
              // Android only:
              dialogTitle: 'Share SonuhairCut App',
            },
          );
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
            } else {
            }
          } else if (result.action === Share.dismissedAction) {
          }
        } catch (error) {
          alert(error.message);
        }
    };
     
    
const getProfile=()=>{
    ShowProfile().then( async (response) => {
        if(response.status == 200){
            const output = response?.data
            const pic =  output['pic']
            setProfile(pic)
            setEmail(output['email'])
            setName(`${output['first_name']} ${output['last_name']}`)
        }else{
            signOut()
        }
    }).catch( (error) => {
        configResponse.errorMSG(error.message)
    })
}

React.useEffect(()=>{
getProfile()
},[props])


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexWrap:"wrap", justifyContent:"center", flexDirection: "row", marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: UserPic,
                                }}
                                size={80}
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <View
                                style={{
                                    marginLeft: 15,
                                    flexDirection: "column",
                                    width: '100%'
                                }}
                            >
                                <Title style={styles.title}>{UserName}</Title>
                                <Caption style={styles.caption}>{UserEmail}</Caption>
                            </View>
                        </View>
                    </View> 

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="home"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => {
                                props.navigation.navigate("Home");
                            }}
                        />
                        
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="check-circle"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="My Appointment"
                            onPress={() => {
                                props.navigation.navigate("UpcomingBooking");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="alert-circle"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="About Us"
                            onPress={() => {
                                props.navigation.navigate("AboutUs");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="message-circle"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Contact Us"
                            onPress={() => {
                                props.navigation.navigate("Contact");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="send"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Feedback"
                            onPress={() => {
                                props.navigation.navigate("Feedback");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="user"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="My Profile"
                            onPress={() => {
                                props.navigation.navigate("Profile");
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="settings"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => {
                                props.navigation.navigate("SettingsScreen");
                            }}
                        />  
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="share-2"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Share"
                            onPress={ShareApp}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="star"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Rate Us"
                            onPress={openStore}
                        />                      
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="power" color={color} size={size} />
                    )}
                    label="Sign Out"
                    onPress={signOut}
                />
            </Drawer.Section>
        </View>
    )
}

export default HeaderDrawerMenu

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingBottom:15,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold",
        fontFamily: configResponse.fontFamily,
        textAlign: "center"
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontFamily: configResponse.fontFamily,
        textAlign: "center",
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    paragraph: {
        fontWeight: "bold",
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    avatar:{
        backgroundColor: 'transparent',
    }
});
