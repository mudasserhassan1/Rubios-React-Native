import {Stack} from './RootNavigator';
import {screens} from '../constants';
import ChooseOrderType from '../screens/ChooseOrderTypeScreen/ChooseOrderType';
import MenuCategories from '../screens/MenuCategories/MenuCategories';
import MenuScreen from '../screens/MenuScreen';
import ProductScreen from '../screens/ProductScreen';
import HomeScreen from '../screens/HomeScreen';
import React from 'react';
import MyRewardScreen from '../screens/MyRewardScreen';
import AuthNavigator from './AuthNavigator';
import UnderDevScreen from '../screens/UnderDevelopment';
import ScreenHeader from '../components/ScreenHeader/ScreenHeader';
import Cart from '../screens/CartScreen';
import DeliveryFlow from '../screens/DeliveryFlow';
import CheckoutScreen from '../screens/CheckoutScreen';
import MyFavStore from '../screens/MyFavStore';
import RewardsOnboarding from '../screens/RewardsOnboarding';
import PaymentMethodScreen from '../screens/PaymentMethods';
import DeliveryStatus from '../screens/DeliveryStatus';
import ScanReciept from '../screens/ScanReciept';
import MyOrders from '../screens/MyOrders';
import MyOrderDetail from '../screens/MyOrders/MyOrderDetail';
import MyFavouriteOrders from '../screens/MyFavouriteOrders';
import Notifications from '../screens/NotificationsScreen/Notifications';
import AccountHistory from '../screens/AccountHistory';
import ChooseStore from '../screens/ChooseStoreScreen/ChooseStore';

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.CHOOSE_ORDER_TYPE}
        component={ChooseOrderType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.MENU_CATEGORIES}
        component={MenuCategories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.DELIVERY_FLOW}
        component={DeliveryFlow}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.CHOOSE_STORE}
        component={ChooseStore}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.MENU}
        component={MenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.DELIVERY_STATUS}
        component={DeliveryStatus}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={screens.SCAN_RECIEPT}
        component={ScanReciept}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.ACCOUNT_HISTORY}
        component={AccountHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen name={screens.CART} component={Cart} options={{headerShown: false}} />
      <Stack.Screen
        name={screens.PRODUCT}
        component={ProductScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name={'AuthStack'} component={AuthNavigator} options={{headerShown: false}} />
      <Stack.Screen
        name={screens.CHECKOUT}
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.MY_FAV_STORE}
        component={MyFavStore}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={screens.REWARDS_ONBOARDING}
        component={RewardsOnboarding}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.REWARDS}
        component={MyRewardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.PAYMENT_METHODS}
        component={PaymentMethodScreen}
        options={{header: ({route}) => <ScreenHeader route={route} title={'Payment Methods'} />}}
      />
      <Stack.Screen
        name={screens.MY_ORDERS}
        component={MyOrders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.MY_ORDER_DETAIL}
        component={MyOrderDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.MY_FAVOURITE}
        component={MyFavouriteOrders}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screens.NOTIFICATIONS}
        component={Notifications}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={screens.UNDER_DEV_SCREEN}
        component={UnderDevScreen}
        options={{headerTitle: '', headerShown: true}}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
