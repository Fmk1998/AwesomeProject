import React from 'react';
import {View, Text, StyleSheet,FlatList} from 'react-native';

const Welcome = (props) => {

     /**
       * 付民康  2021/3/10
       * desc: 点击事件-执行导航路由跳转
       * @params
       **/
     const buttonClick = () => {
         props.navigation.navigate('Todo')
     }


    return (
        <View tabLabel="page1" style={styles.container}>
            <Text onPress={buttonClick} style={styles.text}>每一天都不同</Text>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    },
    text: {
        color: 'blue',
        fontSize: 30,
    }
});

export default Welcome;
