import {accountHistoryTypes as Type} from '../../types/account-hostory';
import {userTypes} from '../../types/user';

const initialState = {
  accountHistory: null,
  pointHistory: null,
  loading: false,
  error: null,
};

const accountHistoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Type.GET_ACCOUNT_HISTORY:
      return {...state, loading: true};
    case Type.GET_ACCOUNT_HISTORY_SUCCESS:
      return {
        ...state,
        accountHistory: action.payload,
        loading: false,
      };
    case Type.GET_POINT_HISTORY_SUCCESS:
      return {
        ...state,
        pointHistory: action.payload,
        loading: false,
      };
    case Type.GET_ACCOUNT_HISTORY_FAILURE:
      return {...state, error: action.error, loading: false};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {...initialState};
    default:
      return state;
  }
};

export default accountHistoryReducer;
