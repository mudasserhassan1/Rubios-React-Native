import {useState, useEffect, useRef, useCallback} from 'react';
import useRestaurantsListSelector from '../../hooks/reduxStateHooks/useRestaurantsListSelector';
import {
  getNearByResturantListRequest,
  getResturantListRequest,
} from '../../redux/actions/restaurant/list';
import {constants, strings} from '../../constants';
import {useDispatch} from 'react-redux';
import {useMemo} from 'react';
import {isAndroid, isIos} from '../../utils/sharedUtils';
import {Keyboard} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {handleBlockedPermission} from '../../utils/permissionsUtils';
import {getLatLngFromAddress} from '../../utils/addressUtils';
import {getNearByRestaurants, requestSingleLocation} from '../../services/location';
import useSelectLocation from '../../hooks/useSelectLocation';
import {basketTransferReset} from '../../redux/actions/basket/transfer';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {checkMultiple, PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import {displayToast} from '../../helpers/toast';
import {goBack} from '../../utils/navigationUtils';
import {updateUser} from '../../redux/actions/user';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import GetLocation from 'react-native-geolocation-service';
import {debounce} from 'lodash';

const DUMMY_LAT = 33.68611;
const DUMMY_LNG = -118.00662;
const BROAD_VIEW_ZOOM = 9;
const LOCATION_VIEW_ZOOM = 12;
const ANIMATE_REGION_ZOOM = 10;
const CURRENT_LOCATION_ZOOM = 8;
const useChooseStore = ({onClose}) => {
  const [mCamera, setMCamera] = useState({
    altitude: 0,
    center: {latitude: 0, longitude: 0},
    heading: 0,
    pitch: 0,
    zoom: 12,
  });
  // const [availableRestaurants, setAvailableRestaurants] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [fetchingAndSettingFavLocation, setFetchingAndSettingFavLocation] = useState(false);

  const mapRef = useRef();
  const flatListRef = useRef();

  const {isAccessibilityOn} = useUserSelector();

  const route = useRoute();
  const {name = '', params = {}} = route || {};
  const {
    selectedOrderType = '',
    onSelectItem = () => {},
    updatingFavLocation,
    choosingFavLocation,
  } = params || {};

  const {userProfile = {}} = useUserSelector();
  const {favourite_store_numbers = ''} = userProfile || {};

  //formHome add
  const {onSelectLocation, transferredBasketLoading, loading} = useSelectLocation({
    newLocation: selectedLocation,
    orderType: selectedOrderType,
    onSelectNewLocation: onSelectItem,
    onClose,
    name,
  });
  const {
    restaurantsList,
    nearbyRestaurants,
    restaurantsLoading: restaurantsListLoading,
  } = useRestaurantsListSelector();
  const {restaurants: allRestaurants = []} = restaurantsList || {};

  const {restaurants: nearestRestaurants = []} = nearbyRestaurants || {};
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const dispatch = useDispatch();

  const isSearchActive = useMemo(() => !!searchVal, [searchVal]);

  useEffect(() => {
    if (!restaurantsList && !isLocationAllowed) {
      dispatch(getResturantListRequest());
    }
  }, [dispatch, isLocationAllowed, restaurantsList]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'choose_store_screen',
    });
    dispatch(basketTransferReset());
  }, []);

  const onCurrentLocationPress = async (checkBlockStatus = true) => {
    const permissionType = isIos
      ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.LOCATION_ALWAYS]
      : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
    const checkStatus = await checkMultiple(permissionType);
    if (
      checkStatus[
        isIos ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      ] === RESULTS.DENIED
    ) {
      const reqStatus = await requestMultiple(permissionType);
      //Android will never return blocked status after a check.You will have to request permission to get status
      if (
        checkBlockStatus &&
        isAndroid &&
        reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.BLOCKED
      ) {
        //Permission is not allowed
        setIsLocationAllowed(false);
        return handleBlockedPermission(reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      }
      if (
        reqStatus[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
        reqStatus[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
        reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
      ) {
        return handleGetLocationAndNearbyRestaurants();
      }
    }
    if (
      checkStatus[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
      checkStatus[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
      checkStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    ) {
      return handleGetLocationAndNearbyRestaurants();
    }
    //Permission is not allowed
    if (checkBlockStatus) {
      setIsLocationAllowed(false);
      return handleBlockedPermission(
        checkStatus[
          isIos ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        ],
      );
    }
  };

  useEffect(() => {
    onCurrentLocationPress(false).then(r => {});
  }, []);

  const markersCountRef = useRef(0);

  const calculateMarkers = (restaurants, zoomLevel = 7) => {
    if (restaurants?.length) {
      if (markersCountRef.current !== restaurants.length) {
        const markerList = restaurants.map((rest) => {
          const {latitude = 0.0, longitude = 0.0, name = '', id} = rest || {};
          return {
            id: id,
            coordinate: {latitude, longitude},
            title: name,
            description: name,
            locationId: id,
          };
        });
        setMarkers(markerList);
        markersCountRef.current = markerList.length;
        const {latitude = 0.0, longitude = 0.0} = restaurants[0] || {};
        // mapRef?.current?.animateCamera({
        //   zoom: 0,
        //   center: {latitude, longitude},
        // }, 1000);
        mapRef?.current?.animateCamera({
          center: {latitude, longitude},
          zoom: BROAD_VIEW_ZOOM,
        }, {duration: 1000})
      }
    }
  };

  const availableRestaurants = useMemo(() => {
    if (isSearchActive && filteredLocations.length > 0) {
      return filteredLocations;
    }
    if (!gettingLocation) {
      if (isLocationAllowed) {
        return nearestRestaurants?.filter(item => item.isavailable);
      }
      return allRestaurants?.filter(item => item.isavailable);
    }
    return [];
  }, [allRestaurants, gettingLocation, isLocationAllowed, nearestRestaurants, isSearchActive, filteredLocations]);

  useEffect(() => {
    if (availableRestaurants?.length) {
      return calculateMarkers(availableRestaurants);
    }
  }, [availableRestaurants, gettingLocation]);

  const snapPoints = useMemo(() => ['17%', '60%'], []);

  Array.prototype.hasMin = function (attrib) {
    return (
      (this.length &&
        this.reduce(function (prev, curr) {
          return prev[attrib] < curr[attrib] ? prev : curr;
        })) ||
      null
    );
  };

  const nearestRestaurantToLocation = useMemo(() => {
    if (isSearchActive) {
      return filteredLocations?.hasMin('distance');
    }
    if (isLocationAllowed) {
      return availableRestaurants?.hasMin('distance');
    }
    return null;
  }, [availableRestaurants, filteredLocations, isLocationAllowed, isSearchActive]);

  const handleSheetChanges = useCallback(index => {
    if (index === 0) {
      Keyboard.dismiss();
    }
  }, []);

  const handleGetLocationAndNearbyRestaurants = () => {
    setGettingLocation(true);
    GetLocation.getCurrentPosition(
      location => {
        const {coords} = location || {};
        setIsLocationAllowed(true);
        getNearBy(coords.latitude, coords.longitude);
        mapRef?.current?.animateCamera({
          center: coords,
          zoom: CURRENT_LOCATION_ZOOM
        }, {duration: 1000});
        setTimeout(() => {
          mapRef?.current?.animateCamera({
            center: coords,
            zoom: BROAD_VIEW_ZOOM
          }, {duration: 1500})
        }, 1100)
      },
      () => {
        setGettingLocation(false);
        setIsLocationAllowed(false);
      },
      {enableHighAccuracy: true},
    );
  };

  const searchLocations = useCallback(
    async searchText => {
      markersCountRef.current = 0;
      setSelectedLocation(null);
      const searchTextTrim = (searchText && searchText?.trim().toLowerCase()) || '';
      if (searchTextTrim && allRestaurants?.length) {
        //Search the restaurant zip codes
        let filteredResults = [];
        if (searchTextTrim.length < 4) {
          filteredResults = availableRestaurants.filter((x) =>
              x.zip.includes(searchTextTrim),
          );
        }
        if (filteredResults.length === 0) {
          //Searching the restaurant name
          filteredResults = allRestaurants?.filter(x =>
              x?.name?.toLowerCase().includes(searchTextTrim),
          );
        }
        if (filteredResults?.length === 0) {
          // Searching the restaurant city or state
          filteredResults = allRestaurants?.filter(x => x?.city?.toLowerCase() === searchTextTrim);
        }
        if (filteredResults?.length === 0) {
          //Searching based on State
          filteredResults = allRestaurants?.filter(
            x =>
              x?.state?.toLowerCase() === searchTextTrim ||
              x?.stateName?.toLowerCase() === searchTextTrim,
          );
        }
        setFilteredLocations(filteredResults?.filter(item => item.isavailable));
        if (filteredResults.length === 0) {
          setSearchLoading(true);
          //Searching based on address
          getLatLngFromAddress(searchTextTrim)
            .then(async coords => {
              const today = new Date();
              const dateFrom =
                today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate() + '';
              const lastWeekDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 6,
              );

              const dateTo =
                lastWeekDate.getFullYear() * 1e4 +
                (lastWeekDate.getMonth() + 1) * 100 +
                lastWeekDate.getDate() +
                '';
              const {restaurants = []} = await getNearByRestaurants(
                coords.lat,
                coords.lng,
                40,
                6,
                dateFrom,
                dateTo,
              );
              setFilteredLocations(restaurants?.filter(item => item?.isavailable));
              setSearchLoading(false);
            })
            .catch(() => {
              setSearchLoading(false);
              filteredResults = [];
            });
        }
      }
    },
    [allRestaurants],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLocationDebounce = useCallback(debounce(searchLocations, 700), [searchLocations]);

  const getNearBy = useCallback((lat, lng) => {
    const today = new Date();
    const dateFrom =
      today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate() + '';
    const lastWeekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6);

    const dateTo =
      lastWeekDate.getFullYear() * 1e4 +
      (lastWeekDate.getMonth() + 1) * 100 +
      lastWeekDate.getDate() +
      '';
    dispatch(
      getNearByResturantListRequest(lat, lng, constants.RADIUS.radius, 10, dateFrom, dateTo, () =>
        setGettingLocation(false),
      ),
    );
  }, []);

  const onFavLocationItemPressDuringSignup = async item => {
    try {
      setFetchingAndSettingFavLocation(true);
      requestSingleLocation(item?.extref)
        .then(response => {
          const itemToFav = response?.filter(
            itm => String(itm.store_number) === String(item?.extref),
          )[0];
          setFetchingAndSettingFavLocation(false);
          onSelectLocation(item, itemToFav);
          goBack();
        })
        .catch(() => {
          setFetchingAndSettingFavLocation(false);
        });
    } catch (e) {
      setFetchingAndSettingFavLocation(false);
    }
  };
  const onSelectFavLocation = useCallback(
    location => {
      setFetchingAndSettingFavLocation(true);
      requestSingleLocation(location?.extref)
        .then(data => {
          if (String(favourite_store_numbers) !== String(location?.extref)) {
            const obj = {
              favourite_location_ids:
                data?.filter(store => store.store_number == String(location?.extref))?.[0]
                  ?.location_id ?? '',
              favourite_locations:
                data?.filter(store => store.store_number == String(location?.extref))?.[0]
                  ?.location_id ?? '',
            };
            const callback = () => {
              displayToast('SUCCESS', 'Favorite location changed.');
              setFetchingAndSettingFavLocation(false);
              goBack();
            };
            dispatch(updateUser(obj, false, callback));
          }
        })
        .catch(error => {
          setFetchingAndSettingFavLocation(false);
          displayToast('ERROR', 'Something went wrong. Please try again later.');
        });
    },
    [dispatch, favourite_store_numbers],
  );

  const onSaveStorePress = async () => {
    if (choosingFavLocation) {
      return onFavLocationItemPressDuringSignup(selectedLocation);
    }
    if (updatingFavLocation) {
      await onSelectItem(selectedLocation);
      return onSelectFavLocation(selectedLocation);
    }
    await onSelectLocation?.(selectedLocation);
  };

  const handleClosePress = () => {
    if (typeof onClose === 'function') {
      return onClose?.();
    }
    return navigation.goBack();
  };

  const closeSearch = useCallback(() => {
    if (searchVal) {
      Keyboard.dismiss();
      setSearchVal('');
      setFilteredLocations([]);
      setSelectedLocation(null);
    }
  }, [searchVal]);

  useEffect(() => {
    if (isAccessibilityOn && selectedLocation) {
      onSaveStorePress().then();
    }
  }, [isAccessibilityOn, selectedLocation]);

  const handleSelectLocationItem = (item) => {
    setSelectedLocation(item);
    mapRef?.current?.animateCamera({
      center: {latitude: item?.latitude, longitude: item.longitude},
      zoom: ANIMATE_REGION_ZOOM
    }, {duration: 1000});
    setTimeout(() => {
      mapRef?.current?.animateCamera({
        center: {latitude: item?.latitude, longitude: item.longitude},
        zoom: LOCATION_VIEW_ZOOM
      }, {duration: 1500})
    }, 1100)
  }

  const onPressMarker = (item, index) => {
    const relevantRestaurant = availableRestaurants.filter(res => item.locationId ===  res.id)[0];
    setSelectedLocation(relevantRestaurant);
    mapRef?.current?.animateCamera({
      center: item.coordinate,
      zoom: LOCATION_VIEW_ZOOM
    }, {duration: 1000})
    flatListRef?.current?.scrollToIndex?.({index, animated: true});
  }
  return {
    mCamera,
    markers,
    bottomSheetRef,
    searchVal,
    setSearchVal,
    handleSheetChanges,
    snapPoints,
    nearbyRestaurants,
    availableRestaurants,
    isSearchActive,
    filteredLocations,
    restaurantsLoading: gettingLocation || restaurantsListLoading,
    isLocationAllowed,
    onSelectLocation,
    onCurrentLocationPress,
    nearestRestaurantToLocation,
    handleClosePress,
    searchLocations,
    searchLocationDebounce,
    searchLoading,
    closeSearch,
    selectedLocation,
    handleSelectLocationItem,
    setSelectedLocation,
    onSaveStorePress,
    transferredBasketLoading,
    fetchingAndSettingFavLocation,
    loading,
    mapRef,
    onPressMarker,
    flatListRef,
  };
};
export default useChooseStore;
