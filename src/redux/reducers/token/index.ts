import {tokenActionsTypes as Type} from '../../types/token';
import {userTypes} from '../../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const INITIAL_STATE = {
  loading: false,
  accessToken: null,
  fcmToken: null,
  error: {},
};

const tokenReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Type.GET_TOKEN_REQUEST:
      return {...state, loading: true};
    case Type.GET_TOKEN_SUCCESS:
      return {...state, loading: false, accessToken: action.payload};
    case Type.GET_TOKEN_FAILURE:
      return {...state, loading: false, error: action.error};
    case Type.GET_FCM_TOKEN_SUCCESS:
      return {
        ...state,
        fcmToken: action.payload,
      };
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        loading: false,
        accessToken: null,
        fcmToken: null,
        error: {},
      };
    default:
      return state;
  }
};

const tokenReducerPersistConfig = {
  key: 'token',
  storage: AsyncStorage,
  whiteList: ['accessToken'],
};

const persistedTokenReducer = persistReducer(tokenReducerPersistConfig, tokenReducer);
export default persistedTokenReducer;
