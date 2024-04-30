import {basketActionsTypes} from '../../../../types/basket';
import {ResponseBasket} from '../../../../../types/olo-api';
import {displayToast} from '../../../../../helpers/toast';

export function addProductRequest(
  basketid: string,
  request: any,
  callback: any,
  errorCallback: any,
): any {
  return {
    type: basketActionsTypes.ADD_PRODUCT_REQUEST,
    basketid,
    request,
    callback,
    errorCallback,
  };
}

export function addProductSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.ADD_PRODUCT_SUCCESS,
    payload: data,
  };
}

export function addProductFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.ADD_PRODUCT_FAILURE,
    error: error,
  };
}
