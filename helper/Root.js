import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginOtpVerificationRequest, userLogout } from '../service/User';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './AuthContext'
// constants 
import configResponse from '../config/constant';
// stacks 
import StackMenu from '../screens/StackMenu';
import DrawerMenu from '../screens/DrawerMenu';

export default function Root({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    }

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data,token) => {
        loginOtpVerificationRequest(data,token).then(async (response) => {
          if (response?.status == 200 || response?.status == 201) {
            await SecureStore.setItemAsync('userToken', response?.data?.data?.token)
            await SecureStore.setItemAsync('userName', `${response?.data?.data?.first_name} ${response?.data?.data?.last_name}`)
            await SecureStore.setItemAsync('userEmail', response?.data?.data?.email)
            await SecureStore.setItemAsync('userPic', response?.data?.data?.profile)
            await SecureStore.setItemAsync('userPhone', response?.data?.data?.phone)
            dispatch({ type: 'SIGN_IN', token: response?.data?.data?.token })
          } else if (response?.status == 401) {
            navigation.navigate('AccountVerify', { useremail: email });
          } else if (response?.status == 400 || response?.status == 500) {
            configResponse.errorMSG(response.data.errors);
          } else {
            const resultError = response?.data?.errors?.validate;
            let errorlist = '';
            for (const [key, value] of Object.entries(resultError)) {
              errorlist += `${value}\n`;
            }
            configResponse.errorMSG(errorlist);
          }
        }).catch((error) => {
          configResponse.errorMSG(error.message);
        });
      },
      signOut: () => {
        userLogout()
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <StackMenu />
        ) : (
          <DrawerMenu />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
