import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import footer from './footer';
import category from './category';
import user from './user';
import reward from './reward';
import rewardNew from './reward-new';
import token from './token';
import Tokens from './Tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import restaurantInfo from './restaurant';
import location from './location';
import restaurantCalendar from './restaurant/calendar';
import productOptions from './product/option';
import productSelections from './product/selections';
import modifiersImages from './product/images';
import provider from './provider';
import auth from './auth';
import restaurantList from './restaurant/list';
import createBasket from './basket/create';
import basket from './basket';
import addProduct from './basket/product/add';
import removeProduct from './basket/product/remove';
import checkIn from './check-in';
import updateProduct from './basket/product/update';
import favRestaurant from './restaurant/fav-restaurant';
import accountHistory from './account-history';
import pageState from './page-state';
import redemption from './redemption';
import addUpsell from './basket/upsell/add';
import getUpsells from './basket/upsell/get';
import getRewardForCheckout from './reward/checkout';
import applyRewardOnBasket from './reward/checkout/apply';
import removeRewardFromBasket from './reward/checkout/remove';
import order from './order';
import guest from './guest-user';
import guestLogin from './guest-login';
import navigateApp from './navigate-app';
import deliveryAddress from './location/delivery-address';
import verifyDeliveryAddress from './location/verify-delivery-address';
import utensils from './basket/utensils';
import rewardLocked from './reward-locked-new';
import basketTransferReducer from './basket/transfer';
import newUser from './newUser';
import challenges from './challenges';
import offers from './offers';
import messagesReducer from './messages';
import firebaseConfig from './firebase-config-values';
import modalSheetStatus from './modalSheetStatus';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['provider'],
  whitelist: [
    // 'restaurantInfo',
    'basket',
    'auth',
    'token',
    'user',
    'provider',
    'redemption',
    'pageState',
    'getUpsells',
    'guest',
    'navigateApp',
    'deliveryAddress',
    'utensils',
    'modifiersImages',
    'newUser',
    'firebaseConfig',
  ],
};

const rootReducers = combineReducers({
  token,
  Tokens,
  category,
  footer,
  user,
  reward,
  rewardNew,
  rewardLocked,
  utensils,
  restaurantInfo,
  location,
  restaurantCalendar,
  productOptions,
  provider,
  auth,
  restaurantList,
  createBasket,
  basket,
  order,
  guest,
  basketTransferReducer,
  // addMultipleProducts,
  addProduct,
  removeProduct,
  checkIn,
  updateProduct,
  favRestaurant,
  accountHistory,
  pageState,
  redemption,
  addUpsell,
  getUpsells,
  getRewardForCheckout,
  applyRewardOnBasket,
  removeRewardFromBasket,
  navigateApp,
  deliveryAddress,
  verifyDeliveryAddress,
  guestLogin,
  productSelections,
  modifiersImages,
  newUser,
  challenges,
  offers,
  messagesReducer,
  firebaseConfig,
  modalSheetStatus,
});

const persistReducers = persistReducer(persistConfig, rootReducers);

export default persistReducers;
