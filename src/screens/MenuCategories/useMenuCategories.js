import {useEffect} from 'react';
import {getCategoriesRequest} from '../../redux/actions/category';
import {useDispatch, useSelector} from 'react-redux';
import {screens, strings} from '../../constants';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {navigateTo} from '../../utils/navigationUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {logToConsole} from '../../configs';

const useMenuCategories = () => {
  const {mLoading, mCategories} = useSelector(
    ({category: {loading: mLoading, categories: mCategories}}) => ({
      mLoading,
      mCategories,
    }),
  );
  const {orderType, restaurant} = useRestaurantInfoSelector();
  const {id: restaurantId, name: restaurantName, streetaddress, city} = restaurant || {};

  const dispatch = useDispatch();

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'menu_categories_screen',
    });
  }, []);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getCategoriesRequest(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const onCategoryPress = item => {
    // logToConsole({item: item?.metadata});
    navigateTo(screens.MENU, {
      restaurantId,
      orderType,
      restaurantName,
      category: item,
      metaData: item?.metadata,
    });
  };
  return {
    mCategories,
    orderType,
    mLoading,
    restaurantName,
    onCategoryPress,
    streetaddress,
    city,
  };
};
export default useMenuCategories;
