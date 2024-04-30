import React from 'react';

import {screens} from '../constants';
import LastOnbardingScreen from '../screens/OnBoardingScreen/LastOnbardingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import {Stack} from './RootNavigator';
import onBoardingScreen from '../screens/OnBoardingScreen/OnBoardingScreen';
import useNewUserSelector from '../hooks/reduxStateHooks/useNewUserSelector';
import {getHeaderTitle} from '@react-navigation/elements';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import CheckYourMail from '../screens/CheckYourMailScreen/CheckYourMail';
import ChooseStore from '../screens/ChooseStoreScreen/ChooseStore';

const AuthNavigator = () => {
  const {isOnBoarded = false} = useNewUserSelector();

  const renderHeader = ({navigation, route, options}) => {
    const title = getHeaderTitle(options, route.name);
    const {activeStep, backPress, loading, comingFromSideMenu} = route.params || {};

    const handleBackPress = () => {
      if (typeof backPress === 'function') {
        return backPress?.();
      }
      return navigation.goBack();
    };
    return (
      <ScreenHeader
        title={title}
        onBackPress={handleBackPress}
        // activeStep={
        //   parseInt(activeStep, 10) > 1 ? String(parseInt(activeStep, 10) - 1) : activeStep
        // }
        isLoading={loading}
        isComingFromSideMenu={comingFromSideMenu}
      />
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: renderHeader,
      }}>
      {!isOnBoarded ? (
        <Stack.Screen
          options={{headerShown: false}}
          name={screens.ON_BOARDING_SCREEN}
          component={onBoardingScreen}
        />
      ) : null}
      <Stack.Screen
        name={screens.LAST_ONBOARDING}
        component={LastOnbardingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.SIGN_IN}
        component={SignInScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.SIGNUP}
        component={SignupScreen}
        options={{swipeEnabled: false}}
      />
      <Stack.Screen
        name={screens.CHOOSE_STORE}
        component={ChooseStore}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{headerTitle: 'Reset Password'}}
      />
      <Stack.Screen
        name={screens.CHECK_YOUR_MAIL}
        component={CheckYourMail}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name={screens.RESET_PASSWORD}
        component={ResetPasswordScreen}
        options={{headerTitle: 'Reset Password'}}
      />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
