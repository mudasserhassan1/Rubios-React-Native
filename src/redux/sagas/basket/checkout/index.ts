import {takeEvery, put, call} from 'redux-saga/effects';
import {basketActionsTypes} from '../../../types/basket';
import {getRestaurantCalendar} from '../../../../services/restaurant/calendar';
import {
  setTimeWantedBasket,
  deleteTimeWantedBasket,
  setTipAmountBasket,
  applyCouponBasket,
  validateBasket,
  getBasketAllowedCards,
  removeCouponBasket,
} from '../../../../services/checkout';
import {
  getSingleRestaurantCalendarSuccess,
  getSingleRestaurantCalendarFailure,
  updateBasketTimeWantedSuccess,
  updateBasketTimeWantedFailure,
  deleteBasketTimeWantedSuccess,
  deleteBasketTimeWantedFailure,
  updateBasketTipAmountSuccess,
  updateBasketTipAmountFailure,
  updateBasketCouponCodeSuccess,
  updateBasketCouponCodeFailure,
  removeBasketCouponCodeSuccess,
  removeBasketCouponCodeFailure,
  validateBasketSuccess,
  validateBasketFailure,
  validateBasketPhoneFailure,
  setBasketDeliveryModeSuccess,
  setBasketDeliveryModeFailure,
  setBasketDeliveryAddressSuccess,
  setBasketDeliveryAddressFailure,
  getBasketAllowedCardsRequestSuccess,
  getBasketAllowedCardsRequestFailure,
} from '../../../actions/basket/checkout';
import {webViewRef} from '../../../../components/AddCreditCardJSX/AddCreditCardJSX';
import {submitScript, payloadScript} from '../../../../utils/paymentUtils';
import {
  getBasket,
  setBasketCustomFields,
  setBasketDeliveryAddress,
  setBasketDeliveryMode,
} from '../../../../services/basket';
import {getBasketRequestSuccess} from '../../../actions/basket';

function* asyncgetSingleRestaurantCalendarRequest(action: any): any {
  const {callBack, errorCallback} = action || {};
  try {
    const response = yield call(getRestaurantCalendar, action.id, action.dateFrom, action.dateTo);
    yield put(getSingleRestaurantCalendarSuccess(response));
    callBack?.();
  } catch (error) {
    yield put(getSingleRestaurantCalendarFailure(error));
    errorCallback?.();
  }
}

function* asyncUpdateBasketTimeWanted(action: any): any {
  try {
    const response = yield call(setTimeWantedBasket, action.basketId, action.data);
    yield put(updateBasketTimeWantedSuccess(response));
    action?.callback?.();
    yield put({
      type: basketActionsTypes.VALIDETE_BASKET,
      basketId: action.basketId,
      basketPayload: null,
      userData: null,
      customFields: [],
      deliverymode: null,
      deliveryAddress: null,
      ccsfObj: null,
    });
  } catch (error) {
    action?.callback?.();
    yield put(updateBasketTimeWantedFailure(error));
  }
}

function* asyncDeleteBasketTimeWanted(action: any): any {
  try {
    const response = yield call(deleteTimeWantedBasket, action.basketId);
    yield put(deleteBasketTimeWantedSuccess(response));
    action?.callback?.();
  } catch (error) {
    yield put(deleteBasketTimeWantedFailure(error));
    action?.errorCallback?.();
  }
}

function* asyncUpdateBasketTipAmount(action: any): any {
  try {
    const response = yield call(setTipAmountBasket, action.basketId, action.data);
    yield put(updateBasketTipAmountSuccess(response));
  } catch (error) {
    yield put(updateBasketTipAmountFailure(error));
  }
}

function* asyncUpdateBasketCouponCode(action: any): any {
  const {successCallback, errorCallback} = action || {};
  try {
    const response = yield call(applyCouponBasket, action.basketId, action.data);
    yield put(updateBasketCouponCodeSuccess(response, successCallback));
  } catch (error) {
    yield put(updateBasketCouponCodeFailure(error, errorCallback));
  }
}

function* asyncRemoveBasketCouponCode(action: any): any {
  try {
    const response = yield call(removeCouponBasket, action.basketId);
    yield put(removeBasketCouponCodeSuccess(response));
  } catch (error) {
    yield put(removeBasketCouponCodeFailure(error));
  }
}

function* asyncSetBasketDeliveryModeRequest(action: any): any {
  try {
    const response = yield call(
      setBasketDeliveryMode,
      action.action.payload.basketId,
      action.action.payload.deliverymode,
    );
    yield put(setBasketDeliveryModeSuccess(response));
  } catch (error) {
    yield put(setBasketDeliveryModeFailure(error));
  }
}

function* asyncSetBasketDeliveryAddressRequest(action: any): any {
  try {
    const response = yield call(setBasketDeliveryAddress, action.basketid, action.payload);
    yield put(setBasketDeliveryAddressSuccess(response));
  } catch (error) {
    yield put(setBasketDeliveryAddressFailure(error));
  }
}

function* asyncValidateBasket(action: any): any {
  try {
    if (action.basketPayload) {
      yield put({
        type: basketActionsTypes.ADD_BASKET_ORDER_SUBMIT,
      });
    }
    // if (action.userData) {
    //   const userResponse = yield call(requestUpdateUser, action.userData);
    //   yield put(updateUserSuccess(userResponse));
    //   yield put(getProviderRequestSuccess(userResponse));
    // }
    if (action.customFields?.length) {
      yield call(setBasketCustomFields, action.basketId, action.customFields);
    }
    // if (action.deliveryAddress) {
    //   const deliveryAddressResponse = yield call(
    //     setBasketDeliveryAddress,
    //     action.basketId,
    //     action.deliveryAddress,
    //   );
    // const deliveryAddressResponse = yield put({
    //   type: basketActionsTypes.SET_BASKET_DELIVERY_ADDRESS_REQUEST,
    //   action,
    // });
    // }
    // if (action.deliverymode && !action.deliveryAddress) {
    //   const deliveryModeResponse = yield put({
    //     type: basketActionsTypes.SET_BASKET_DELIVERY_MODE_REQUEST,
    //     action,
    //   });
    // }
    const validateResponse = yield call(validateBasket, action.basketId);
    yield put(validateBasketSuccess(validateResponse));
    action?.callBack?.();
    const basketResponse = yield call(getBasket, action.basketId);
    yield put(getBasketRequestSuccess(basketResponse));
    if (action.basketPayload) {
      yield put({
        type: basketActionsTypes.SUBMIT_BASKET_SINGLE_PAYMENT,
        action,
      });
    }
  } catch (error: any) {
    // action?.errorCallBack?.();
    yield put({
      type: basketActionsTypes.REMOVE_BASKET_ORDER_SUBMIT,
    });
    if (error?.config?.url && error.config.url.includes('api/auth/users')) {
      yield put(validateBasketPhoneFailure(error));
    } else {
      yield put(validateBasketFailure(error, action?.errorCallBack));
    }
  }
}

function* asyncSubmitBasketSinglePayment(action: any): any {
  try {
    const stringify = JSON.stringify(action.action.basketPayload);
    const script = payloadScript(stringify);
    webViewRef?.current?.injectJavaScript?.(script);
    webViewRef?.current?.injectJavaScript?.(submitScript);
  } catch (error) {
    // yield put(submitBasketSinglePaymentFailure(error));
  }
}

function* asyncGetBasketAllowedCardsRequest(action: any): any {
  try {
    const response = yield call(getBasketAllowedCards, action.basketid);
    yield put(getBasketAllowedCardsRequestSuccess(response));
  } catch (error) {
    yield put(getBasketAllowedCardsRequestFailure(error));
  }
}

export function* checkoutSaga() {
  yield takeEvery(
    basketActionsTypes.GET_SINGLE_RESTAURANT_CALENDAR,
    asyncgetSingleRestaurantCalendarRequest,
  );
  yield takeEvery(basketActionsTypes.UPDATE_BASKET_TIME_WANTED, asyncUpdateBasketTimeWanted);
  yield takeEvery(basketActionsTypes.DELETE_BASKET_TIME_WANTED, asyncDeleteBasketTimeWanted);
  yield takeEvery(basketActionsTypes.UPDATE_BASKET_TIP_AMOUNT, asyncUpdateBasketTipAmount);
  yield takeEvery(basketActionsTypes.UPDATE_BASKET_COUPON_CODE, asyncUpdateBasketCouponCode);
  yield takeEvery(basketActionsTypes.REMOVE_BASKET_COUPON_CODE, asyncRemoveBasketCouponCode);
  yield takeEvery(basketActionsTypes.VALIDETE_BASKET, asyncValidateBasket);
  yield takeEvery(basketActionsTypes.SUBMIT_BASKET_SINGLE_PAYMENT, asyncSubmitBasketSinglePayment);
  yield takeEvery(
    basketActionsTypes.SET_BASKET_DELIVERY_MODE_REQUEST,
    asyncSetBasketDeliveryModeRequest,
  );
  yield takeEvery(
    basketActionsTypes.SET_BASKET_DELIVERY_ADDRESS_REQUEST,
    asyncSetBasketDeliveryAddressRequest,
  );
  yield takeEvery(
    basketActionsTypes.GET_BASKET_ALLOWED_CARDS_REQUEST,
    asyncGetBasketAllowedCardsRequest,
  );
}
