import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import useRewardsSelector from '../../hooks/reduxStateHooks/useRewardsSelector';
import {screens, strings} from '../../constants';
import {getUserprofile, getUserRecentOrders} from '../../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {getResturantListRequest} from '../../redux/actions/restaurant/list';
import useRestaurantsListSelector from '../../hooks/reduxStateHooks/useRestaurantsListSelector';
import {setResturantInfoRequest} from '../../redux/actions/restaurant';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {delay} from '../../utils/sharedUtils';
import {navigateTo} from '../../utils/navigationUtils';
import {basketTransferReset} from '../../redux/actions/basket/transfer';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useReorderHook from '../../hooks/useReorderHook';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import analytics from '@react-native-firebase/analytics';
import Config from 'react-native-config';
import {USEASQRCODESheetStatus} from '../../redux/actions/modalSheetStatus';
import useModalSheetStatusSelector from '../../hooks/reduxStateHooks/useModalSheetStatusSelector';
import {getMessages} from '../../redux/actions/messages';

const useHomeScreen = () => {
  const [isVisibleLocationModal, setIsVisibleLocationModal] = useState(false);
  const scanSnapPoints = useMemo(() => ['59.7%'], []);
  const {isGuest} = useGuestSelector();
  const {loadingNewRewards = false} = useRewardsSelector();
  const {userRecentOrders = [], userDataLoading = false} = useUserSelector();
  const {restaurantsList = {}, restaurantsLoading} = useRestaurantsListSelector();
  const {restaurants = []} = restaurantsList || {};
  const {userProfile} = useUserSelector();
  const {favourite_store_numbers = ''} = userProfile || {};
  const {restaurant: selectedRestaurantForOrder = {}} = useRestaurantInfoSelector();
  const {basket} = useBasketSelector();
  const {providerToken = {}} = useSelector(state => state?.provider);
  const {user = {}} = providerToken || {};
  const {user_id = 0} = user || {};
  const {isAccessibilityEnabledOnHomeScreen = false} = useModalSheetStatusSelector() || {};

  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const sideMenuSheetRef = useRef();
  const rewardsCodeSheetRef = useRef();

  const navigation = useNavigation();

  const mostRecentOrder = userRecentOrders[0];
  const {reorderLoading} = useReorderHook();

  const screenLoading = useMemo(() => {
    return loadingNewRewards || restaurantsLoading;
  }, [loadingNewRewards, userDataLoading, restaurantsLoading]);

  // useEffect(() => {
  //   OTPublishersNativeSDK.startSDK(
  //     'cdn.cookielaw.org',
  //     Platform.OS === 'ios'
  //       ? '39d4782a-6dfd-42d5-a137-30047da19536-test'
  //       : 'e876c803-4d82-4166-a3fb-a87327b79224-test',
  //     'en',
  //     {countryCode: '', regionCode: ''},
  //     true,
  //   )
  //     .then(responseObject => {
  //       logToConsole({responseObject});
  //     })
  //     .catch(error => {
  //       logToConsole(error);
  //       console.error(`OneTrust download failed with error ${error}`);
  //     });
  // }, []);

  useEffect(() => {
    if (!isGuest) {
      dispatch(getResturantListRequest());
    }
  }, [dispatch, isGuest]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: screens.HOME_SCREEN,
    });
  }, []);

  useEffect(() => {
    if (Config.ENVIRONMENT === 'LIVE') {
      if (!isGuest) {
        analytics()?.setUserId(user_id.toString());
        analytics()?.setUserProperty('user_type', 'logged_in');
      } else {
        analytics()?.setUserProperty('user_type', 'guest');
      }
    }
  }, [isGuest]);

  useFocusEffect(
    useCallback(() => {
      if (!isGuest) {
        dispatch(getUserRecentOrders());
        dispatch(getUserprofile());
        dispatch(getMessages());
      }
    }, [dispatch, isGuest]),
  );

  useEffect(() => {
    dispatch(basketTransferReset());
  }, [dispatch]);

  useEffect(() => {
    if (!isGuest && !selectedRestaurantForOrder && favourite_store_numbers) {
      const matchingFav = restaurants?.filter(item => item?.extref === favourite_store_numbers)[0];
      if (matchingFav) {
        dispatch(setResturantInfoRequest(matchingFav, ''));
      }
    }
  }, [dispatch, favourite_store_numbers, isGuest, restaurants]);

  const showOrderInProgressView = useMemo(
    () =>
      (!isGuest && (
            userRecentOrders?.[0]?.status === 'Scheduled' ||
            userRecentOrders?.[0]?.status === 'In Progress'
        )),
    [isGuest, userRecentOrders],
  );
  const showLocationModal = useCallback(() => setIsVisibleLocationModal(true), []);
  const hideLocationModal = useCallback(() => setIsVisibleLocationModal(false), []);

  const handleQRCodePress = useCallback(() => {
    if (isGuest) {
      logFirebaseCustomEvent(strings.click, {
        click_label: strings.scan_qr_code,
        click_destination: 'Open Guest Crate Account/Login Modal Sheet',
      });
      return bottomSheetRef?.current?.openSheet?.();
    }
    logFirebaseCustomEvent(strings.click, {
      click_label: strings.scan_qr_code,
      click_destination: 'Open Restaurant List Modal Sheet',
    });
    dispatch(USEASQRCODESheetStatus(true));
    return rewardsCodeSheetRef?.current?.openSheet?.();
  }, [isGuest]);

  const onStartOrderPress = useCallback(() => {
    if (selectedRestaurantForOrder) {
      logFirebaseCustomEvent(strings.click, {
        click_label: strings.start_order,
        click_destination: screens.CHOOSE_ORDER_TYPE,
      });
      return navigateTo(screens.CHOOSE_ORDER_TYPE, {fromHome: true});
    }
    logFirebaseCustomEvent(strings.click, {
      click_label: strings.start_order,
      click_destination: 'Open Location Modal Sheet',
    });
    // return showLocationModal();
    return navigateTo(screens.CHOOSE_STORE, {
      onSelectItem: onSelectLocation,
    });
  }, [selectedRestaurantForOrder]);

  const onReorderPress = useCallback(() => {
    // onReorder(mostRecentOrder);
    navigation.navigate(screens.MY_ORDERS);
  }, [mostRecentOrder]);

  const isReorderEligible = useMemo(
    () => !isGuest && userRecentOrders?.length > 0,
    [isGuest, userRecentOrders],
  );

  const onSelectLocation = useCallback(
    async location => {
      dispatch(setResturantInfoRequest(location, ''));
      hideLocationModal();
      await delay(400);
      navigation.replace(screens.CHOOSE_ORDER_TYPE, {fromHome: true});
    },
    [dispatch, hideLocationModal, navigation],
  );
  const closeRewardsCodeBottomSheet = () => {
    rewardsCodeSheetRef?.current?.closeSheet();
    logFirebaseCustomEvent(strings.click, {
      click_label: 'crossIcon',
      click_destination: 'Close Modal Sheet',
    });
    dispatch(USEASQRCODESheetStatus(false));
  };

  const onSigninPress = () => {
    return navigation.navigate('AuthStack', {
      screen: screens.SIGN_IN,
      params: {comingFromSideMenu: true},
    });
  };

  return {
    isGuest,
    screenLoading,
    handleQRCodePress,
    onStartOrderPress,
    onReorderPress,
    isReorderEligible,
    bottomSheetRef,
    isVisibleLocationModal,
    showLocationModal,
    hideLocationModal,
    onSelectLocation,
    sideMenuSheetRef,
    showOrderInProgressView,
    userRecentOrders,
    navigation,
    rewardsCodeSheetRef,
    reorderLoading,
    userDataLoading,
    restaurantsLoading,
    selectedRestaurantForOrder,
    userProfile,
    restaurants,
    closeRewardsCodeBottomSheet,
    onSigninPress,
    scanSnapPoints,
    isAccessibilityEnabledOnHomeScreen,
  };
};
export default useHomeScreen;
