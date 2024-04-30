import { call, put, takeEvery } from "redux-saga/effects";
import {getMessagesRequest } from "../../../services/messages";
import { getMessagesFailure, getMessagesSuccess } from "../../actions/messages";
import { messagesTypes } from "../../types/messages";

function* asyncGetMessages(): any {
  try {
    const response = yield call(getMessagesRequest);
    yield put(getMessagesSuccess(response));
  } catch (error) {
    yield put(getMessagesFailure(error));
  }
}

export function* messagesSaga() {
  yield takeEvery(messagesTypes.GET_MESSAGES, asyncGetMessages);
}
