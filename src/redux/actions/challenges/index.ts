import {challengesType as Type} from '../../types/challenges';

export function getChallenges() {
  return {
    type: Type.GET_CHALLENGES,
  };
}

export function challengeSuccess(data: any) {
  return {
    type: Type.GET_CHALLENGES_SUCCESS,
    payload: data,
  };
}

export function challengeFailure(data: any) {
  return {
    type: Type.GET_CHALLENGES_FAILURE,
    payload: data,
  };
}

export function getChallengeDetail(id: any) {
  return {
    type: Type.GET_CHALLENGE_DETAIL,
    payload: id,
  };
}

export function getChallengeDetailSuccess(data: any) {
  return {
    type: Type.GET_CHALLENGE_DETAIL_SUCCESS,
    payload: data,
  };
}

export function challengeDetalFailure(data: any) {
  return {
    type: Type.GET_CHALLENGE_DETAIL_FAILURE,
    payload: data,
  };
}

export function clearChallengeDetails() {
  return {
    type: Type.CLEAR_CHALLENGE_DETAIL,
  };
}
