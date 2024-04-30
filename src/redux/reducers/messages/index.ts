import {messagesTypes as Type} from '../../types/messages';
import {userTypes} from '../../types/user';

const initialState = {
  messages: null,
  loading: false,
  error: null,
};

const messagesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Type.GET_MESSAGES:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case Type.GET_MESSAGES_SUCCESS:
      return {...state, loading: false, messages: action.payload?.messages || []};
    case Type.GET_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default messagesReducer;
