import {restaurantActionsTypes} from '../../types/restaurant';
import {ResponseRestaurant} from '../../../types/olo-api';
import {displayToast} from '../../../helpers/toast';

export function getResturantInfoRequest(id: number) {
  return {
    type: restaurantActionsTypes.GET_RESTAURANT_INFO_REQUEST,
    restaurantID: id,
  };
}

export function getResturantInfoRequestSuccess(data: ResponseRestaurant) {
  return {
    type: restaurantActionsTypes.GET_RESTAURANT_INFO_SUCCESS,
    payload: data,
  };
}

export function getResturantInfoRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: restaurantActionsTypes.GET_RESTAURANT_INFO_FAILURE,
    error: error,
  };
}

export function setResturantInfoRequest(restaurant: any, orderType: string) {
  return {
    type: restaurantActionsTypes.SET_RESTAURANT_INFO_REQUEST,
    restaurant,
    orderType,
  };
}

export function setResturantInfoRequestSuccess(data: any, orderType: string) {
  return {
    type: restaurantActionsTypes.SET_RESTAURANT_INFO_SUCCESS,
    payload: data,
    orderType,
  };
}

export function setRestaurantInfoOrderType(data: string) {
  return {
    type: restaurantActionsTypes.SET_RESTAURANT_INFO_ORDER_TYPE,
    payload: data,
  };
}
export function setResturantInfoRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: restaurantActionsTypes.SET_RESTAURANT_INFO_FAILURE,
    error: error,
  };
}
