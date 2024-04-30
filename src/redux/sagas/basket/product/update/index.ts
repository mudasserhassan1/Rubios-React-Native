import {call, put, takeEvery} from 'redux-saga/effects';
import {basketActionsTypes} from '../../../../types/basket';
import {updateProductFailure} from '../../../../actions/basket/product/update';
import {updateProduct} from '../../../../../services/basket';
import {removeItemHandler} from '../../../../../helpers/checkout';
import {logToConsole} from '../../../../../configs';

function* asyncUpdateProductRequest(action: any): any {
  const {callback, errorCallback, item, basketid, request} = action || {};
  logToConsole({action});
  try {
    const response = yield call(
      updateProduct,
      basketid,
      typeof item === 'object' ? item.id : item,
      request,
    );
    removeItemHandler(response, item).then(() => {
      if (typeof callback === 'function') {
        callback(response);
      }
    });
    // yield put(updateProductSuccess(response));
  } catch (error) {
    errorCallback?.();
    yield put(updateProductFailure(error));
  }
}

export function* updateProductSaga() {
  yield takeEvery(basketActionsTypes.UPDATE_PRODUCT_REQUEST, asyncUpdateProductRequest);
}
