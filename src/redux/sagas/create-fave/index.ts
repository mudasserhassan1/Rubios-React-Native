import {takeEvery, put, call} from 'redux-saga/effects';
import {createFaveTypes as Type} from '../../types/create-fave';
import {requestCreateFave} from '../../../services/create-fave';
import {createFaveFailure, createFaveSuccess} from '../../actions/create-fave';
import {requestCreateBasket} from '../../../services/basket';
import {getUserFavouriteOrders} from "../../actions/user";

/*function* createFaveHandler(action: any): any {
  try {
    const response = yield call(requestCreateFave, action.payload);
    const favId =
      (response &&
        response.faves &&
        response.faves.length &&
        response.faves[0].id) ||
      '';
    yield markOrderFav(action.payload.basketid, favId, true);
    yield updateLocalRecentOrdersList();
    const recentorders = yield call(requestUserRecentOrders);
    yield put(getUserRecentOrdersSuccess(recentorders));
    yield put(createFaveSuccess(response));
  } catch (error) {
    yield put(createFaveFailure(error));
  }
}*/

function* createFaveHandler(action: any): any {
  const {callBack} = action || {};
  try {
    const basketResponse = yield call(requestCreateBasket, action.payload.order);
    const payload = {
      ...action.payload.basket,
      basketid: basketResponse.id,
    };
    yield call(requestCreateFave, payload);
    // const recentorders = yield call(requestUserRecentOrders);
    // yield put(getUserRecentOrdersSuccess(recentorders));
    yield put(createFaveSuccess());
    yield put(getUserFavouriteOrders());
    callBack?.('success');
  } catch (error) {
    callBack?.('fail');
    yield put(createFaveFailure(error));
  }
}
export function* createFaveSaga() {
  yield takeEvery(Type.CREATE_FAVE, createFaveHandler);
}
