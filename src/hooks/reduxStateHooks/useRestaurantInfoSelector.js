import {useSelector} from 'react-redux';

const useRestaurantInfoSelector = () => {
  const {restaurant, orderType, loading, error,streetaddress} = useSelector(
    (state: any) => state.restaurantInfo,
  );
  return {
    restaurant,
    orderType,
    streetaddress,
    loading,
    error
  };
};
export default useRestaurantInfoSelector;
