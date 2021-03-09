import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = (props) => {
    return (
        <View style={styles.header}>
            <Text style={styles.text}>{props.title || 'Hello world!'}</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    header:{
        height: 60,
        backgroundColor:"darkslateblue",
        padding:15,
    },
    text:{
        color:'white',
        textAlign:'center',
        fontSize:30,
    },
});

export default Header
