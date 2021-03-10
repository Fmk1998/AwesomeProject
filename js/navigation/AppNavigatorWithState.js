import React from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import RouteConfigs from "./RouteConfig";
import ScreenConfig from "./ScreenConfig";

export const AppNavigator = StackNavigator (RouteConfigs, ScreenConfig);

const AppNavigatorWithState = () => {

    return (
        <View style={{ flex: 1 }}>
            <AppNavigator/>
        </View>
    );

};
export default AppNavigatorWithState;
