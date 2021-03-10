import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, PixelRatio, DeviceEventEmitter } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Theme from 'pretty-format';
import utils from '../../constants/utils';

const styles = StyleSheet.create({
    tabBar: {
        height: utils.isIphoneX() ? 60 : 45,
        borderTopColor: Theme.cLine,
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 0,
        borderBottomColor: 'white',
    },
    tabs: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabView: {
        backgroundColor: 'white',
    },
    countContainer: {
        position: 'absolute',
        top: 0,
        right: utils.widthPxTodp(10),
        // width: utils.widthPxTodp(16),
        // height: utils.widthPxTodp(16),
        minWidth: 16,
        borderRadius: 8,
        paddingHorizontal: 3,
        paddingVertical: 1,
        backgroundColor: Theme.cTheme,
        justifyContent: 'center',
        alignItems: 'center',
    },
    count: {
        color: '#ffffff',
        fontSize: 10,
    },
});

// tab页签配置项
const tabConfig = {
    tabBarBackgroundColor: Theme.cBack,
    tabBarPosition: 'bottom',
    locked: true,
    scrollWithoutAnimation: true,
    style: styles.tabView,
};

const TabsView = () => {
  return (
      <ScrollableTabView
          {...tabConfig}
          onChangeTab={this._onTabChanged}
          renderTabBar={() => (
              <ScrollableTabHeader
                  style={show ? styles.tabBar : { height: 0 }}
                  renderTab={this._renderTab}
                  noLine
                  fixedWidth
              />
          )}
      >
          {
              Object.keys(allTabRoutes).map((item) => {
                  const TempComponent = allTabRoutes[item].screen;
                  const { authCode } = allTabRoutes[item];
                  return (
                      <ApexAuthView
                          key={authCode}
                          tabLabel={item}
                      >
                          <TempComponent apexAuth={authCode} updateMark={item === 'Work' ? this._queryMarkData : () => {}} />
                      </ApexAuthView>
                  );
              })
          }
      </ScrollableTabView>
  )

}

export default TabsView
