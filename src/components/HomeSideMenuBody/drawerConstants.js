import MyRewardsGuestIcon from '../../assets/svgs/MyRewardsGuestIcon';
import {screens, strings} from '../../constants';
import MyFavouritesGuestIcon from '../../assets/svgs/MyFavouritesGuestIcon';
import MyRewardsSmallIcon from '../../assets/svgs/MyRewardsSmallIcon';
import MyOrdersSmallIcon from '../../assets/svgs/MyOrdersSmallIcon';
import MyFavouriteSmallIcon from '../../assets/svgs/MyFavouriteSmallIcon';
import RubiosBagSmallIcon from '../../assets/svgs/RubiosBagSmallIcon';
import RubisBagLargeIcon from '../../assets/svgs/RubisBagLargeIcon';
import React from 'react';
import QRCodeSideBarIcon from "../../assets/svgs/QRCodeSideBarIcon";

export const drawerKeys = {
  account: 'account',
  profile: 'profile',
  refer: 'refer',
  contact: 'contact',
  nutrition: 'nutrition',
  faq: 'faq',
  logout: 'logout',
};

export const drawerRows = {
  [drawerKeys.account]: {title: 'Create an Account', key: 'account'},
  [drawerKeys.profile]: {title: 'Profile & Settings', key: 'profile'},
  [drawerKeys.refer]: {title: 'Refer a Friend', key: 'refer'},
  [drawerKeys.contact]: {title: 'Contact Us', key: 'contact'},
  [drawerKeys.nutrition]: {title: 'Nutrition Info', key: 'nutrition'},
  [drawerKeys.faq]: {title: 'FAQs', key: 'faq'},
  [drawerKeys.logout]: {title: 'Log Out', key: 'logout'},
};

export const drawerLowerDataGuest = [
  drawerRows[drawerKeys.account],
  drawerRows[drawerKeys.contact],
  drawerRows[drawerKeys.faq],
];

export const drawerLowerDataUser = [
  drawerRows[drawerKeys.profile],
  drawerRows[drawerKeys.refer],
  drawerRows[drawerKeys.contact],
  drawerRows[drawerKeys.nutrition],
  drawerRows[drawerKeys.faq],
  drawerRows[drawerKeys.logout],
];

export const modalKeys = {
  REWARDS: 'rewards',
  ORDERS: 'orders',
  FAVOURITES: 'favourites',
  ACCOUNT: 'account',
  PROFILE: 'profile',
  REFER: 'refer',
  CONTACT: 'contact',
  NUTRITION: 'nutrition',
  FAQ: 'faq',
  LOGOUT: 'logout',
  SCAN: 'scan',
};

export const drawerData = [
  {
    title: 'My Rewards & Challenges',
    key: modalKeys.REWARDS,
    Image: () => <MyRewardsSmallIcon />,
  },
  {
    title: 'My Orders',
    key: modalKeys.ORDERS,
    Image: ({isGuest}) => (isGuest ? <RubiosBagSmallIcon /> : <MyOrdersSmallIcon />),
  },
  {
    title: 'My Favorites',
    key: modalKeys.FAVOURITES,
    Image: () => <MyFavouriteSmallIcon />,
  },
  {
    title: 'Forgot to Scan at Register?',
    key: modalKeys.SCAN,
    Image: () => <QRCodeSideBarIcon />,
  },
];

export const COLLAPSE_ABLE_KEYS = {
  ADDRESS: 'address',
  FAV_STORE: 'store',
  PAYMENT: 'payment',
  MY_PROFILE: 'myProfile'
}
export const collapseAbleMeta = [
  {
    title: 'Delivery Address',
    key: COLLAPSE_ABLE_KEYS.ADDRESS,
    screen: screens.DELIVERY_ADDRESSES,
    analyticsLabel: 'delivery_address',
  },
  {
    title: 'Favorite Restaurant',
    key: COLLAPSE_ABLE_KEYS.FAV_STORE,
    screen: screens.MY_FAV_STORE,
    analyticsLabel: 'favorite_store',
  },
  {
    title: 'Payment Methods',
    key: COLLAPSE_ABLE_KEYS.PAYMENT,
    screen: screens.PAYMENT_METHODS,
    analyticsLabel: 'payment_methods',},
  {
    title: 'My Profile',
    key: COLLAPSE_ABLE_KEYS.MY_PROFILE,
    screen: screens.PROFILE,
    analyticsLabel: 'profile_&_settings',
  },
];

export const modalDataObj = {
  [modalKeys.REWARDS]: {
    Image: () => <MyRewardsGuestIcon />,
    text: strings.my_Rewards_chanllenges,
    subtitle: strings.guest_login_modal_text,
    key: modalKeys.REWARDS,
    screen: screens.REWARDS,
    destination: 'Rewards & Challenges Screen',
  },
  [modalKeys.ORDERS]: {
    Image: () => <RubisBagLargeIcon />,
    text: strings.my_orders,
    subtitle: strings.guest_login_modal_text_my_orders,
    key: modalKeys.ORDERS,
    screen: screens.MY_ORDERS,
    destination: 'My Orders Screen',
  },
  [modalKeys.FAVOURITES]: {
    Image: () => <MyFavouritesGuestIcon />,
    text: strings.my_fav,
    subtitle: strings.guest_login_modal_text_my_fav,
    key: modalKeys.FAVOURITES,
    screen: screens.MY_FAVOURITE,
    destination: 'My Favorites Orders Screen',
  },
  [modalKeys.SCAN]: {
    key: modalKeys.SCAN,
  },
};
