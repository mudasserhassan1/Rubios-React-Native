import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {constants, screens, strings} from '../../constants';
import {navigateTo} from '../../utils/navigationUtils';
import {useNavigation} from '@react-navigation/native';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import useCategoriesSelector from '../../hooks/reduxStateHooks/useCategoriesSelector';
import {getUpsellsRequest} from '../../redux/actions/basket/upsell/Get';
import useUpsellsSelector from '../../hooks/reduxStateHooks/useUpsellsSelector';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {Alert} from 'react-native';
import {getSingleRestaurantCalendar, validateBasket} from '../../redux/actions/basket/checkout';
import {addToDate, formatDateTime, getCurrentDate, getDateDiff, strToDate} from '../../utils/timeUtils';
import {addUtensilsRequest, removeUtensilsRequest} from '../../redux/actions/basket/utensils';
import {getCategoriesRequest} from '../../redux/actions/category';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {displayToast} from "../../helpers/toast";
import {makeDaysAndInitialSelection} from "./utils";

const useCartHook = () => {
  const [addingUpsellsLoading, setAddingUpsellsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [visibleUpsellsModal, setVisibleUpsellsModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [finalSelectedTime, setFinalSelectedTime] = useState('');
  const [isUtensilRequired, setIsisUtensilRequired] = useState(false);
  const [isUtensilsCheckboxDisabled, setIsUtensilsCheckboxDisabled] = useState(false);
  const [isValidatingBasket, setIsValidatingBasket] = useState(false);

  const utensilsReducer = useSelector(state => state.utensils);
  const {imagepath = ''} = useCategoriesSelector();
  const {upsells = {}, vendorId: upsellsVendorId = ''} = useUpsellsSelector();
  const {restaurant = {}, orderType: restaurantInfoOrderType = ''} = useRestaurantInfoSelector();
  const {address = {}} = useSelector(state => state.deliveryAddress);
  const {loading: loadingRestaurantCalendar = false} = useSelector(
    state => state.restaurantCalendar,
  );
  const {basket = {}, basketLoading = false, calendar = {}} = useBasketSelector();
  const {id = '', streetaddress = '', stateName = '', city = '', state = ''} = restaurant || {};

  const upsellsItemsKeys = useMemo(() => {
    if (upsells?.length) {
      const upsellsProductKeys = [];
      upsells.forEach(upsell => {
        const productIds = upsell.products.map(prod => prod.id);
        if (productIds?.length) {
          Array.prototype.push.apply(upsellsProductKeys, productIds);
        }
      });
      return upsellsProductKeys;
    }
  }, [upsells]);

  const {timemode = '', timewanted = '', id: basketId = '', deliverymode = '', vendorid} = basket || {};

  const orderType = restaurantInfoOrderType || deliverymode || '';
  const {address1 = '', address2 = '', city: deliveryCity} = address || {};

  const dispatch = useDispatch();
  const navigation = useNavigation();
  let deliveryMode = basket?.deliverymode;

  const runOnce = useRef(!timewanted);
  const timSlotBottomSheetRef = useRef();
  const flatListRef = useRef();
  const scrollViewRef = useRef(null);

  const {
    TIME_FORMAT: {YYYYMMDD_HH_mm, YMD},
  } = constants;

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'cart_screen',
    });
  }, []);

  /* Workaround for, "asap" not available && timewanted === null
     default time selection will be triggered from TimeSlotSheet Line. 151 after getting
     calendar */

  useEffect(() => {
    if (runOnce.current) {
      const {selectedDayItem} = makeDaysAndInitialSelection(basket);
      dispatch(
          getSingleRestaurantCalendar(
              vendorid,
              formatDateTime(selectedDayItem?.dateTime, YMD),
              formatDateTime(selectedDayItem?.dateTime, YMD),
          ),
      );
      runOnce.current = false;
    }
  }, []);

  useEffect(() => {
    if (!basketLoading) {
      setIsValidatingBasket(false);
    }
  }, [basketLoading]);

  useEffect(() => {
    if (id) {
      dispatch(getCategoriesRequest(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (upsellsVendorId && restaurant && upsellsVendorId !== restaurant?.id) {
      dispatch(getUpsellsRequest(restaurant?.id));
    } else if (!upsells && restaurant?.id) {
      dispatch(getUpsellsRequest(restaurant?.id));
    }
  }, [dispatch, restaurant, upsells]);

  useEffect(() => {
    if (basket?.timewanted) {
      setFinalSelectedTime(basket?.timewanted);
    }
  }, [basket?.timewanted]);

  const {products: basketProducts = [], total: totalCost} = basket || {};

  const isUtensilsAdded = useMemo(() => {
    let utensilsIndex = -1;
    if (basketProducts.length > 0) {
      utensilsIndex = basketProducts?.findIndex(
        obj => obj.productId === utensilsReducer?.utensilsProductId,
      );
    }
    return utensilsIndex > -1;
  }, [basketProducts, utensilsReducer?.utensilsProductId]);

  useEffect(() => {
    if (basketProducts?.length > 0) {
      setIsisUtensilRequired(isUtensilsAdded);
      setProducts(basketProducts);
    } else {
      setProducts([]);
    }
  }, [basket, isUtensilsAdded]);

  useEffect(() => {
    const products = basketProducts.map(product => {
      const {name = '', basecost = 0, id = '', quantity} = product || {};
      return {
        item_name: name,
        price: basecost + product?.choices?.reduce((prev, curr) => prev + curr?.cost, 0) || 0,
        item_id: id,
        quantity,
      };
    });
    logFirebaseCustomEvent(strings.view_cart, {
      currency: 'USD',
      value: totalCost,
      items: products,
    });
  }, []);

  const onChangeUtensilsCheckbox = checked => {
    setIsisUtensilRequired(checked);
    if (checked) {
      const request = {};
      request.productid = utensilsReducer?.utensilsProductId || '';
      request.quantity = 1;
      request.options = '';
      setIsUtensilsCheckboxDisabled(true);
      dispatch(addUtensilsRequest(basketId, request, () => setIsisUtensilRequired(!checked)));
    } else {
      if (basket?.products?.length) {
        const utensilsAllProducts = basket?.products.filter(
          obj => obj.productId === utensilsReducer?.utensilsProductId || '',
        );
        if (utensilsAllProducts?.length) {
          setIsUtensilsCheckboxDisabled(true);
          dispatch(removeUtensilsRequest(basket?.id, utensilsAllProducts[0]?.id));
        }
      }
    }
  };

  const showUpsellsModal = useCallback(() => setVisibleUpsellsModal(true), []);
  const hideUpsellsModal = useCallback(() => setVisibleUpsellsModal(false), []);

  const capitalizeFirstLetter = s => {
    const splits = s.toLowerCase().split('');
    splits[0] = splits[0].toUpperCase();
    return splits.join('');
  };

  const upsellCategoryTitle = useCallback(type => {
    if (type === constants.UPSELLS_TYPES.SALSA) {
      return 'Select Your ' + capitalizeFirstLetter(type);
    }
    return 'Add A ' + capitalizeFirstLetter(type);
  }, []);

  const getOptions = options => {
    let val = '';
    options.map(item => {
      val = val + ' ' + item.name.trim() + ',';
    });
    return val.trim().replace(/,*$/, '');
  };

  const onClosePressed = () => {
    navigation.goBack();
  };

  const onAddNewProductPressed = () => {
    navigateTo(screens.MENU_CATEGORIES);
  };

  const asapTime = useMemo(() => {
    let localTime = getCurrentDate();
    let earlyReadyTime = strToDate(basket?.earliestreadytime, constants.TIME_FORMAT.YYYYMMDD_HH_mm);
    const minutes = getDateDiff(earlyReadyTime, localTime, 'minutes');
    const asapAvailableTime = minutes > 0 ? earlyReadyTime : addToDate(localTime, basket?.leadtimeestimateminutes, 'minute');
    return formatDateTime(asapAvailableTime, 'h:mm A')
  }, [basket?.earliestreadytime, basket?.leadtimeestimateminutes]);


  const displayDeliveryOrderAlert = (errMessage) => {
    if (errMessage.indexOf('$15') > -1) {
      Alert.alert(
          'Oops! Order must be \n' + '$15 above',
          'Only orders $15 or more are eligible for delivery. Add some more delicious  items to your bag.',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'Add More',
              onPress: onAddNewProductPressed,
            },
          ],
      );
    } else {
      displayToast(
          'ERROR',
          errMessage || 'ERROR! Please Try again later',
          true,
      );
    }
  };
  const onCheckoutPress = () => {
    setIsValidatingBasket(true);
    dispatch(
      validateBasket(
        basketId,
        null,
        null,
        [],
        null,
        null,
        null,
        () => navigation?.navigate(screens.CHECKOUT),
        (errMessage) => displayDeliveryOrderAlert(errMessage),
      ),
    );
  };

  const onEditPress = product => {
    navigation.navigate(screens.PRODUCT, {
      productId: product?.productId,
      isEditingProduct: true,
      product,
    });
  };

  const showTimeSlotSheet = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'schedule',
      click_destination: 'Open Time Slots Schedule Sheet',
    });
    timSlotBottomSheetRef.current?.open?.();
  };

  const restaurantAddressString = useMemo(() => {
    return `${streetaddress}, ${city}${state ? ', ' + state : stateName ? ', ' + stateName : ''}`;
  }, [city, state, stateName, streetaddress]);

  const deliveryAddressString = useMemo(() => {
    return `${address1}, ${address2 ? address2 + ', ' : ''}${deliveryCity}`;
  }, [address1, address2, deliveryCity]);

  const slotsTitle = useMemo(() => {
    return !finalSelectedTime
      ? ''
      : formatDateTime(finalSelectedTime, 'dddd h:mm A', YYYYMMDD_HH_mm);
  }, [YYYYMMDD_HH_mm, finalSelectedTime]);

  return {
    products,
    visibleUpsellsModal,
    hideUpsellsModal,
    showUpsellsModal,
    getOptions,
    onClosePressed,
    onAddNewProductPressed,
    onCheckoutPress,
    onEditPress,
    deliveryMode,
    basket,
    imagepath,
    upsellCategoryTitle,
    streetaddress,
    stateName,
    state,
    city,
    orderType,
    timSlotBottomSheetRef,
    showTimeSlotSheet,
    selectedTime,
    slotsTitle,
    loadingRestaurantCalendar,
    timemode,
    timewanted,
    isValidatingBasket,
    scrollViewRef,
    isUtensilRequired,
    onChangeUtensilsCheckbox,
    utensilsReducer,
    isUtensilsCheckboxDisabled,
    flatListRef,
    finalSelectedTime,
    basketLoading,
    restaurantAddressString,
    deliveryAddressString,
    setSelectedTime,
    upsellsItemsKeys,
    setAddingUpsellsLoading,
    addingUpsellsLoading,
    asapTime,
  };
};
export default useCartHook;
