import useUserSelector from '../../../hooks/reduxStateHooks/useUserSelector';
import {useEffect} from 'react';
import {getUserRecentOrders} from '../../../redux/actions/user';
import {useDispatch} from 'react-redux';

const useRecentOrdersHook = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserRecentOrders());
  }, []);

  const {userRecentOrders, userDataLoading} = useUserSelector();
  const {orders} = userRecentOrders || {};
  return {orders, userDataLoading};
};
export default useRecentOrdersHook;
