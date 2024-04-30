import {call, put, takeEvery} from 'redux-saga/effects';
import {getChallengeDetail, getChallenges} from '../../../services/chaallenges';
import {
  challengeDetalFailure,
  challengeFailure,
  challengeSuccess,
  getChallengeDetailSuccess,
} from '../../actions/challenges';
import {challengesType} from '../../types/challenges';

function* asyncGetChallenges(): any {
  try {
    const response = yield call(getChallenges);
    yield put(challengeSuccess(response));
  } catch (error) {
    yield put(challengeFailure(error));
  }
}

function* asyncGetChallengeDetail(action: any): any {
  try {
    const response = yield call(getChallengeDetail, action.payload);
    yield put(getChallengeDetailSuccess(response));
  } catch (error) {
    yield put(challengeDetalFailure(error));
  }
}

export function* challengesSaga() {
  yield takeEvery(challengesType.GET_CHALLENGES, asyncGetChallenges);
  yield takeEvery(challengesType.GET_CHALLENGE_DETAIL, asyncGetChallengeDetail);
}
