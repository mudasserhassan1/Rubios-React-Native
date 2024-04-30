import {categoryActionsTypes} from '../../types/category';
import {userTypes} from '../../types/user';

const INITIAL_STATE = {
  loading: false,
  categories: null,
  productImages: {},
  error: {},
};

const categoryReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case categoryActionsTypes.GET_CATEGORY_ITMES_REQUEST:
      return {...state, loading: true, error: {}};
    case categoryActionsTypes.GET_CATEGORY_ITMES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
        error: {},
      };
    case categoryActionsTypes.GET_CATEGORY_ITMES_FAILURE:
      return {...state, loading: false, error: action.error};
    case categoryActionsTypes.SET_PRODUCT_IMAGES:
      return {...state, productImages: action.payload};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default categoryReducer;
