import {newUserType as Type} from '../../types/newUser';

export function newUserSuccess(data: boolean) {
  return {
    type: Type.NEW_USER_SUCCESS,
    payload: data,
  };
}

export function userViewedWelcomeScreen(data: boolean) {
  return {
    type: Type.USER_VIEWED_WELCOME_SCREEN,
    payload: data,
  };
}

export function setIsOnBoarded(data: boolean) {
  return {
    type: Type.SET_ONBOARDED,
    payload: data,
  };
}

export function setIsRewardsOnBoarded(data: boolean) {
  return {
    type: Type.SET_REWARDS_ONBOARDED,
    payload: data,
  };
}
