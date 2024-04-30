import {newUserType as Type} from '../../types/newUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import { userTypes } from "../../types/user";

const initialState = {
  newUser: false,
  userViewedWelcomeScreen: false,
  isOnBoarded: false,
  userViewedRewardsOnBoarded: false,
};

const newUserReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Type.NEW_USER_SUCCESS:
      return {...state, newUser: action.payload};
    case Type.USER_VIEWED_WELCOME_SCREEN:
      return {...state, userViewedWelcomeScreen: action.payload};
    case Type.SET_ONBOARDED:
      return {...state, isOnBoarded: action.payload};
    case Type.SET_REWARDS_ONBOARDED:
      return {...state, userViewedRewardsOnBoarded: action.payload};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        newUser: false,
        userViewedWelcomeScreen: false,
      };
    default:
      return state;
  }
};

const newUserPersistConfig = {
  key: 'newUser',
  storage: AsyncStorage,
};
const newUserPersistReducer = persistReducer(newUserPersistConfig, newUserReducer);
export default newUserPersistReducer;
