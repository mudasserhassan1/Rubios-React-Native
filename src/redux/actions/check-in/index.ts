import {displayToast} from '../../../helpers/toast';
import {checkinTypes as Type} from '../../types/check-in';
import {logToConsole} from "../../../configs";

export function createCheckIn(data: any, callBack: any) {
  return {
    type: Type.CREATE_CHECK_IN,
    payload: data,
    callBack,
  };
}

export function checkInSuccess(data: any) {
  return {
    type: Type.CHECK_IN_SUCCESS,
    payload: data,
  };
}

export function checkInFailure(error: any) {
  const errors: any = error?.response?.data?.errors || {};
  const errorKey = Object.keys(errors)?.[0];
  const errorMessage = errors?.[errorKey]?.[0];
  displayToast('ERROR', errorMessage || 'Invalid Code');
  return {
    type: Type.CHECK_IN_FAILURE,
    error: error,
  };
}
