import {authActionsTypes as Type} from '../../types/auth';
import {userTypes} from '../../types/user';

const INITIAL_STATE = {
  loading: false,
  authToken: null,
  error: {},
  iframeRedirect: false,
  deviceId: null,
  isGuestLogin: false,
};

const authReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case Type.GET_AUTHTOKEN_REQUEST:
      return {...state, loading: true};
    case Type.GET_AUTHTOKEN_SUCCESS:
      return {...state, loading: false, authToken: action.payload};
    case Type.GET_AUTHTOKEN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        iframeRedirect: false,
      };
    case Type.ADD_AUTH_TOKEN_IFRAME_REDIRECT:
      return {...state, iframeRedirect: true};
    case Type.REMOVE_AUTH_TOKEN_IFRAME_REDIRECT:
      return {...state, iframeRedirect: false};
    case Type.UPDATE_DEVICE_UNIQUE_ID:
      return {...state, deviceId: action.payload};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...INITIAL_STATE,
        deviceId: state.deviceId,
      };

    default:
      return state;
  }
};

export default authReducer;
