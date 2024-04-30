import {productOptionActionsTypes} from '../../../types/product/option';
import {ResponseModifiers} from '../../../../types/olo-api';
import {displayToast} from '../../../../helpers/toast';

export function getProductOptionRequest(id: number, callback: any) {
  return {
    type: productOptionActionsTypes.GET_PRODUCT_OPTION_REQUEST,
    id,
    callback,
  };
}

export function getProductOptionRequestSuccess(data: ResponseModifiers) {
  return {
    type: productOptionActionsTypes.GET_PRODUCT_OPTION_SUCCESS,
    payload: data,
  };
}

export function getProductOptionRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: productOptionActionsTypes.GET_PRODUCT_OPTION_FAILURE,
    error: error,
  };
}
export function resetProductOptions() {
  return {
    type: productOptionActionsTypes.RESET_PRODUCT_OPTIONS,
  };
}
export function setExpandedModifiers(data: any) {
  return {
    type: productOptionActionsTypes.SET_EXPANDED_MODIFIERS,
    payload: data,
  }
}

export function resetExpandedModifiers() {
  return {
    type: productOptionActionsTypes.RESET_EXPANDED_MODIFIERS
  }
}

export function setCheckedModifier(data: {[key: string]: [value: boolean]}) {
  return {
    type: productOptionActionsTypes.SET_CHECKED_MODIFIERS,
    payload: data
  }
}
export function resetCheckedModifiers(data: any) {
  return {
    type: productOptionActionsTypes.RESET_CHECKED_MODIFIERS,
    payload: data,
  }
}
