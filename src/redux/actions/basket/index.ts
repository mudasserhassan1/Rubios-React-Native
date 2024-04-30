import {basketActionsTypes} from '../../types/basket';
import {ResponseBasket, ResponseUserDeliveryAddresses} from '../../../types/olo-api';
export function resetBasketRequest() {
  return {
    type: basketActionsTypes.RESET_BASKET_REQUEST,
  };
}

export function getBasketRequest(
  basketid: string,
  updatedBasket: any = {},
  basketType: string = 'New',
) {
  return {
    type: basketActionsTypes.GET_BASKET_REQUEST,
    basketid,
    updatedBasket,
    basketType,
  };
}

export function getBasketRequestSuccess(data: ResponseBasket, basketType: string = 'New') {
  // if (store.getState().authReducer?.authToken?.authtoken) {
  //   store.dispatch(getUserDeliveryAddressesForBasket());
  // }
  return {
    type: basketActionsTypes.GET_BASKET_SUCCESS,
    payload: data,
    basketType: basketType,
  };
}

export function getBasketRequestFailure(error: any) {
  return {
    type: basketActionsTypes.GET_BASKET_FAILURE,
    error: error,
  };
}

export function resetBasketPaymentMethods() {
  return {
    type: basketActionsTypes.RESET_BASKET_PAYMENT_METHODS,
  };
}

export function getUserDeliveryAddressesForBasket() {
  return {
    type: basketActionsTypes.GET_USER_DELIVERY_ADDRESSES_FOR_BASKET,
  };
}

export function getUserDeliveryAddressesForBasketSuccess(data: ResponseUserDeliveryAddresses) {
  let newArray = data?.deliveryaddresses || [];
  if (newArray?.length) {
    newArray = newArray.map((address: any) => address.id);
  }
  return {
    type: basketActionsTypes.GET_USER_DELIVERY_ADDRESSES_FOR_BASKET_SUCCESS,
    payload: newArray,
  };
}

export function getUserDeliveryAddressesForBasketFailure(error: any) {
  return {
    type: basketActionsTypes.GET_USER_DELIVERY_ADDRESSES_FOR_BASKET_FAILURE,
    error: error,
  };
}
export function setSaveCreditCard(data: Boolean) {
  return {
    type: basketActionsTypes.SET_SAVE_CREDIT_CARD,
    payload: data,
  };
}

export function setBasketTipPercentage(data: any) {
  return {
    type: basketActionsTypes.SET_TIP_PERCENTAGE,
    payload: data,
  };
}

export function setBasketCustomTip(data: Boolean) {
  return {
    type: basketActionsTypes.SET_CUSTOM_TIP,
    payload: data,
  };
}
