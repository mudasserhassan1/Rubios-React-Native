import {modalSheetType as Type} from '../../types/modalSheetStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const INITIAL_STATE = {
  is_home_side_bar_modal_opened: false,
  is_user_as_qr_code_modal_opened: false,
};

const modalSheetStatusReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Type.HOME_SIDE_BAR_MENU_SHEET:
      return {...state, is_home_side_bar_modal_opened: action.payload};
    case Type.USER_AS_QR_CODE_SHEET:
      return {...state, is_user_as_qr_code_modal_opened: action.payload};
    default:
      return state;
  }
};

const modalSheetStatusReducerPersistConfig = {
  key: 'modalSheetStatus',
  storage: AsyncStorage,
  blacklist: ['is_home_side_bar_modal_opened', 'is_user_as_qr_code_modal_opened'],
};

const persistedTokenReducer = persistReducer(
  modalSheetStatusReducerPersistConfig,
  modalSheetStatusReducer,
);
export default modalSheetStatusReducer;
