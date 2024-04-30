import {useCallback, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserRecentOrders} from '../../redux/actions/user';
import {constants, screens, strings} from '../../constants';
import {navigateTo} from '../../utils/navigationUtils';
import {Keyboard} from 'react-native';
import {formatDateTime} from '../../utils/timeUtils';
import {useFocusEffect} from '@react-navigation/native';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const useRecentOrdersHook = () => {
  const [favOrder, setFavOrder] = useState(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  const bottomSheetRef = useRef();
  const dispatch = useDispatch();
  const {isGuest} = useGuestSelector();
  const {userRecentOrders, loading: dataLoading} = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserRecentOrders());
    }, []),
  );
  const showOrderInProgressView = useMemo(
    () =>
      (!isGuest && userRecentOrders?.orders?.[0]?.status === 'Scheduled') ||
      (!isGuest && userRecentOrders?.orders?.[0]?.status === 'In Progress'),
    [userRecentOrders],
  );

  const recentOrders = useMemo(() => {
    if (userRecentOrders?.orders) {
      const groupedData = userRecentOrders.orders.reduce((acc, item) => {
        const time = formatDateTime(
          item.timeplaced,
          constants.TIME_FORMAT.DMY_SLASH_,
          constants.TIME_FORMAT.YYYYMMDD_HH_mm,
        );
        acc[time] = [...(acc[time] || []), item];
        return acc;
      }, {});

      return Object.entries(groupedData).map(([title, data]) => {
        return {
          title,
          data,
        };
      });
    }
    return [];
  }, [userRecentOrders]);

  const onFavClick = item => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'add_to_favorites',
      click_destination: 'Open Add To Favorites Modal Sheet',
    });
    const order = item;
    setFavOrder(order);
    bottomSheetRef?.current?.openSheet?.();
  };

  const handleSheetChanges = useCallback(index => {
    if (index === 0) {
      Keyboard.dismiss();
    }
  }, []);

  const goToOrderFeedBack = item => {
    navigateTo(screens.ORDER_FEEDBACK, {
      orderId: item?.item?.id,
      vendorid: item?.item?.vendorid,
    });
  };
  const handleClosePress = () => {
    bottomSheetRef.current?.closeSheet();
  };
  return {
    recentOrders,
    favOrder,
    setFavOrder,
    onFavClick,
    dataLoading,
    goToOrderFeedBack,
    bottomSheetRef,
    handleSheetChanges,
    snapPoints,
    handleClosePress,
    showOrderInProgressView,
    isGuest,
  };
};
export default useRecentOrdersHook;
