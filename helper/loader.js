import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FadeLoading } from 'react-native-fade-loading';


function Loader(){       
    return (
        <>
            <FadeLoading style={[styles.box, { width: '45%' }]} />
            <FadeLoading style={styles.box} animated={false} />
            <FadeLoading style={styles.box} visible={false} />
            <FadeLoading style={styles.box} />
            <FadeLoading style={styles.box} />
        </>
    )
}

export default Loader;

const styles = StyleSheet.create({
    box: {
        width: '90%',
        height: 20,
        marginVertical: 5,
    }
});