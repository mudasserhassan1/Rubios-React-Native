import {takeEvery, put, call} from 'redux-saga/effects';
import {requestAccountHistory} from '../../../services/account-history';
import {
  getAccountHistoryFailure,
  getAccountHistorySuccess,
  getPointHistorySuccess,
} from '../../actions/account-history';
import {accountHistoryTypes as Type} from '../../types/account-hostory';

function* accountHistoryHandler(action: any): any {
  try {
    if (action.event_filter === 'rewards') {
      const redemptionresponse = yield call(requestAccountHistory, 'redemptions');
      const checkinResponse = yield call(requestAccountHistory, 'checkins');
      yield put(getAccountHistorySuccess([...redemptionresponse, ...checkinResponse]));
    } else {
      const response = yield call(requestAccountHistory, action.event_filter);
      yield put(getPointHistorySuccess(response));
    }
  } catch (error) {
    yield put(getAccountHistoryFailure(error));
  }
}

export function* accountHistorySaga() {
  yield takeEvery(Type.GET_ACCOUNT_HISTORY, accountHistoryHandler);
}
