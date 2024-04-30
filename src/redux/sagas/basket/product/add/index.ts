import {takeEvery, put, call} from 'redux-saga/effects';
import {basketActionsTypes} from '../../../../types/basket';
import {addProductSuccess, addProductFailure} from '../../../../actions/basket/product/add';
import {addSingleProduct} from '../../../../../services/basket';

function* asyncAddProductRequest(action: any): any {
  const {errorCallback, callback} = action || {};
  try {
    const response = yield call(addSingleProduct, action.basketid, action.request);
    yield put(addProductSuccess(response));

    if (typeof callback === 'function') {
      callback?.(response);
    }
  } catch (error) {
    errorCallback?.();
    yield put(addProductFailure(error));
  }
}

export function* addProductSaga() {
  yield takeEvery(basketActionsTypes.ADD_PRODUCT_REQUEST, asyncAddProductRequest);
}
