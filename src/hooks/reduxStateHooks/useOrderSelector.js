import {useSelector} from 'react-redux';

const useOrderSelector = () => {
  const state = useSelector((state) => state.order);
  const {order: orderData, restaurant: restaurantData} = state || {};
  const {data: order = {}, loading: loadingOrder} = orderData || {};
  const {data: restaurant = {}, loading: loadingRestaurant} = restaurantData || {};
  return {
    order,
    loadingOrder,
    loadingRestaurant,
    restaurant,
  };
};
export default useOrderSelector;
