import {takeEvery, put, call} from 'redux-saga/effects';
import {restaurantListDataActionsTypes} from '../../../types/restaurant/list';
import {getNearByRestaurants, getAllResturants} from '../../../../services/location';
import {
  getNearByResturantListRequestSuccess,
  getNearByResturantListRequestFailure,
  getResturantListRequestSuccess,
  getResturantListRequestFailure,
} from '../../../actions/restaurant/list';

function* asyncNearbyResturantListRequest(action: any): any {
  try {
    const {callback} = action || {};
    const response = yield call(
      getNearByRestaurants,
      action.lat,
      action.long,
      action.radius,
      action.limit,
      action.startDate,
      action.endDate,
    );

    yield put(getNearByResturantListRequestSuccess(response));
    if (typeof callback === 'function') {
      callback(response);
    }
  } catch (error) {
    const {callback} = action || {};
    yield put(getNearByResturantListRequestFailure(error));
    if (typeof callback === 'function') {
      // callback('ERROR');
    }
  }
}

function* asyncResturantListRequest(action: any): any {
  try {
    const {callback} = action || {};
    const response = yield call(getAllResturants);
    yield put(getResturantListRequestSuccess(response));
    if (typeof callback === 'function') {
      callback?.('SUCCESS', response);
    }
  } catch (error) {
    const {callback} = action || {};
    yield put(getResturantListRequestFailure(error));
    if (typeof callback === 'function') {
      callback?.('ERROR');
    }
  }
}

export function* resturantListSaga() {
  yield takeEvery(
    restaurantListDataActionsTypes.GET_RESTAURANT_LIST_REQUEST,
    asyncResturantListRequest,
  );
  yield takeEvery(
    restaurantListDataActionsTypes.GET_NEARBY_RESTAURANT_LIST_REQUEST,
    asyncNearbyResturantListRequest,
  );
}
