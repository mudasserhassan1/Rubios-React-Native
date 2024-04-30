import {call, put, takeEvery} from 'redux-saga/effects';
import {getOffers} from '../../../services/offers';
import {offersFailure, offersSuccess} from '../../actions/offers';
import {offersType} from '../../types/offers';

function* asyncGetOffers(): any {
  try {
    const response = yield call(getOffers);
    yield put(offersSuccess(response));
  } catch (error) {
    yield put(offersFailure(error));
  }
}

export function* offersSaga() {
  yield takeEvery(offersType.GET_OFFERS, asyncGetOffers);
}
