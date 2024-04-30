import {restaurantActionsTypes} from '../../types/restaurant';
import {userTypes} from '../../types/user';

const INITIAL_STATE = {
  loading: false,
  restaurant: null,
  orderType: '',
  error: {},
};

const restaurantInfoReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case restaurantActionsTypes.GET_RESTAURANT_INFO_REQUEST:
      return {...state, loading: true, restaurant: null, error: {}};
    case restaurantActionsTypes.GET_RESTAURANT_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurant: action.payload,
        error: {},
      };
    case restaurantActionsTypes.GET_RESTAURANT_INFO_FAILURE:
      return {...state, loading: false, error: action.error};
    case restaurantActionsTypes.SET_RESTAURANT_INFO_ORDER_TYPE:
      return {...state, orderType: action.payload};
    case restaurantActionsTypes.SET_RESTAURANT_INFO_REQUEST:
      return {
        ...state,
        loading: true,
        restaurant: null,
        orderType: '',
        error: {},
      };
    case restaurantActionsTypes.SET_RESTAURANT_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurant: action.payload,
        orderType: action.orderType,
        error: {},
      };
    case restaurantActionsTypes.SET_RESTAURANT_INFO_FAILURE:
      return {...state, loading: false, error: action.error};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default restaurantInfoReducer;
