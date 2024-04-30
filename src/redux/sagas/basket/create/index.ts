import {call, put, takeEvery} from 'redux-saga/effects';
import {basketActionsTypes} from '../../../types/basket';
import {
  createBasketFromFavOrderFailure,
  createBasketFromFavOrderSuccess,
  createBasketFromPrevFailure,
  createBasketFromPrevOrderFailure,
  createBasketFromPrevOrderSuccess,
  createBasketFromPrevSuccess,
  setBasketRequestFailure,
  setBasketRequestSuccess,
} from '../../../actions/basket/create';
import {
  getDummyBasket,
  requestCreateBasket,
  requestCreateBasketForFav,
  setBasketDeliveryAddress,
  setBasketDeliveryMode,
} from '../../../../services/basket';
import {getBasketRequestSuccess} from '../../../actions/basket';
import {constants} from '../../../../constants';
import {setDeliveryAddressSuccess} from '../../../actions/location/delivery-address';
import {displayToast} from '../../../../helpers/toast';

function* asyncCreateBasketRequest(action: any): any {
  const {callback, errorCallback} = action?.payload ?? {};
  try {
    let response = yield call(getDummyBasket, action.payload.request);
    action.payload.basketId = response.id;
    if (action.payload.deliveryAddress) {
      response = yield call(
          setBasketDeliveryAddress,
          action.payload.basketId,
          action.payload.deliveryAddress,
      );
    }
    if (action.payload.deliverymode) {
      response = yield call(
          setBasketDeliveryMode,
          action.payload.basketId,
          action.payload.deliverymode,
      );
    }
    yield put(setBasketRequestSuccess(response));
    if (typeof callback === 'function') {
      callback({response});
    }
  } catch (error) {
    errorCallback?.();
    yield put(setBasketRequestFailure(error));
  }
}

function* asyncCreateBasketFormPrevRequest(action: any): any {
  try {
    const response = yield call(requestCreateBasket, action.body);
    const {products = []} = response || {};
    if (products.length > 0) {
      yield put(getBasketRequestSuccess(response));
      action.callback?.(response);
    } else {
      displayToast('ERROR', 'Items in this order are no longer available.');
    }
    yield put(createBasketFromPrevOrderSuccess(response));
  } catch (error: any) {
    if (action.body.ignoreunavailableproducts || !action?.isEligibleCallback) {
      yield put(createBasketFromPrevOrderFailure(error));
    } else {
      displayToast(
          'ERROR',
          error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
      );
      action?.failureCallback?.(action?.body);
    }
  }
}

function* asyncCreateBasketFromFavRequest(action: any): any {
  try {
    const response = yield call(requestCreateBasketForFav, action.body);
    const {deliverymode = '', deliveryaddress = {}, products = []} = response || {};
    if (products.length > 0) {
      if (deliverymode === constants.handOffMode.DISPATCH && deliveryaddress) {
        const address = {
          address1: deliveryaddress?.streetaddress,
          address2: deliveryaddress?.building,
          city: deliveryaddress?.city,
          zip: deliveryaddress?.zipcode,
          state: deliveryaddress?.state || '',
        };
        yield put(setDeliveryAddressSuccess(address));
      }
      yield put(getBasketRequestSuccess(response));
      action.callback?.(deliverymode);
    } else {
      displayToast('ERROR', 'Items in this order are no longer available.');
    }
    yield put(createBasketFromFavOrderSuccess(response));
  } catch (error: any) {
    if (action.body.ignoreunavailableproducts || !action.isCallbackEligible) {
      yield put(createBasketFromFavOrderFailure(error));
    } else {
      displayToast(
          'ERROR',
          error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
      );
      action?.failureCallback?.(action.body);
    }
  }
}

function* createBasketFromPrevHandler(action: any): any {
  try {
    const response = yield call(requestCreateBasket, action.body);
    yield put(createBasketFromPrevSuccess(response));
  } catch (error) {
    yield put(createBasketFromPrevFailure(error));
  }
}

export function* createBasketSaga() {
  yield takeEvery(basketActionsTypes.SET_BASKET_REQUEST, asyncCreateBasketRequest);
  yield takeEvery(basketActionsTypes.CREATE_BASKET_FROM_PREV, createBasketFromPrevHandler);
  yield takeEvery(
    basketActionsTypes.CREATE_BASKET_FROM_PREV_ORDER_REQUEST,
    asyncCreateBasketFormPrevRequest,
  );
  yield takeEvery(
    basketActionsTypes.CREATE_BASKET_FROM_FAV_ORDER_REQUEST,
    asyncCreateBasketFromFavRequest,
  );
}
