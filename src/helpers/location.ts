import {US_STATES} from './usStates';
import {constants} from '../constants';
import Config from 'react-native-config';

export function removeTestingStores(restaurants: any) {
  const restaurantIds: any = `${Config.REACT_APP_TESTING_RESTAURANTS_IDS}` || '';
  if (restaurantIds === 'undefined') {
    return restaurants;
  }
  let filterRestaurants;
  const testingStores: any = JSON.parse(restaurantIds) || [];

  filterRestaurants = restaurants.filter((rest: any) => {
    return !testingStores.includes(rest.id.toString());
  });
  return filterRestaurants;
}

export function getOrderTypeRestaurants(restaurants: any, type: string | null) {
  let filteredRestaurants = restaurants;
  if (type && type !== '') {
    if (type === constants.handOffMode.PICKUP) {
      filteredRestaurants = restaurants.filter((x: any) => x.canpickup === true);
    } else if (type === constants.handOffMode.CURBSIDE) {
      filteredRestaurants = restaurants.filter((x: any) => x.supportscurbside === true);
    } else if (type === constants.handOffMode.DISPATCH) {
      filteredRestaurants = restaurants.filter((x: any) => x.supportsdispatch === true);
    }
  }
  filteredRestaurants = removeTestingStores(filteredRestaurants);
  return filteredRestaurants;
}

export function addStateFullNameRestaurant(data: any) {
  if (data?.restaurants?.length) {
    let updatedRestaurants = data.restaurants.map((restaurant: any) => {
      const newRestaurant = {
        ...restaurant,
      };
      if (restaurant.state && US_STATES[restaurant.state]) {
        newRestaurant.stateName = US_STATES[restaurant.state];
      }
      return newRestaurant;
    });
    return {
      restaurants: updatedRestaurants,
    };
  } else {
    return data;
  }
}
