import {basketActionsTypes} from '../../../types/basket';
import {
  ResponseRestaurantCalendars,
  RequestUpdateBasketTimeWanted,
  ResponseBasket,
  RequestUpdateBasketTip,
  RequestApplyCoupon,
  ResponseBasketValidation,
  RequestBasketSubmit,
  RequestSetDeliveryMode,
  RequestDeliveryAddress,
} from '../../../../types/olo-api';
import {displayToast} from '../../../../helpers/toast';

export function getSingleRestaurantCalendar(
  id: number,
  dateFrom: string,
  dateTo: string,
  callBack: any,
  errorCallback: any,
) {
  return {
    type: basketActionsTypes.GET_SINGLE_RESTAURANT_CALENDAR,
    id,
    dateFrom,
    dateTo,
    callBack,
    errorCallback,
  };
}

export function getSingleRestaurantCalendarSuccess(data: ResponseRestaurantCalendars) {
  return {
    type: basketActionsTypes.GET_SINGLE_RESTAURANT_CALENDAR_SUCCESS,
    payload: data,
  };
}

export function getSingleRestaurantCalendarFailure(error: any) {
  return {
    type: basketActionsTypes.GET_SINGLE_RESTAURANT_CALENDAR_FAILURE,
    error: error,
  };
}

export function updateBasketTimeWanted(
  basketId: string,
  data: RequestUpdateBasketTimeWanted,
  callback: any,
) {
  return {
    type: basketActionsTypes.UPDATE_BASKET_TIME_WANTED,
    basketId,
    data,
    callback,
  };
}

export function updateBasketTimeWantedSuccess(data: ResponseBasket) {
  displayToast('SUCCESS', 'Order Time updated.');

  return {
    type: basketActionsTypes.UPDATE_BASKET_TIME_WANTED_SUCCESS,
    payload: data,
  };
}

export function updateBasketTimeWantedFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.UPDATE_BASKET_TIME_WANTED_FAILURE,
    error: error,
  };
}

export function deleteBasketTimeWanted(basketId: string, callback: any, errorCallback: any) {
  return {
    type: basketActionsTypes.DELETE_BASKET_TIME_WANTED,
    basketId,
    callback,
    errorCallback,
  };
}

export function deleteBasketTimeWantedSuccess(data: ResponseBasket) {
  displayToast('SUCCESS', 'Order Time updated to ASAP.');
  return {
    type: basketActionsTypes.DELETE_BASKET_TIME_WANTED_SUCCESS,
    payload: data,
  };
}

export function deleteBasketTimeWantedFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );

  return {
    type: basketActionsTypes.DELETE_BASKET_TIME_WANTED_FAILURE,
    error: error,
  };
}

export function updateBasketTipAmount(basketId: string, data: RequestUpdateBasketTip) {
  return {
    type: basketActionsTypes.UPDATE_BASKET_TIP_AMOUNT,
    basketId,
    data,
  };
}

export function updateBasketTipAmountSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.UPDATE_BASKET_TIP_AMOUNT_SUCCESS,
    payload: data,
  };
}

export function setTipFalse(data: any) {
  return {
    type: basketActionsTypes.SET_TIP_FALSE,
    payload: data,
  };
}
export function updateDuplicateAddress(duplicateAddress: string[]) {
  return {
    type: basketActionsTypes.UPDATE_DUPLICATE_ADDRESS,
    payload: duplicateAddress,
  };
}

export function updateNavigationLink(signInNavigation: any) {
  return {
    type: basketActionsTypes.NAVIGATION_URL,
    payload: signInNavigation,
  };
}

export function updateBasketTipAmountFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.UPDATE_BASKET_TIP_AMOUNT_FAILURE,
    error: error,
  };
}

export function updateBasketCouponCode(
  basketId: string,
  data: RequestApplyCoupon,
  successCallback: any,
  errorCallback: any,
) {
  return {
    type: basketActionsTypes.UPDATE_BASKET_COUPON_CODE,
    basketId,
    data,
    successCallback,
    errorCallback,
  };
}

export function updateBasketCouponCodeSuccess(data: ResponseBasket, successCallback: any) {
  successCallback('Coupon successfully Applied!');
  return {
    type: basketActionsTypes.UPDATE_BASKET_COUPON_CODE_SUCCESS,
    payload: data,
  };
}

export function updateBasketCouponCodeFailure(error: any, errorCallBack: any) {
  let msg = '';
  if (error?.response?.data?.message) {
    if (
      error.response.data.message ===
      'Coupon code may not be applied since a loyalty reward and/or comp card is already applied to your basket. Remove any loyalty rewards and comp cards to proceed.'
    ) {
      msg = 'Only one reward or coupon can be applied to an order.';
    } else {
      msg = error.response.data.message;
    }
  } else {
    msg = 'ERROR! Please Try again later';
  }
  if (msg === 'This coupon is not valid for this order.') {
    errorCallBack?.('Wrong Coupon Code');
  } else {
    displayToast('ERROR', msg);
  }
  return {
    type: basketActionsTypes.UPDATE_BASKET_COUPON_CODE_FAILURE,
    error: error,
  };
}

export function removeBasketCouponCode(basketId: string, couponType: string) {
  return {
    type: basketActionsTypes.REMOVE_BASKET_COUPON_CODE,
    basketId,
    couponType,
  };
}

export function removeBasketCouponCodeSuccess(data: ResponseBasket) {
  displayToast('SUCCESS', 'Coupon removed.');
  return {
    type: basketActionsTypes.REMOVE_BASKET_COUPON_CODE_SUCCESS,
    payload: data,
  };
}

export function removeBasketCouponCodeFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.REMOVE_BASKET_COUPON_CODE_FAILURE,
    error: error,
  };
}

export function validateBasket(
  basketId: string,
  basketPayload: RequestBasketSubmit | null,
  userData: any,
  customFields: any,
  deliverymode: RequestSetDeliveryMode | null,
  ccsfObj: any,
  submitOrder: any,
  callBack: any,
  errorCallBack: any,
) {
  return {
    type: basketActionsTypes.VALIDETE_BASKET,
    basketId,
    basketPayload,
    userData,
    customFields,
    deliverymode,
    ccsfObj,
    submitOrder,
    callBack,
    errorCallBack,
  };
}

export function validateBasketSuccess(response: ResponseBasketValidation) {
  return {
    type: basketActionsTypes.VALIDETE_BASKET_SUCCESS,
    payload: response,
  };
}

export function validateBasketFailure(error: any, errorCallback: any) {
  if (error?.response?.data?.message) {
    if (typeof errorCallback === 'function') {
      errorCallback?.(error?.response?.data?.message);
    }
  }

  return {
    type: basketActionsTypes.VALIDETE_BASKET_FAILURE,
    error: error,
  };
}

export function validateBasketPhoneFailure(error: any) {
  if (error?.data && error.data.length) {
    error.data.forEach((msg: string) => {
      displayToast('ERROR', msg);
    });
  } else {
    displayToast('ERROR', 'ERROR! Please Try again later');
  }
  return {
    type: basketActionsTypes.VALIDETE_BASKET_PHONE_FAILURE,
    error: error,
  };
}

export function submitBasketSinglePayment(basketId: string, data: RequestBasketSubmit) {
  return {
    type: basketActionsTypes.SUBMIT_BASKET_SINGLE_PAYMENT,
    basketId,
    data,
  };
}

export function submitBasketSinglePaymentSuccess() {
  // displayToast('SUCCESS', 'Order has been placed.');
  // setRecentOrders(data, basketid).then(() => {});
  return {
    type: basketActionsTypes.SUBMIT_BASKET_SINGLE_PAYMENT_SUCCESS,
    // payload: data,
  };
}

export function submitBasketSinglePaymentFailure(error: any) {
  // displayToast(
  //   'ERROR',
  //   error?.response?.data?.message
  //     ? error.response.data.message
  //     : 'ERROR! Please Try again later',
  // );
  return {
    type: basketActionsTypes.SUBMIT_BASKET_SINGLE_PAYMENT_FAILURE,
    error: error,
  };
}

export function addBasketOrderSubmit() {
  return {
    type: basketActionsTypes.ADD_BASKET_ORDER_SUBMIT,
  };
}

export function removeBasketOrderSubmit() {
  return {
    type: basketActionsTypes.REMOVE_BASKET_ORDER_SUBMIT,
  };
}

export function setBasketDeliveryMode(basketid: string, payload: RequestSetDeliveryMode) {
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_MODE_REQUEST,
    basketid,
    payload,
  };
}

export function setBasketDeliveryModeSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_MODE_SUCCESS,
    payload: data,
  };
}

export function setBasketDeliveryModeFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_MODE_FAILURE,
    error: error,
  };
}

export function setBasketDeliveryAddress(basketid: string, payload: RequestDeliveryAddress) {
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_ADDRESS_REQUEST,
    basketid,
    payload,
  };
}

export function setBasketDeliveryAddressSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_ADDRESS_SUCCESS,
    payload: data,
  };
}

export function setBasketDeliveryAddressFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.SET_BASKET_DELIVERY_ADDRESS_FAILURE,
    error: error,
  };
}

export function getBasketAllowedCardsRequest(basketid: string) {
  return {
    type: basketActionsTypes.GET_BASKET_ALLOWED_CARDS_REQUEST,
    basketid,
  };
}

export function getBasketAllowedCardsRequestSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.GET_BASKET_ALLOWED_CARDS_REQUEST_SUCCESS,
    payload: data,
  };
}

export function getBasketAllowedCardsRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.GET_BASKET_ALLOWED_CARDS_REQUEST_FAILURE,
    error: error,
  };
}

export function updateBasketBillingSchemes(data: any) {
  return {
    type: basketActionsTypes.UPDATE_BASKET_BILLING_SCHEMES,
    payload: data,
  };
}

export function setBasketOrderTypeRequest(basketid: string, payload: RequestDeliveryAddress) {
  return {
    type: basketActionsTypes.SET_BASKET_ORDER_TYPE_REQUEST,
    basketid,
    payload,
  };
}

export function setBasketOrderTypeSuccess(data: ResponseBasket) {
  return {
    type: basketActionsTypes.SET_BASKET_ORDER_TYPE_SUCCESS,
    payload: data,
  };
}

export function setBasketOrderTypeFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: basketActionsTypes.SET_BASKET_ORDER_TYPE_FAILURE,
    error: error,
  };
}
