import {takeEvery, put, call} from 'redux-saga/effects';
import {checkinTypes as Type} from '../../types/check-in';
import {checkInFailure, checkInSuccess} from '../../actions/check-in';
import {requestCreateCheckIn} from '../../../services/check-in';

function* checkInHandler(action: any): any {
  const {callBack} = action || {};
  try {
    const response = yield call(requestCreateCheckIn, action.payload);
    yield put(checkInSuccess(response));
    callBack?.('success', response);
  } catch (error) {
    callBack?.('failure', error);
    yield put(checkInFailure(error));
  }
}
export function* checkinSaga() {
  yield takeEvery(Type.CREATE_CHECK_IN, checkInHandler);
}
