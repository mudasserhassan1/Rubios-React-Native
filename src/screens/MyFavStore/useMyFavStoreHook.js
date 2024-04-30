import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getRestaurantCalendar} from '../../services/restaurant/calendar';
import {formatBusinessHours, formatCalendarTime} from '../../utils/restaurantBusinessHoursUtils';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import useRestaurantsListSelector from '../../hooks/reduxStateHooks/useRestaurantsListSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../constants';
import {navigateTo} from '../../utils/navigationUtils';

const useMyFavStoreHook = () => {
  const [restaurantCalendar, setRestaurantCalendar] = useState([]);
  const [showMoreHours, setShowMoreHours] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favLocation, setFavLocation] = useState(null);
  const [fetchingAndSettingFavLocation, setFetchingAndSettingFavLocation] = useState(false);

  const {restaurantsList = {}} = useRestaurantsListSelector();
  const {restaurants = []} = restaurantsList || {};
  const {userProfile = {}} = useUserSelector();
  const {favourite_store_numbers = ''} = userProfile || {};

  const {top} = useSafeAreaInsets();
  const {name = '', streetaddress = '', city = '', distance = 0, id} = favLocation || {};

  useEffect(() => {
    if (favourite_store_numbers) {
      const matchingFav = restaurants?.filter(item => item?.extref === favourite_store_numbers)[0];
      if (matchingFav) {
        setFavLocation(matchingFav);
      }
    }
  }, []);

  const restaurantAddress = useMemo(() => `${streetaddress}, ${city}`, [city, streetaddress]);

  useEffect(() => {
    if (id) {
      getCalendar(id).then();
    }
  }, [id]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'my_favorite_store_screen',
    });
  }, []);

  useEffect(() => {
    if (!favourite_store_numbers && !name) {
      navigateTo(screens.CHOOSE_STORE, {
        onSelectItem: onSelectLocation,
        updatingFavLocation: true,
      });
    }
  }, [favourite_store_numbers, name]);

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

  const onSelectLocation = useCallback(location => {
    setFavLocation(location);
  }, []);

  const handleShowLocation = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: !favLocation ? 'Choose Restaurant' : 'Change Restaurant',
      click_destination: screens.CHOOSE_STORE,
    });
    // showLocationModal();
    navigateTo(screens.CHOOSE_STORE, {
      onSelectItem: onSelectLocation,
      updatingFavLocation: true,
    });
  };
  return {
    showMoreHours,
    toggleMoreHours,
    fullWeekCalendar,
    todayCalendar,
    restaurantAddress,
    restaurantCalendar,
    top,
    id,
    name,
    distance,
    isLocationModalVisible,
    onSelectLocation,
    loading,
    favLocation,
    handleShowLocation,
    fetchingAndSettingFavLocation,
  };
};
export default useMyFavStoreHook;
