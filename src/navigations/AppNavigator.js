import {screens} from '../constants';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import MyRewardScreen from '../screens/MyRewardScreen';
import Account from '../screens/Account';
import DeliveryAddress from '../screens/DeliveryAddress';
import Profile from '../screens/Profile';
import RewardQrcode from '../screens/RewardQrcode';
import CheckIn from '../screens/CheckIn';
import AccountHistory from '../screens/AccountHistory';
import InviteFriends from '../screens/InviteFriends';
import React from 'react';
import SignInScreen from '../screens/SignInScreen';
import ChallengeDetail from '../screens/ChallengeDetail';
import OrderFeedback from '../screens/OrderFeedback';
import UnderDevScreen from '../screens/UnderDevelopment';
import AuthNavigator from './AuthNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeStackNavigator from './HomeStackNavigator';

const AppNavigator = () => {
  const {top} = useSafeAreaInsets();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: top + 90,
        },
        headerShown: false,
      }}>
      <>
        <Stack.Screen name={screens.HOME_SCREEN} component={HomeStackNavigator} />
        <Stack.Screen name={screens.RESET_PASSWORD} component={ResetPasswordScreen} />
        <Stack.Screen name={screens.REWARDS} component={MyRewardScreen} />
        <Stack.Screen name={screens.ACCOUNT} component={Account} />
        <Stack.Screen name={screens.DELIVERY_ADDRESSES} component={DeliveryAddress} />
        <Stack.Screen name={screens.PROFILE} component={Profile} />
        <Stack.Screen
          name={screens.REWARD_QR_CODE}
          component={RewardQrcode}
          options={{headerShown: false, presentation: 'formSheet'}}
        />
        <Stack.Screen name={screens.CHECK_IN} component={CheckIn} />
        <Stack.Screen name={screens.ACCOUNT_HISTORY} component={AccountHistory} />
        <Stack.Screen name={screens.INVITE_FRIENDS} component={InviteFriends} />
        <Stack.Screen name={screens.CHALLENGE_DETAIL} component={ChallengeDetail} />
        <Stack.Screen name={screens.ORDER_FEEDBACK} component={OrderFeedback} />
        <Stack.Screen name={screens.SIGN_IN} component={SignInScreen} />
        <Stack.Screen name={'AuthStack'} component={AuthNavigator} />
        <Stack.Screen
          name={screens.UNDER_DEV_SCREEN}
          component={UnderDevScreen}
          options={{headerTitle: '', headerShown: true}}
        />
      </>
    </Stack.Navigator>
  );
};
export default AppNavigator;
