import {takeEvery, put, call} from 'redux-saga/effects';
import {authActionsTypes} from '../../types/auth';
import {getAuthToken} from '../../../services/auth';
import {getAuthRequestFailure, getAuthRequestSuccess} from '../../actions/auth';
import {goBack, moveToPreviousScreenWithMerge} from '../../../utils/navigationUtils';
import {userTypes} from '../../types/user';
import {orderActionTypes} from '../../types/order';
import {handleCredentialsConfirmation} from '../../../utils/keychainService';
import {logToConsole} from "../../../configs";

function* asyncAuthItemRequest(action: any): any {
  try {
    const {isGuest, screen, basketID, isSocialLogin} = action || {};
    const response = yield call(getAuthToken, basketID);
    yield put(getAuthRequestSuccess(action.successMsg, response.data));
    if (!isSocialLogin) {
      handleCredentialsConfirmation(action.data.email, action.data.password).then();
    }
    if (isGuest || (isGuest && action?.basketID)) {
      yield put({
        type: userTypes.USER_LOGIN,
      });
      yield put({
        type: orderActionTypes.UPDATE_GUEST_USER_INFO,
        payload: null,
      });
      yield put({type: userTypes.GET_USER_PROFILE});
      goBack();
      // logToConsole({screen})
      // moveToPreviousScreenWithMerge(screen);
    }
  } catch (error) {
    action?.callback?.();
    yield put(getAuthRequestFailure(error));
  }
}

export function* storeAuth() {
  yield takeEvery(authActionsTypes.GET_AUTHTOKEN_REQUEST, asyncAuthItemRequest);
}
