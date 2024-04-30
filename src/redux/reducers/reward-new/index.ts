import { rewardTypes as Type } from '../../types/reward';
import { userTypes } from '../../types/user';

const initialState = {
  data: null,
  loading: false,
  error: {},
};

const rewardNewReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Type.GET_REWARDS_NEW:
      return { ...state, error: {}, loading: true };

    case Type.GET_REWARDS_NEW_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case Type.GET_REWARDS_NEW_FAILURE:
      return {
        ...state,
        loading: false,
        data: {},
        error: action.error,
      };
    case Type.GET_REWARDS_FAILURE:
      return { ...state, data: null, loading: false, error: action.error };
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default rewardNewReducer;
