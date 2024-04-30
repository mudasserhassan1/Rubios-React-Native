import {takeEvery, call} from 'redux-saga/effects';
import {facebookConversionTypes as Type} from '../../types/facebook-conversion';
import {requestFacebookConversion} from '../../../services/facbook-conversion';

function* facebookConversionHandler(action: any): any {
  try {
    yield call(requestFacebookConversion, action.eventType, action.userData, action.customData);
  } catch (error) {}
}
export function* facebookConversionSaga() {
  yield takeEvery(Type.FACEBOOK_EVENT_REQUEST, facebookConversionHandler);
}
