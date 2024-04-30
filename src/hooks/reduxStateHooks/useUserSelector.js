import {useSelector} from 'react-redux';

const useUserSelector = () => {
  const {
    userDeliveryAddresses = [],
    loading: userDataLoading,
    userProfile = {},
    userDefaultDeliveryAddress,
    userBillingAccounts,
    userFavoriteOrders,
    userRecentOrders,
    isAccessibilityOn,
    error = {},
  } = useSelector(state => state.user);
  const {orders = []} = userRecentOrders || {};
  return {
    userDeliveryAddresses,
    userDefaultDeliveryAddress,
    userBillingAccounts,
    userDataLoading,
    userFavoriteOrders,
    userRecentOrders: orders,
    userProfile,
    isAccessibilityOn,
    error,
  };
};
export default useUserSelector;
