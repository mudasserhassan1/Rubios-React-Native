import {useSelector} from 'react-redux';

const useRestaurantsListSelector = () => {
  const {
    restaurants: restaurantsList = {},
    nearbyRestaurants = {},
    loading: restaurantsLoading,
  } = useSelector(state => state.restaurantList);
  const {locations, loading: locationLoading} = useSelector(state => state.location);

  return {
    restaurantsList,
    nearbyRestaurants,
    restaurantsLoading,
    locations,
    locationLoading,
  };
};
export default useRestaurantsListSelector;
