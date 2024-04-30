import {basketActionsTypes} from '../../../../types/basket';
import {BasketProduct, ResponseBasket} from '../../../../../types/olo-api';
import {displayToast} from '../../../../../helpers/toast';

export function updateProductRequest(
  basketid: string,
  item: BasketProduct,
  request: any,
  callback: any,
  errorCallback: any,
) {
  return {
    type: basketActionsTypes.UPDATE_PRODUCT_REQUEST,
    basketid,
    item,
    request,
    callback,
    errorCallback,
  };
}

export function updateProductSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.UPDATE_PRODUCT_SUCCESS,
    payload: data,
  };
}

export function updateProductFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.UPDATE_PRODUCT_FAILURE,
    error: error,
  };
}
