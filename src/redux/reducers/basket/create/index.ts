import {basketActionsTypes} from '../../../types/basket';
import {userTypes} from '../../../types/user';

const INITIAL_STATE = {
  loading: false,
  basket: null,
  error: null,
  selectingSameOptions: [],
};

const createBasketReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case basketActionsTypes.SET_BASKET_REQUEST:
    case basketActionsTypes.CREATE_BASKET_FROM_PREV_ORDER_REQUEST:
    case basketActionsTypes.CREATE_BASKET_FROM_FAV_ORDER_REQUEST:
      return {...state, loading: true, basket: null, error: null};

    case basketActionsTypes.RESET_BASKET_REQUEST:
      return {
        ...state,
        basket: null,
        selectingSameOptions: [],
      };
    case basketActionsTypes.SET_BASKET_SUCCESS:
    case basketActionsTypes.CREATE_BASKET_FROM_PREV_ORDER_SUCCESS:
    case basketActionsTypes.CREATE_BASKET_FROM_FAV_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        basket: action.payload,
        error: null,
      };
    case basketActionsTypes.SET_BASKET_FAILURE:
    case basketActionsTypes.CREATE_BASKET_FROM_PREV_ORDER_FAILURE:
    case basketActionsTypes.CREATE_BASKET_FROM_FAV_ORDER_FAILURE:
      return {...state, loading: false, error: action.error};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {...INITIAL_STATE};
    case basketActionsTypes.SET_SELECTING_SAME_OPTIONS:
      return {
        ...state,
        selectingSameOptions: action.payload,
      };
    default:
      return state;
  }
};

export default createBasketReducer;
