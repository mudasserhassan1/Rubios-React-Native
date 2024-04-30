import { takeEvery, put, call } from 'redux-saga/effects';
import {
  requestRedeemableRedemptionCode,
  requestRewardRedemptionCode,
} from '../../../../services/reward/redemption';
import {
  getRewardRedemptionCodeSuccess,
  getRewardRedemptionCodeFailure,
  getRedeemableRedemptionCodeSuccess,
  getRedeemableRedemptionCodeFailure,
} from '../../../actions/reward/redemption';
import { redemptionTypes as Type } from '../../../types/reward/redemption';

function* rewardRedemptionHandler(action: any): any {
  const {callBack} = action || {};
  try {
    const response = yield call(requestRewardRedemptionCode, action.payload);
    yield put(getRewardRedemptionCodeSuccess(response));
    callBack?.('success');
  } catch (error) {
    callBack?.('failure');
    yield put(getRewardRedemptionCodeFailure(error));
  }
}

function* redeemableRedemptionHandler(action: any): any {
  const {callBack} = action || {};
  try {
    const response = yield call(
      requestRedeemableRedemptionCode,
      action.payload,
    );
    callBack?.('success');
    yield put(getRedeemableRedemptionCodeSuccess(response));
  } catch (error) {
    callBack?.('failure');
    yield put(getRedeemableRedemptionCodeFailure(error));
  }
}

export function* redemptionSaga() {
  yield takeEvery(Type.GET_REWARD_REDEMPTION_CODE, rewardRedemptionHandler);
  yield takeEvery(
    Type.GET_REDEEMABLE_REDEMPTION_CODE,
    redeemableRedemptionHandler,
  );
}
