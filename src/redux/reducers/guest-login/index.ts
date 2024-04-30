import {userTypes} from '../../types/user';

const INITIAL_STATE = {
  isGuestLogin: false,
};

const guestLoginReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case userTypes.GUEST_USER_LOGIN:
      return {
        ...state,
        isGuestLogin: true,
      };
    case userTypes.USER_LOGIN:
      return {
        ...state,
        isGuestLogin: false,
      };
    default:
      return state;
  }
};

export default guestLoginReducer;
