import {useState, useEffect, useRef, useCallback} from 'react';
import useRestaurantsListSelector from '../../hooks/reduxStateHooks/useRestaurantsListSelector';
import {getNearByResturantListRequest} from '../../redux/actions/restaurant/list';
import {constants, screens, strings} from '../../constants';
import {useDispatch} from 'react-redux';
import {logToConsole} from '../../configs';
import {useMemo} from 'react';
import {isAndroid, isIos} from '../../utils/sharedUtils';
import {Alert, Keyboard} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {handleBlockedPermission} from '../../utils/permissionsUtils';
import {getAddressFromLatLng, getLatLngFromAddress} from '../../utils/addressUtils';
import {displayToast} from '../../helpers/toast';
import {getUserDeliveryAddresses} from '../../redux/actions/user';
import useSelectLocation from '../../hooks/useSelectLocation';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import useAuthSelector from '../../hooks/reduxStateHooks/useAuthSelector';
import {moveToPreviousScreenWithMerge} from '../../utils/navigationUtils';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {checkMultiple, PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import GetLocation from 'react-native-geolocation-service';
import {updateDuplicateAddress} from "../../redux/actions/basket/checkout";

const useDeliveryFlow = () => {
  const DUMMY_LAT = 33.68611;
  const DUMMY_LNG = -118.00662;
  const [mCamera, setMCamera] = useState({
    altitude: 0,
    center: {latitude: 0, longitude: 0},
    heading: 0,
    pitch: 0,
    zoom: 20,
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({lat: DUMMY_LAT, lng: DUMMY_LNG});
  const [markers, setMarkers] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [sheetPosition, setSheetPosition] = useState(0);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddEditView, setShowAddEditView] = useState(false);
  const [showStartOrderView, setShowStartOrderView] = useState(false);
  const [showDeliveryAddressView, setShowDeliveryAddressView] = useState(true);
  const [isMakeAddressDefaultChecked, setIsMakeAddressDefaultChecked] = useState(false);
  const [newLocation, setNewLocation] = useState(null);
  const [editAddressBoolean, setEditAddressBoolean] = useState(false);
  const [showBottomView, setShowBottomView] = useState(false);

  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aptBuilding, setApyBuilding] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const {userDeliveryAddresses: mDeliveryAddresses = [], userDataLoading} = useUserSelector();
  const {authToken: mAuthToken, providerToken} = useAuthSelector();
  const isLoggedIn = !!mAuthToken && !!providerToken;

  const {nearbyRestaurants, restaurantsLoading} = useRestaurantsListSelector();
  const {basket} = useBasketSelector();

  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const googleAutoCompleteRef = useRef();
  const ref_aptBuiilding = useRef();
  const ref_city = useRef();
  const ref_zipCode = useRef();
  const ref_mobileNumber = useRef();

  const dispatch = useDispatch();
  const isSearchActive = useMemo(() => !!searchVal, [searchVal]);

  const {params = {}} = useRoute();
  const {fromScreen, orderType} = params || {};

  const onUpdateLocation = () => {
    try {
      setLoading(false);
      if (fromScreen) {
        if (basket?.products?.length === 0) {
          moveToPreviousScreenWithMerge(screens.MENU_CATEGORIES);
        } else {
          moveToPreviousScreenWithMerge(fromScreen || screens.MENU_CATEGORIES);
        }
      } else {
        navigation?.replace?.(screens.MENU_CATEGORIES);
      }
    } catch (e) {
      logToConsole({onUpdateLocationError: e.message});
    }
  };
  const route = useRoute();
  const {name} = route || {};
  const {onSelectLocation} = useSelectLocation({
    newLocation: newLocation,
    orderType,
    onSelectNewLocation: onUpdateLocation,
    selectedAddress,
    onErrorBeforeLocationChanged: () => setLoading(false),
    name,
  });

  useEffect(() => {
    const {deliveryaddresses} = mDeliveryAddresses || {};
    if (deliveryaddresses?.length > 0) {
      const defaultAddress = deliveryaddresses?.filter(item => item.isdefault)?.[0];
      if (defaultAddress) {
        setSelectedAddress({
          address1: defaultAddress?.streetaddress,
          address2: defaultAddress?.building,
          city: defaultAddress?.city,
          zip: defaultAddress?.zipcode,
          isdefault: defaultAddress?.isdefault,
          id: defaultAddress?.id || 0,
        });
      }
    }
  }, [mDeliveryAddresses]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'delivery_order_flow_screen',
    });
    setTimeout(() => {
      setShowBottomView(true);
    }, 700);
    return () => clearTimeout(showBottomView);
  }, []);

  const {deliveryAddressesList} = useMemo(() => {
    const {deliveryaddresses} = mDeliveryAddresses || {};
    return {
      deliveryAddressesList: deliveryaddresses?.reduce(
        (pre, curr) => (curr?.isdefault ? [curr, ...pre] : [...pre, curr]),
        [],
      ),
    };
  }, [mDeliveryAddresses]);

  const handleZipCode = text => {
    setZipCode(text);
  };
  const handleCity = text => {
    setCity(text);
  };
  const handleAptBuilding = text => {
    setApyBuilding(text);
  };

  const handleStreetAddress = text => {
    setStreetAddress(text);
  };

  const handleMobileNumber = text => {
    setMobileNumber(text);
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserDeliveryAddresses());
    }
  }, [dispatch, isLoggedIn]);

  const buttonTitle = useMemo(() => {
    if (fromScreen) {
      if (fromScreen === screens.MENU_CATEGORIES) {
        return 'Return to Main Menu';
      }
      if (fromScreen === screens.CART) {
        return `Return to Bag`;
      }
      return `Return to ${fromScreen}`;
    }
    return strings.start_order;
  }, [fromScreen]);

  const isButtonDisabled = useMemo(
    () => !streetAddress.trim() || !city.trim() || !zipCode.trim(),
    [city, zipCode, streetAddress],
  );

  const onPlacesAutoCompleteItemPress = async data => {
    const {description} = data || {};
    if (description) {
      setLoading(true);
      try {
        const coords = await getLatLngFromAddress(description);
        const {lat, lng} = coords || {};
        try {
          const address = await getAddressFromLatLng(lat, lng);
          const {address1 = '', address2 = '', city = '', zip = '', state = ''} = address || {};
          setLoading(false);
          if (address1) {
            setSelectedAddress(address);
            setCity(city);
            setStreetAddress(address1 + ', ' + address2);
            setZipCode(zip);
            setShowAddEditView(true);
            setShowDeliveryAddressView(false);
          } else {
            displayToast('ERROR', strings.please_enter_your_full_delivery_address);
          }
        } catch (e) {
          displayToast('ERROR', strings.please_enter_your_full_delivery_address);
          setLoading(false);
        }
      } catch (e) {
        displayToast('ERROR', strings.please_enter_your_full_delivery_address);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (newLocation) {
      onSelectLocation().then();
    }
  }, [newLocation]);

  useEffect(() => {
    setMCamera(prevState => ({
      ...prevState,
      center: {latitude: currentLocation.lat, longitude: currentLocation.lng},
      zoom: 12,
    }));
  }, [currentLocation]);

  const snapPoints1 = useMemo(() => ['90%'], []);
  const snapPoints2 = useMemo(() => ['90%'], []);
  const snapPoints3 = useMemo(() => ['43%'], []);

  const handleSheetChanges = useCallback(index => {
    setSheetPosition(index);
    if (index === 0) {
      Keyboard.dismiss();
    }
  }, []);

  const onCurrentLocationPress = async () => {
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
      if (isAndroid && reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.BLOCKED) {
        return handleBlockedPermission(reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
      }
      if (
          reqStatus[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
          reqStatus[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
          reqStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
      ) {
        return handleGetLocation();
      }
    }
    if (
        checkStatus[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED ||
        checkStatus[PERMISSIONS.IOS.LOCATION_ALWAYS] === RESULTS.GRANTED ||
        checkStatus[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED
    ) {
      return handleGetLocation();
    }
    return handleBlockedPermission(
        checkStatus[
            isIos ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            ],
    );
  };

  const handleGetLocation = () => {
    setLoading(true);
    GetLocation.getCurrentPosition(
        result => {
          getAddressFromLatLng(result?.coords?.latitude, result?.coords?.longitude)
              .then(res => {
                setCity(res?.city);
                setStreetAddress(res?.address1 + ', ' + res?.address2);
                setZipCode(res?.zip);
                setShowDeliveryAddressView(false);
                setShowAddEditView(true);
                setSelectedAddress(res);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
        },
        () => {
          setLoading(false);
        },
        {enableHighAccuracy: true},
    );
  };

  //upon pressing
  const markAddressAsDuplicate = () => {
    const updatedDuplicateAddress = [
      // ...addresses?.duplicated,
      addressToEdit.id,
    ];
    dispatch(updateDuplicateAddress(updatedDuplicateAddress));
    setAddressToEdit(null);
  }

  const isAddressSame = (add1, add2) => {
      const {building, streetaddress, zipcode, city, isdefault} = add1 ?? {};
      const {address2, address1, zip, city: selectedCity, isdefault: selectedDefault} = add2 ?? {};
      return (
          building?.toLowerCase()?.trim() === address2?.trim()?.toLowerCase() &&
          streetaddress?.toLowerCase()?.trim() === address1?.toLowerCase()?.trim() &&
          city?.toLowerCase()?.trim() === selectedCity?.toLowerCase()?.trim() &&
          zip === zipcode &&
          isdefault === selectedDefault
      )
  }
  const handleResponse = (lat, lng, rest) => {
    const deliverySupportedRestaurants = rest?.restaurants?.filter(item => item?.supportsdispatch);
    if (!deliverySupportedRestaurants?.length) {
      setLoading(false);
      Alert.alert(
          'No Store Near By',
          "We couldn't find any Rubio's within 10 miles of your address. Please try another delivery address",
          [
            {
              text: 'Cancel',
              onPress: () => setLoading(false),
            },
            {
              text: 'Try Again',
              onPress: () => getNearBy(lat, lng),
            },
          ],
      );
    } else {
      logToConsole({isAddressSame: isAddressSame(addressToEdit, selectedAddress)})
      if (addressToEdit && !isAddressSame(addressToEdit, selectedAddress)) {
        markAddressAsDuplicate();
      }
      const firstRestaurant = deliverySupportedRestaurants?.[0] || {};
      if (newLocation?.id === firstRestaurant?.id) {
        onSelectLocation().then();
      } else {
        setNewLocation(firstRestaurant);
      }
    }
  };

  const getNearBy = (lat, lng) => {
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
        getNearByResturantListRequest(lat, lng, constants.RADIUS.radius, 10, dateFrom, dateTo, res =>
            handleResponse(lat, lng, res),
        ),
    );
  };

  const handleClosePress = () => {
    if (showStartOrderView) {
      setShowStartOrderView(false);
      setShowAddEditView(true);
    } else if (showAddEditView) {
      setShowAddEditView(false);
      setEditAddressBoolean(false);
      setShowDeliveryAddressView(true);
      setCity('');
      setApyBuilding('');
      setStreetAddress('');
      setZipCode('');
      setIsMakeAddressDefaultChecked(false);
    } else {
      setMarkers([]);
      return navigation.goBack();
    }
  };

  const closeSearch = useCallback(() => {
    Keyboard.dismiss();
    setSearchVal('');
    setFilteredLocations([]);
  }, []);

  const onAddressSelect = async address => {
    const {streetaddress, building, city, zipcode, id} = address || {};
    setSelectedAddress({
      address1: streetaddress,
      address2: building,
      city: city,
      zip: zipcode,
      id,
    });
    const addressStr = streetaddress + ' ' + building + ', ' + city + ', ' + zipcode;
    getLatLngFromAddress(addressStr)
        .then(coords => {
          setMCamera(prevState => ({...prevState, lat: coords.lat, lng: coords.lng}));
        })
        .catch(e => {
          logToConsole({err: e.message});
        });
  };

  const goToAddAddressView = () => {
    setShowDeliveryAddressView(false);
    setShowAddEditView(true);
  };

  const onEditPress = item => {
    setAddressToEdit(item);
    // logToConsole({item})
    setShowAddEditView(true);
    setShowDeliveryAddressView(false);
    setEditAddressBoolean(true);
    setCity(item?.city);
    setStreetAddress(item?.streetaddress);
    setZipCode(item?.zipcode);
    setApyBuilding(item?.building);
    if (item.isdefault) {
      setIsMakeAddressDefaultChecked(true);
    }
  };
  const onEditPressFromStartOrder = () => {
    setShowStartOrderView(false);
    setShowAddEditView(true);
    setEditAddressBoolean(true);
  };
  const handleUserSearch = text => {
    setSearchVal(text);
  };
  const addAddressBtn = () => {
    setShowAddEditView(false);
    setShowStartOrderView(true);
    setEditAddressBoolean(false);
    const addressObj = {
      address1: streetAddress,
      address2: aptBuilding,
      city: city,
      zip: zipCode,
      isdefault: isMakeAddressDefaultChecked,
    }
    //address was choosed to edit, but nothing has been changed
    if (addressToEdit && isAddressSame(addressToEdit, addressObj)) {
      addressObj.id = addressToEdit.id
    }
    setSelectedAddress(addressObj);
    logFirebaseCustomEvent(strings.add_address_log, {
      user_address: selectedAddress,
    });
  };

  const onStartOrderPressed = async () => {
    setLoading(true);
    const addressFields = [
      'streetaddress',
      'address1',
      'building',
      'address2',
      'city',
      'zipcode',
      'zip',
    ];
    let formattedAddress = '';
    Object.keys(selectedAddress).forEach(key => {
      if (addressFields.includes(key)) {
        if (selectedAddress[key]) {
          formattedAddress = formattedAddress + selectedAddress[key] + ', ';
        }
      }
    });
    try {
      const coords = await getLatLngFromAddress(formattedAddress);
      getNearBy(coords?.lat, coords?.lng);
    } catch (e) {
      setLoading(false);
      displayToast('ERROR', 'Delivery is unavailable for this address');
    }
  };

  const onChangeDefaultAddressCheckbox = () => {
    setIsMakeAddressDefaultChecked(prevState => !prevState);
  };

  return {
    mCamera,
    markers,
    bottomSheetRef,
    searchVal,
    setSearchVal,
    sheetPosition,
    handleSheetChanges,
    nearbyRestaurants,
    isSearchActive,
    filteredLocations,
    restaurantsLoading,
    isLocationAllowed,
    handleGetLocation,
    onCurrentLocationPress,
    handleClosePress,
    loading,
    closeSearch,
    isLoggedIn,
    deliveryAddressesList,
    googleAutoCompleteRef,
    onAddressSelect,
    ref_aptBuiilding,
    ref_zipCode,
    ref_city,
    ref_mobileNumber,
    handleStreetAddress,
    handleZipCode,
    handleCity,
    handleAptBuilding,
    handleMobileNumber,
    isButtonDisabled,
    streetAddress,
    city,
    zipCode,
    mobileNumber,
    aptBuilding,
    showAddEditView,
    onPlacesAutoCompleteItemPress,
    goToAddAddressView,
    snapPoints1,
    snapPoints2,
    snapPoints3,
    onEditPress,
    handleUserSearch,
    addAddressBtn,
    showStartOrderView,
    showDeliveryAddressView,
    onStartOrderPressed,
    selectedAddress,
    setSelectedAddress,
    onEditPressFromStartOrder,
    isMakeAddressDefaultChecked,
    onChangeDefaultAddressCheckbox,
    buttonTitle,
    editAddressBoolean,
    userDataLoading,
    showBottomView,
  };
};
export default useDeliveryFlow;
