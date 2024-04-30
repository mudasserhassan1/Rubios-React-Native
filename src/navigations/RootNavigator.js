import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from '../utils/navigationUtils';
import {logNavigationToConsole} from '../configs';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import useAuthSelector from '../hooks/reduxStateHooks/useAuthSelector';
import useGuestSelector from '../hooks/reduxStateHooks/useGuestSelector';
import SplashScreen from 'react-native-splash-screen';
import {screens} from '../constants';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const routeNameRef = useRef(null);
  const onReady = () => {
    __DEV__ && (routeNameRef.current = navigationRef?.current?.getCurrentRoute?.()?.name);
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  };

  const handleStatusBarChanges = name => {
    switch (name) {
      case screens.ON_BOARDING_SCREEN:
      case screens.LAST_ONBOARDING:
      case screens.SIGN_IN:
      case screens.SIGNUP:
      case screens.MENU_CATEGORIES:
      case 'Home':
      case screens.MY_ORDERS:
      case screens.PAYMENT_METHODS:
      case screens.CART:
      case screens.CHECKOUT:
      case screens.MY_FAV_STORE:
      case screens.DELIVERY_ADDRESSES:
      case screens.MY_FAVOURITE:
      case screens.PROFILE:
        StatusBar.setBarStyle('dark-content');
        break;
      case screens.CHOOSE_ORDER_TYPE:
        StatusBar.setBarStyle('light-content');
        break;
      default:
        StatusBar.setBarStyle('dark-content');
    }
  };

  const onStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const {name, params} = navigationRef?.current?.getCurrentRoute?.() || {};
    handleStatusBarChanges(name);

    if (__DEV__) {
      if (previousRouteName !== name) {
        logNavigationToConsole(
          {
            PreviousScreen: previousRouteName,
            CurrentScreen: name,
            Params: params,
          },
          'NAVIGATION',
        );
      }
      routeNameRef.current = name;
    }
  };

  const {isLoggedIn, isLoading, isSocialSignup} = useAuthSelector();

  const {isGuest} = useGuestSelector();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {(isLoggedIn && !isLoading && !isSocialSignup) || isGuest ? ( //TODO: handling the social signup scenario after continuing as guest
            <Stack.Screen name={'App'} component={AppNavigator} />
          ) : (
            <Stack.Screen name="AuthStack" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
