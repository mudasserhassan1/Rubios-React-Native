import {providerActionsTypes as Type} from '../../types/provider';
import {userTypes} from '../../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const INITIAL_STATE = {
  loading: false,
  providerToken: null,
  error: {},
};

const provider = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Type.GET_PROVIDER_REQUEST:
    case userTypes.USER_LOGIN_REQUEST:
    case userTypes.USER_REGISTER_REQUEST:
    case userTypes.USER_REGISTER_APPLE:
    case userTypes.USER_FACEBOOK_REQUEST:
      return {...state, loading: true, error: {}};
    case Type.GET_PROVIDER_SUCCESS:
      return {
        ...state,
        loading: false,
        providerToken: action.payload,
      };
    case userTypes.USER_LOGIN_SUCCESS:
    case userTypes.USER_REGISTER_SUCCESS:
    case userTypes.USER_REGISTER_APPLE_SUCCESS:
      return {...state, loading: false, providerToken: action.payload};
    case Type.GET_PROVIDER_FAILURE:
    case userTypes.USER_LOGIN_FAILURE:
      return {...state, loading: false, error: action.error};
    case userTypes.USER_REGISTER_FAILURE:
    case userTypes.USER_REGISTER_APPLE_FAILURE:
      return {...state, loading: false, error: action.error};
    case userTypes.CLEAR_PROVIDER_ERROR:
      return {...state, error: {}};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        loading: false,
        providerToken: null,
        error: {},
      };
    default:
      return state;
  }
};
const providerPersistConfig = {
  key: 'provider',
  storage: AsyncStorage,
  whitelist: ['providerToken'],
};
const providerReducer = persistReducer(providerPersistConfig, provider);
export default providerReducer;
