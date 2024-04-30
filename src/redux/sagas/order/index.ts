import {takeEvery, put, call} from 'redux-saga/effects';
import {orderActionTypes} from '../../types/order';
import {
  getOrderRequestSuccess,
  getOrderRequestFailure,
  getOrderRestaurantRequestSuccess,
  getOrderRestaurantRequestFailure,
  submitFeedBackFailure,
  submitFeedBackSuccess,
} from '../../actions/order';
import {requestOrderById, submitOrderFeedBackRequest} from '../../../services/order';
import {getRestaurantInfo} from '../../../services/restaurant';

function* asyncSingleOrderRequest(action: any): any {
  try {
    const response = yield call(requestOrderById, action.id);
    yield put(getOrderRequestSuccess(response));
  } catch (error) {
    yield put(getOrderRequestFailure(error));
  }
}

function* asyncGetOrderRestaurantRequest(action: any): any {
  try {
    const response = yield call(getRestaurantInfo, action.vendorid);
    yield put(getOrderRestaurantRequestSuccess(response));
  } catch (error) {
    yield put(getOrderRestaurantRequestFailure(error));
  }
}
function* requestSubmitOrderFeedback(action: any): any {
  try {
    const response = yield call(submitOrderFeedBackRequest, action.payload);
    yield put(submitFeedBackSuccess(response));
  } catch (error) {
    yield put(submitFeedBackFailure(error));
  }
}
export function* storeOrder() {
  yield takeEvery(orderActionTypes.GET_SINGLE_ORDER_REQUEST, asyncSingleOrderRequest);
  yield takeEvery(orderActionTypes.GET_ORDER_RESTAURANT_REQUEST, asyncGetOrderRestaurantRequest);
  yield takeEvery(orderActionTypes.SUBMIT_ORDER_FEEDBACK, requestSubmitOrderFeedback);
}
