import {displayToast} from '../../../../helpers/toast';
import {redemptionTypes as Type} from '../../../types/reward/redemption';

export function getRewardRedemptionCode(reward_id: string, callBack: any) {
  return {
    type: Type.GET_REWARD_REDEMPTION_CODE,
    payload: reward_id,
    callBack,
  };
}

export function getRewardRedemptionCodeSuccess(data: any, callBack?: any) {
  return {
    type: Type.GET_REWARD_REDEMPTION_CODE_SUCCESS,
    payload: data,
    callBack,
  };
}

export function getRewardRedemptionCodeFailure(error: any) {
  // displayToast('ERROR', error?.data?.error ? error.data.error : 'Failed to redeem this reward');
  displayToast('ERROR', error?.data[0]);
  return {
    type: Type.GET_REWARD_REDEMPTION_CODE_FAILURE,
    error: error,
  };
}

export function getRedeemableRedemptionCode(reward_id: string, callBack: any) {
  return {
    type: Type.GET_REDEEMABLE_REDEMPTION_CODE,
    payload: reward_id,
    callBack,
  };
}

export function getRedeemableRedemptionCodeSuccess(data: any) {
  return {
    type: Type.GET_REDEEMABLE_REDEMPTION_CODE_SUCCESS,
    payload: data,
  };
}

export function getRedeemableRedemptionCodeFailure(error: any) {
  displayToast('ERROR', error?.data ? error.data[0] : 'Failed to redeem this Redeemable');
  return {
    type: Type.GET_REDEEMABLE_REDEMPTION_CODE_FAILURE,
    error: error,
  };
}

export function setReward(reward_name: string) {
  return {
    type: Type.SET_REWARD,
    payload: reward_name,
  };
}
