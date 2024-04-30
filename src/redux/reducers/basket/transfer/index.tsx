import {basketActionsTypes} from '../../../types/basket';
import {userTypes} from '../../../types/user';

const INITIAL_STATE = {
  loading: false,
  data: null,
  error: null,
};

const basketTransferReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case basketActionsTypes.BASKET_TRANSFER_REQUEST:
      return {...state, loading: true, data: null, error: null};
    case basketActionsTypes.BASKET_TRANSFER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload || null,
        error: null,
      };
    case basketActionsTypes.BASKET_TRANSFER_FAILURE:
      return {...state, data: null, loading: false, error: action.error};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
    case basketActionsTypes.BASKET_TRANSFER_RESET:
      return {...state, loading: false, data: null, error: null};
    default:
      return state;
  }
};

export default basketTransferReducer;
