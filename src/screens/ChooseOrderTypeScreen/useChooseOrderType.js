import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {getRestaurantCalendar} from '../../services/restaurant/calendar';
import {formatBusinessHours, formatCalendarTime} from '../../utils/restaurantBusinessHoursUtils';
import {useDispatch} from 'react-redux';
import {setRestaurantInfoOrderType} from '../../redux/actions/restaurant';
import {goBack, moveToPreviousScreenWithMerge, navigateTo} from '../../utils/navigationUtils';
import {constants, screens, strings} from '../../constants';
import {useRoute} from '@react-navigation/native';
import {setBasketDeliveryMode} from '../../services/basket';
import {setBasketDeliveryAddressSuccess} from '../../redux/actions/basket/checkout';
import {displayToast} from '../../helpers/toast';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {Alert, StatusBar} from 'react-native';
import useTransferBasketSelector from '../../hooks/reduxStateHooks/useTransferBasketSelector';
import {basketTransferReset} from '../../redux/actions/basket/transfer';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {logToConsole} from "../../configs";

const useChooseOrderType = () => {
  const [restaurantCalendar, setRestaurantCalendar] = useState([]);
  const [showMoreHours, setShowMoreHours] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [handoffModeLoading, setHandOffModeLoading] = useState(false);

  const {restaurant = {}, orderType: orderHandOffMode = ''} = useRestaurantInfoSelector();
  const [selectedOrderType, setSelectedOrderType] = useState(orderHandOffMode);

  const dispatch = useDispatch();
  const {params = {}, name: screenName = ''} = useRoute();
  const {changingOrderType = false, fromScreen = '', fromHome = false} = params || {};

  const {top} = useSafeAreaInsets();
  const {
    name = '',
    streetaddress = '',
    city = '',
    distance = 0,
    id,
    supportsdispatch = false,
  } = restaurant || {};

  const {basket} = useBasketSelector();
  const {transferredBasket} = useTransferBasketSelector();
  const {id: basketId = ''} = basket || {};

  const restaurantAddress = useMemo(() => `${streetaddress}, ${city}`, [city, streetaddress]);

  useEffect(() => {
    if (id) {
      getCalendar(id).then();
    }
  }, [id]);

  const showLocationModal = useCallback(() => setIsLocationModalVisible(true), []);
  const hideLocationModal = useCallback(() => setIsLocationModalVisible(false), []);

  useEffect(() => {
    if (name === '') {
      logToConsole({insideThis: true})
      showLocationModal();
    }
  }, [restaurant]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'choose_order_type_screen',
    });
  }, []);

  const getCalendar = async resId => {
    try {
      setLoading(true);
      const today = new Date();
      const dateFrom =
        today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate() + '';
      const lastWeekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);

      const dateTo =
        lastWeekDate.getFullYear() * 1e4 +
        (lastWeekDate.getMonth() + 1) * 100 +
        lastWeekDate.getDate() +
        '';
      const {calendar} = await getRestaurantCalendar(resId, dateFrom, dateTo);
      setLoading(false);
      setRestaurantCalendar(calendar);
    } catch (e) {
      setLoading(false);
    }
  };

  const reArrangeCalenderRange = calendars => {
    const formattedRange = [];
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
      calendars?.ranges?.forEach(range => {
        if (range?.weekday?.toLowerCase() === day.toLowerCase()) {
          return formattedRange.push(range);
        }
      });
    });
    return formattedRange;
  };

  const {fullWeekCalendar, todayCalendar} = useMemo(() => {
    const businessCalendar = restaurantCalendar?.filter(item => item.type === 'business')[0] || [];
    const todayCalendarStart = formatCalendarTime(businessCalendar?.ranges?.[0]?.start);
    const todayCalendarEnd = formatCalendarTime(businessCalendar?.ranges?.[0]?.end);

    const businessHours = reArrangeCalenderRange(businessCalendar);
    const formattedHours = formatBusinessHours(businessHours);
    return {
      todayCalendar: `Open Today: ${todayCalendarStart} - ${todayCalendarEnd}`,
      fullWeekCalendar: formattedHours,
    };
  }, [restaurantCalendar]);

  const toggleMoreHours = useCallback(() => setShowMoreHours(prevState => !prevState), []);

  const onSelectLocation = useCallback(
    (selectedLocation, isCancelLocation) => {
      if (changingOrderType && fromScreen) {
        if (transferredBasket && transferredBasket?.products?.length === 0 && !isCancelLocation) {
          dispatch(basketTransferReset());
          moveToPreviousScreenWithMerge(screens.MENU_CATEGORIES);
        } else {
          moveToPreviousScreenWithMerge(fromScreen || screens.MENU_CATEGORIES);
        }
      } else {
        goBack();
      }
    },
    [changingOrderType, fromScreen, hideLocationModal, transferredBasket],
  );

  const updateBasketHandOffMode = async orderType => {
    if (orderType === constants.handOffMode.DISPATCH) {
      return navigateTo(screens.DELIVERY_FLOW, {fromScreen, changingOrderType, orderType});
    }
    try {
      const body = {
        deliverymode: orderType,
      };
      setHandOffModeLoading(true);
      const response = await setBasketDeliveryMode(basketId, body);
      dispatch(setBasketDeliveryAddressSuccess(response)); //updating basket in redux
      dispatch(setRestaurantInfoOrderType(orderType));
      setHandOffModeLoading(false);
      moveToPreviousScreenWithMerge(fromScreen || screens.MENU_CATEGORIES);
      changingOrderType && displayToast('SUCCESS', 'Order type updated.');
    } catch (error) {
      setHandOffModeLoading(false);
      displayToast(
        'ERROR',
        error?.response?.data?.message || 'ERROR! Please Try again later',
        true,
      );
    }
  };

  const handleStatusbarChanges = statusbarStyle => {
    if (screenName === screens.CHOOSE_ORDER_TYPE) {
      StatusBar.setBarStyle(statusbarStyle);
    }
  };

  const onChooseOrderType = useCallback(
    async orderType => {
      setSelectedOrderType(orderType);
      if (!basketId || basket?.deliverymode === orderType) {
        dispatch(setRestaurantInfoOrderType(orderType));
        if (orderType === constants.handOffMode.PICKUP) {
          logFirebaseCustomEvent(strings.select_order_type, {
            order_type: constants.handOffMode.PICKUP,
          });
          return navigateTo(fromScreen || screens.MENU_CATEGORIES);
        }
        logFirebaseCustomEvent(strings.select_order_type, {
          order_type: constants.handOffMode.DISPATCH,
        });
        return navigateTo(screens.DELIVERY_FLOW, {fromScreen, changingOrderType, orderType});
      }
      //basket exists
      if (basket?.deliverymode !== orderType) {
        return await updateBasketHandOffMode(orderType);
      }
    },
    [basket?.deliverymode, basketId, dispatch, fromScreen],
  );

  const handleChangeRestaurantPress = () => {
    if (selectedOrderType === constants.handOffMode.DISPATCH) {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'Change Restaurant',
        click_destination: 'Open Consent Dialog',
      });
      Alert.alert(
        'Change Delivery Address',
        'You have selected delivery mode. Do you want to change current delivery address?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Change',
            onPress: () =>
              navigateTo(screens.DELIVERY_FLOW, {
                changingOrderType,
                fromScreen,
                orderType: selectedOrderType,
              }),
          },
        ],
      );
    } else {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'Change Restaurant',
        click_destination: 'Open Change Location Modal Sheet',
      });
      // showLocationModal();
      navigateTo(screens.CHOOSE_STORE, {
        selectedOrderType,
        onSelectItem: onSelectLocation,
      });
    }
  };
  return {
    showMoreHours,
    toggleMoreHours,
    showLocationModal,
    hideLocationModal,
    fullWeekCalendar,
    todayCalendar,
    restaurantAddress,
    handleStatusbarChanges,
    restaurantCalendar,
    top,
    id,
    name,
    distance,
    isLocationModalVisible,
    onSelectLocation,
    onChooseOrderType,
    loading,
    orderHandOffMode,
    changingOrderType,
    supportsdispatch,
    handleChangeRestaurantPress,
    handoffModeLoading,
    fromHome,
    selectedOrderType,
    restaurant,
  };
};
export default useChooseOrderType;
