import {productOptionActionsTypes} from '../../../types/product/option';
import {userTypes} from '../../../types/user';

const INITIAL_STATE = {
  loading: false,
  options: null,
  expandedModifiers: {},
  checkedModifiers: {},
  error: {},
};

const productOptionsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case productOptionActionsTypes.GET_PRODUCT_OPTION_REQUEST:
      return {...state, loading: true, options: null, error: {}};
    case productOptionActionsTypes.GET_PRODUCT_OPTION_SUCCESS:
      return {...state, loading: false, options: action.payload, error: {}};
    case productOptionActionsTypes.GET_PRODUCT_OPTION_FAILURE:
      return {...state, loading: false, error: action.error};
    case productOptionActionsTypes.SET_EXPANDED_MODIFIERS:
      return {...state, expandedModifiers: {...state.expandedModifiers, ...action.payload}};
    case productOptionActionsTypes.RESET_EXPANDED_MODIFIERS:
      return {...state, expandedModifiers: {}};
    case productOptionActionsTypes.SET_CHECKED_MODIFIERS:
      return  {...state, checkedModifiers: action.payload};
    case productOptionActionsTypes.RESET_CHECKED_MODIFIERS:
      return {...state, checkedModifiers: action.payload};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
    case productOptionActionsTypes.RESET_PRODUCT_OPTIONS:
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
};

export default productOptionsReducer;
