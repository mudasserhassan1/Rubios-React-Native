import {userTypes as Type} from '../../types/user';
import {createFaveTypes} from '../../types/create-fave';

const initialState = {
  userProfile: null,
  userRecentOrders: null,
  userFavoriteOrders: null,
  userDeliveryAddresses: null,
  userDefaultDeliveryAddress: null,
  userBillingAccounts: null,
  userBillingAccountById: null,
  userGiftCards: null,
  updatedUserprofile: {
    data: null,
    passerror: {},
    passsuccess: 0,
  },
  loading: false,
  error: {},
  success: 0,
  profile: null,
  isAccessibilityOn: false,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // Case get requests
    case Type.GET_USER_RECENT_ORDERS:
    case Type.GET_USER_FAVORITE_ORDERS:
    case Type.GET_USER_DELIVERY_ADDRESSES:
    case Type.GET_USER_PROFILE:
    case Type.CHANGE_PASSWORD:
    case Type.UPDATE_USER:
    case Type.GET_BILLING_ACCOUNTS:
    case Type.GET_BILLING_ACCOUNT_BY_ID:
    case Type.GET_GIFT_CARDS:
    case Type.USER_FORGOT_PASSWORD_REQUEST:
    case Type.USER_RESET_PASSWORD_REQUEST:
      return {...state, loading: true};
    case Type.USER_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case Type.USER_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    //Success cases
    case Type.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        updatedUserprofile: {
          data: action.payload,
          error: null,
          passsuccess: 1,
        },
        error: null,
      };
    case Type.GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userProfile: action.payload,
        error: null,
      };
    case Type.GET_USER_RECENT_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        userRecentOrders: action.payload,
      };
    case Type.GET_USER_FAVORITE_ORDERS_SUCCESS:
    case createFaveTypes.CREATE_FAVE_SUCCESS:
      return {
        ...state,
        userFavoriteOrders: action.payload,
        loading: false,
      };
    case Type.GET_USER_DELIVERY_ADDRESSES_SUCCESS:
      return {
        ...state,
        userDeliveryAddresses: action.payload,
        loading: false,
      };
    case Type.SET_USER_DEF_DEL_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        userDefaultDeliveryAddress: action.payload,
      };
    case Type.DEL_USER_DEL_ADD_SUCCESS:
    case Type.DEL_FAV_ORDER_SUCCESS:
      return {
        ...state,
      };
    case Type.UPDATE_USER_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
        loading: false,
        error: null,
        success: 1,
      };
    case Type.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case Type.GET_BILLING_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        userBillingAccounts: action.payload,
      };
    case Type.GET_BILLING_ACCOUNT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        userBillingAccountById: action.payload,
      };
    case Type.DELETE_BILLING_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case Type.UPDATE_BILLING_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        // userBillingAccounts: action.payload,
      };
    case Type.GET_GIFT_CARDS_SUCCESS:
      return {
        ...state,
        loading: false,
        userGiftCards: action.payload,
      };

    // error cases
    case Type.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        success: 0,
        updatedUserprofile: {
          ...state.updatedUserprofile,
          passerror: action.payload,
          passsuccess: 0,
        },
      };
    case Type.GET_USER_RECENT_ORDERS_FAILURE:
    case Type.GET_USER_FAVORITE_ORDERS_FAILURE:
    case Type.GET_USER_PROFILE_FAILURE:
    case Type.GET_USER_DELIVERY_ADDRESSES_FAILURE:
    case Type.SET_USER_DEFAULT_DEL_ADD_FAILURE:
    case Type.DEL_USER_DEL_ADD_FAILURE:
    case Type.UPDATE_USER_FAILURE:
    case Type.GET_BILLING_ACCOUNTS_FAILURE:
    case Type.GET_BILLING_ACCOUNT_BY_ID_FAILURE:
    case Type.DELETE_BILLING_ACCOUNTS_FAILURE:
    case Type.UPDATE_BILLING_ACCOUNTS_FAILURE:
    case Type.GET_GIFT_CARDS_FAILURE:
    case Type.DEL_FAV_ORDER__FAILURE:
    case Type.USER_FORGOT_PASSWORD_FAILURE:
    case Type.USER_RESET_PASSWORD_FAILURE:
    case createFaveTypes.CREATE_FAVE_FAILURE:
      return {...state, loading: false, error: action.error, success: 0};
    case Type.DELETE_USER_ACCOUNT:
      return {
        ...state,
        loading: true,
      };
    case Type.USER_LOGOUT_SUCCESS:
      return {
        userProfile: null,
        userRecentOrders: null,
        userFavoriteOrders: null,
        userDeliveryAddresses: null,
        userDefaultDeliveryAddress: null,
        userBillingAccounts: null,
        userBillingAccountById: null,
        userGiftCards: null,
        updatedUserprofile: {
          data: null,
          passerror: {},
          passsuccess: 0,
        },
        loading: false,
        error: {},
        success: 0,
        profile: null,
      };
    case Type.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...initialState,
        loading: false,
      };
    case Type.DELETE_USER_ACCOUNT_FAILURE:
      return {...state, loading: false, error: action.error, success: 0};
    case Type.GET_USER_ACCESSIBILTY_STATUS:
      return {...state, isAccessibilityOn: action.payload};
    default:
      return state;
  }
};

export default userReducer;
