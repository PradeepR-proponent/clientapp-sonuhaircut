import * as React from 'react';
import Root from './helper/Root'
import { StyleSheet, View, Text } from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import Loader from './helper/loader';

function App() {

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_700Bold,
    'primary_font': require('./assets/fonts/WorkSans-Regular.ttf')
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    )
  } else {
    return (
      <Root />
    )
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 40,
  },
  box: {
    width: '90%',
    height: 20,
    marginVertical: 5,
  },
});