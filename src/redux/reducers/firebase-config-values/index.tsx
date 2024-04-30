import {fireBaseConfigType as Type} from '../../types/firebase-config-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const INITIAL_STATE = {
  is_force_update_android: false,
  exclude_restaurants: null,
  is_force_update_ios: false,
  ios_app_version: null,
  android_app_version: null,
  config: {},
};

const firebaseConfigValuesReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Type.SAVE_ANDROID_FORCE_UPDATE:
      return {...state, is_force_update_android: action.payload};
    case Type.SAVE_IOS_FORCE_UPDATE:
      return {...state, is_force_update_ios: action.payload};
    case Type.EXCLUDE_RESTAURANTS:
      return {...state, exclude_restaurants: action.payload};
    case Type.SAVE_ANDROID_VERSION_NUMBER:
      return {...state, android_app_version: action.payload};
    case Type.SAVE_IOS_VERSION_NUMBER:
      return {
        ...state,
        ios_app_version: action.payload,
      };
    case Type.SAVE_CONFIG:
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};

const fireBaseConfigReducerPersistConfig = {
  key: 'firebaseConfigValues',
  storage: AsyncStorage,
  whiteList: [
    'is_force_update_android',
    'exclude_restaurants',
    'is_force_update_ios',
    'ios_app_version',
    'android_app_version',
  ],
};

const persistedTokenReducer = persistReducer(
  fireBaseConfigReducerPersistConfig,
  firebaseConfigValuesReducer,
);
export default persistedTokenReducer;
