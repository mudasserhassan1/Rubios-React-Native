import { offersType as Type } from "../../types/offers";

export function getOffers() {
  return {
    type: Type.GET_OFFERS,
  };
}

export function offersSuccess(data: any) {
  return {
    type: Type.GET_OFFERS_SUCCESS,
    payload: data,
  };
}

export function offersFailure(data: any) {
  return {
    type: Type.GET_OFFERS_FAILURE,
    payload: data,
  };
}
