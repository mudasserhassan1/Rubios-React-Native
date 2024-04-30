import {challengesType as Type} from '../../types/challenges';
import {userTypes} from '../../types/user';

const initialState = {
  challenges: null,
  challengeDetail: {},
  challengeDetailLoading: false,
};

const challengesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_CHALLENGES_SUCCESS:
      return {...state, challenges: action.payload?.punch_cards || {}};
    case Type.GET_CHALLENGE_DETAIL:
      return {...state, challengeDetailLoading: true};
    case Type.GET_CHALLENGE_DETAIL_SUCCESS:
      return {...state, challengeDetail: action.payload, challengeDetailLoading: false};
    case Type.GET_CHALLENGE_DETAIL_FAILURE:
      return {...state, challengeDetailLoading: false};
    case Type.CLEAR_CHALLENGE_DETAIL:
      return {...state, challengeDetail: null};
    case userTypes.USER_LOGOUT_SUCCESS:
    case userTypes.DELETE_USER_ACCOUNT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default challengesReducer;
