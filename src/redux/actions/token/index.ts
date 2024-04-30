import {tokenActionsTypes as Type} from '../../types/token';

export const getTokenRequest = (code: any) => ({type: Type.GET_TOKEN_REQUEST, code});
// export function getTokenRequest(code: string) {
//   return {
//     type: Type.GET_TOKEN_REQUEST,
//     code,
//   };
// }

export function getTokenRequestSuccess(data: any) {
  return {
    type: Type.GET_TOKEN_SUCCESS,
    payload: data,
  };
}

export function getTokenRequestFailure(error: any) {
  return {
    type: Type.GET_TOKEN_FAILURE,
    error: error,
  };
}

export function getFcmTokenSuccess(data: any) {
  return {
    type: Type.GET_FCM_TOKEN_SUCCESS,
    payload: data,
  };
}
