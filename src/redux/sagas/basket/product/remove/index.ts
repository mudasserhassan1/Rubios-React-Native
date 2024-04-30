import {call, put, takeEvery} from 'redux-saga/effects';
import {basketActionsTypes} from '../../../../types/basket';
import {removeProductFailure,} from '../../../../actions/basket/product/remove';
import {removeProduct} from '../../../../../services/basket';
import {removeItemHandler} from "../../../../../helpers/checkout";

function* asyncRemoveProductRequest(action: any): any {
  const {callback, item, basketid} = action || {};
  try {
    const response = yield call(removeProduct, basketid, item.id);
    removeItemHandler(response, item).then(() =>  callback?.(response));
    // yield put(removeProductSuccess(response));
  } catch (error) {
    yield put(removeProductFailure(error));
    callback?.('failure');
  }
}

export function* removeProductSaga() {
  yield takeEvery(basketActionsTypes.REMOVE_PRODUCT_REQUEST, asyncRemoveProductRequest);
}
