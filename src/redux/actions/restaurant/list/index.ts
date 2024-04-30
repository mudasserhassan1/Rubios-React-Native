import {restaurantListDataActionsTypes} from '../../../types/restaurant/list';
import {ResponseRestaurantList} from '../../../../types/olo-api';
import {displayToast} from '../../../../helpers/toast';
import {addStateFullNameRestaurant} from '../../../../helpers/location';
import {store} from '../../../store';
import {logToConsole} from '../../../../configs';
import Config from "react-native-config";

export function getNearByResturantListRequest(
  lat: number,
  long: number,
  radius: number,
  limit: number,
  startDate: string,
  endDate: string,
  callback: any,
) {
  return {
    type: restaurantListDataActionsTypes.GET_NEARBY_RESTAURANT_LIST_REQUEST,
    lat,
    long,
    radius,
    limit,
    startDate,
    endDate,
    callback,
  };
}

export function getNearByResturantListRequestSuccess(data: ResponseRestaurantList) {
  return {
    type: restaurantListDataActionsTypes.GET_NEARBY_RESTAURANT_LIST_SUCCESS,
    payload: data,
  };
}

export function getNearByResturantListRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: restaurantListDataActionsTypes.GET_NEARBY_RESTAURANT_LIST_FAILURE,
    error: error,
  };
}

export function getResturantListRequest(callback: any) {
  return {
    type: restaurantListDataActionsTypes.GET_RESTAURANT_LIST_REQUEST,
    callback,
  };
}

export function getResturantListRequestSuccess(data: ResponseRestaurantList) {
  const {userProfile = {}} = store.getState().user || {};
  // @ts-ignore

  const {config = {}} = store.getState().firebaseConfig;
  const {test_store_access}: any = config

  // @ts-ignore
  const {email = ''} = userProfile || {};
  const lowerCaseTestStoreAccess = test_store_access.map(email => email.toLowerCase());
  const isTestUser = lowerCaseTestStoreAccess.includes(email);
  logToConsole({isTestUser})

  const updatedRestaurant: any = addStateFullNameRestaurant(data);

  const {exclude_restaurants = {}} = store.getState().firebaseConfig;
  const live_environment = Config.ENVIRONMENT === 'LIVE';
  // @ts-ignore
  const filterIds: any = exclude_restaurants?._value?.split(',')?.map((id: any) => Number(id));
  let filteredRestaurants:any;
  // if (live_environment) {
    filteredRestaurants = updatedRestaurant?.restaurants?.filter(
      (item: any) => !filterIds?.includes(item?.id),
  );
// }

  const payload = isTestUser ? updatedRestaurant : {restaurants: filteredRestaurants};
  logToConsole({payload});
  return {
    type: restaurantListDataActionsTypes.GET_RESTAURANT_LIST_SUCCESS,
    payload,
  };
}

export function getResturantListRequestFailure(error: any) {
  displayToast(
    'ERROR',
    error?.response?.data?.message ? error.response.data.message : 'ERROR! Please Try again later',
  );
  return {
    type: restaurantListDataActionsTypes.GET_RESTAURANT_LIST_FAILURE,
    error: error,
  };
}
