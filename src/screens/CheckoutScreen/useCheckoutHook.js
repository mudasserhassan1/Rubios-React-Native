import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBasketAllowedCardsRequest,
  removeBasketOrderSubmit,
  setBasketDeliveryAddressSuccess,
  validateBasket,
} from '../../redux/actions/basket/checkout';
import {constants, screens, strings} from '../../constants';
import {formatCustomFields, generateSubmitBasketPayload} from '../../helpers/checkout';
import {addToDate, formatDateTime, getCurrentDate, getDateDiff, strToDate} from '../../utils/timeUtils';
import {getAllBillingAccounts} from '../../redux/actions/user';
import {generateCCSFToken, setBasketDeliveryAddress} from '../../services/basket';
import {displayToast, showAlert} from '../../helpers/toast';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import useSignup from '../../hooks/useSignup';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import {getMScale} from '../../theme/metrics';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import {formatWithMask} from 'react-native-mask-input';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {useNavigation} from '@react-navigation/native';
import {Alert, BackHandler} from 'react-native';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {logToConsole} from '../../configs';
import {navigateTo} from "../../utils/navigationUtils";

const useCheckoutHook = () => {
  const [tipPercentage, setTipPercentage] = useState(null);
  const [basketAccessToken, setBasketAccessToken] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isContactLessDelivery, setIsContactLessDelivery] = useState(false);
  const [isVisibleAddCreditCard, setIsVisibleAddCreditCard] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isIFrameReady, setIsIframeReady] = useState(false);

  const [updatedContactInfo, setUpdatedContactInfo] = useState({});

  const creditCardBottomSheetRef = useRef();
  const isPlaceOrderPressed = useRef();
  const changeContactInfoSheet = useRef();

  const {authToken: mAuthToken} = useSelector(state => state.auth);
  const {restaurant = {}, orderType: restaurantInfoOrderType = ''} = useRestaurantInfoSelector();
  const {providerToken} = useProviderSelector();
  const {isGuest} = useGuestSelector();
  const utensilsReducer = useSelector(state => state.utensils);
  const {rewards: qualifyingRewards} = useSelector(state => state.getRewardForCheckout);
  const {data: rewardsRedemptionsData} = useSelector(state => state.rewardNew);

  const {address = {}} = useSelector(state => state.deliveryAddress);
  const {address1 = '', address2 = '', city: deliveryCity} = address || {};

  const navigation = useNavigation();
  const timSlotBottomSheetRef = useRef();

  //Stop android back and ios swipe back behaviour if order is initiated
  useEffect(() => {
    const onBackPress = () => {
      return placingOrder;
    };

    if (placingOrder) {
      navigation.setOptions({gestureEnabled: !placingOrder});
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation, placingOrder]);

  const isEmptyRewards = useMemo(
    () =>
      !qualifyingRewards?.length &&
      !rewardsRedemptionsData?.rewards?.length &&
      !rewardsRedemptionsData?.banked_redemptions?.length,
    [
      qualifyingRewards?.length,
      rewardsRedemptionsData?.banked_redemptions?.length,
      rewardsRedemptionsData?.rewards?.length,
    ],
  );

  const {streetaddress, stateName, city, state} = restaurant || {};

  const {userProfile = {}} = useUserSelector();
  const {first_name = '', last_name = ''} = userProfile || {};

  const restaurantAddressString = useMemo(() => {
    return `${streetaddress}, ${city}${state ? ', ' + state : stateName ? ', ' + stateName : ''}`;
  }, [city, state, stateName, streetaddress]);

  const deliveryAddressString = useMemo(() => {
    return `${address1}, ${address2 ? address2 + ', ' : ''}${deliveryCity}`;
  }, [address1, address2, deliveryCity]);

  const {
    basket,
    billingSchemes,
    basketLoading,
    orderSubmit,
    error: basketError,
  } = useBasketSelector();

  const {
    deliverymode = '',
    timemode = '',
    timewanted = '',
    total = 0,
    id: basketId = '',
    products = [],
  } = basket || {};
  const orderType = restaurantInfoOrderType || deliverymode || '';

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'checkout_screen',
    });
    const orderProducts = products.map(product => {
      const {name, basecost, id, quantity} = product;
      return {
        item_name: name,
        price: basecost + products[0]?.choices?.reduce((prev, curr) => prev + curr?.cost, 0) || 0,
        item_id: id,
        quantity,
      };
    });

    logFirebaseCustomEvent(strings.begin_checkout, {
      currency: 'USD',
      value: basket?.total,
      coupon: basket?.coupon?.couponcode || '',
      items: orderProducts,
    });
  }, []);

  const {
    inputState,
    inputError,
    INPUT_KEYS,
    isCheckedNewsLetter,
    renderUserInfoInputsJSX,
    renderEmailInput,
    renderVehicleInfoInputsJSX,
    renderPasswordInputsJSX,
    renderTermsAndConditionsCheckboxJSX,
    renderBirthdayInput,
    renderSignupButtonJSX,
    renderAlreadyAMemberJSX,
    renderEmailUpdatesCheckboxJSX,
    renderDOBPicker,
    renderMobileNumberInput,
    validateUserInfoInputs,
    renderSignupAndLoginButton,
    validateMobileNumberInput,
    resetState,
  } = useSignup({registerType: 'REGISTER_CHECKOUT', orderMode: orderType});

  const dispatch = useDispatch();
  const isLoggedIn = mAuthToken && providerToken;

  const inputsRef = useRef({});
  const scrollRef = useRef({});
  const bottomSheetRef = useRef();
  const creditCardsListBottomSheet = useRef();
  const giftCardsListSheetRef = useRef();

  const bottomSheetSnapPoints = useMemo(() => {
    return [getMScale(328), getMScale(428)];
  }, []);

  const changeContactInfoSheetSnapPoints = useMemo(() => {
    return ['90%'];
  }, []);
  useEffect(() => {
    if (basketError) {
      setIsButtonDisabled(false);
    }
  }, [basketError]);
  const isAmountFulfilledFromSelectedCards = useMemo(() => {
    if (billingSchemes && basket) {
      let totalAmount = billingSchemes.reduce((sum, account) => {
        if (account.selected) {
          sum = sum + account.amount;
        }
        return sum;
      }, 0);
      totalAmount = totalAmount.toFixed(2);
      totalAmount = parseFloat(totalAmount);
      return totalAmount === total;
    }
  }, [basket, billingSchemes, total]);

  const isPlaceOrderButtonDisabled = useMemo(() => {
    return Boolean(
      isButtonDisabled || placingOrder || orderSubmit || !isAmountFulfilledFromSelectedCards,
    );
  }, [isButtonDisabled, placingOrder, orderSubmit, isAmountFulfilledFromSelectedCards]);

  // useEffect(() => {
  //   getBasketAccessToken().then();
  // }, [basket?.vendorid]);

  useEffect(() => {
    if (basketId) {
      dispatch(getBasketAllowedCardsRequest(basketId));
      dispatch(removeBasketOrderSubmit());
    }
  }, [basketId]);

  useEffect(() => {
    if (!basket) {
      navigation.goBack();
    }
  }, [basket, navigation]);

  useEffect(() => {
    if (basketId && isLoggedIn) {
      dispatch(getAllBillingAccounts());
      dispatch(getBasketAllowedCardsRequest(basketId));
    }
  }, [basketId, isLoggedIn]);

  const getBasketAccessToken = async () => {
    if (basketId) {
      const body = {
        authtoken: mAuthToken?.authtoken || '',
      };
      try {
        const response = await generateCCSFToken(basketId, body);
        if (response && response?.accesstoken) {
          setBasketAccessToken(response?.accesstoken);
          return response?.accesstoken;
        }
      } catch (e) {
        logToConsole({e});
      }
    }
  };

  const getChoicesString = options => {
    let val = '';
    options.map(item => {
      val = val + ' ' + item.name.trim() + ',';
    });
    return val.trim().replace(/,*$/, '');
  };

  //New Implementations for checkout
  const actualOrderTime = useMemo(() => {
    if (timewanted) {
      return `${formatDateTime(
        timewanted,
        constants.TIME_FORMAT.h_mm_A,
        constants.TIME_FORMAT.YYYYMMDD_HH_mm,
      )}`;
    }
    if (timemode === 'asap') {
      return 'ASAP';
    }
  }, [timemode, timewanted]);

  const composeSpecialInstructions = () => {
    return (
      (isContactLessDelivery &&
        deliveryInstructions !== '' &&
        'I want contactless delivery. ' + deliveryInstructions) ||
      (deliveryInstructions !== '' && deliveryInstructions) ||
      (isContactLessDelivery && 'I want contactless delivery') ||
      null
    );
  };

  const addDeliveryInstructions = async () => {
    if (
      basket?.deliverymode === constants.handOffMode.DISPATCH &&
      (deliveryInstructions !== '' || isContactLessDelivery) &&
      basket?.deliveryaddress?.specialinstructions?.toLowerCase() !==
        deliveryInstructions?.toLowerCase()
    ) {
      const instructions = composeSpecialInstructions();
      try {
        let updatedAddress = {
          building: basket?.deliveryaddress?.building || '',
          streetaddress: basket?.deliveryaddress?.streetaddress || '',
          city: basket?.deliveryaddress?.city || '',
          zipcode: basket?.deliveryaddress?.zipcode || '',
          isdefault: basket?.deliveryaddress?.isdefault || false,
          specialinstructions: instructions,
        };
        if (basket?.deliveryAddress?.id) {
          updatedAddress.id = basket?.deliveryAddress?.id
        }
        const response = await setBasketDeliveryAddress(basket?.id, updatedAddress);
        dispatch(setBasketDeliveryAddressSuccess(response));
      } catch (error) {
        displayToast(
          'ERROR',
          error?.response?.data?.message
            ? error.response.data.message
            : 'ERROR! Please Try again later',
        );
      }
    }
  };

  const showGiftCardBottomSheet = useCallback(() => {
    bottomSheetRef.current?.openSheet();
  }, []);

  const hideGiftCardBottomSheet = useCallback(() => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'crossIcon',
      click_destination: 'Close down Gift card Modal Sheet',
    });
    bottomSheetRef.current?.closeSheet();
  }, []);

  //Continue placing order once iframe is ready.
  useEffect(() => {
    if (isPlaceOrderPressed.current && isIFrameReady) {
      onPlaceOrder().then();
    }
  }, [isIFrameReady]);


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
              onPress: () => navigateTo(screens.MENU_CATEGORIES),
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

  const onPlaceOrder = async () => {
    if (isIFrameReady) {
      try {
        if (isGuest && (!validateUserInfoInputs() || !validateMobileNumberInput())) {
          scrollRef?.current?.scrollToPosition?.(0, 0, true);
          isPlaceOrderPressed.current = false;
          return;
        }
        setPlacingOrder(true);
        setIsButtonDisabled(true);
        let customFields = [];
        if (billingSchemes && billingSchemes.length === 0) {
          setPlacingOrder(false);
          displayToast('ERROR', 'Payment method is required');
          return setIsButtonDisabled(false);
        }
        const accessToken = await getBasketAccessToken();
        if (!accessToken) {
          setPlacingOrder(false);
          return showAlert({
            message: "Your order can't be placed at the moment. Please try again.",
            isLeft: true,
            onPressLeft: () => {
              setIsButtonDisabled(false);
              isPlaceOrderPressed.current = false;
            },
            rightText: 'Retry',
            onPressRight: onPlaceOrder,
          });
        }
        let phoneNumber;
        if (updatedContactInfo[INPUT_KEYS.PHONE]) {
          phoneNumber = updatedContactInfo[INPUT_KEYS.PHONE]?.replace(/\D/g, '');
        } else {
          phoneNumber = inputState[INPUT_KEYS.PHONE].replace(/\D/g, '');
        }
        const inputPayload = {
          ...inputState,
          [INPUT_KEYS.PHONE]: phoneNumber,
          emailNotification: isCheckedNewsLetter,
          tableNumber: '',
        };
        await addDeliveryInstructions();
        const basketPayload = generateSubmitBasketPayload(
          inputPayload,
          billingSchemes,
          basket?.deliverymode,
          mAuthToken?.authtoken,
          basket,
          accessToken,
          isLoggedIn,
        );
        logToConsole({basketPayload});
        if (
          basket &&
          (orderType === constants.handOffMode.CURBSIDE ||
            orderType === constants.handOffMode.DINEIN)
        ) {
          customFields = formatCustomFields(restaurant?.customfields || [], inputState);
        }
        if (basket) {
          let user = null;
          if (isLoggedIn) {
            user = {
              email: providerToken.email,
              first_name: providerToken?.first_name,
              last_name: providerToken?.last_name,
              favourite_locations: providerToken?.favourite_locations,
              marketing_email_subscription: inputPayload.emailNotification,
              phone: inputPayload.phone,
            };
          }
          dispatch(
            validateBasket(
              basket?.id,
              basketPayload,
              user,
              customFields,
              orderType || '',
              {},
              null,
              () => {},
              (errMessage) => {
                setPlacingOrder(false);
                setIsButtonDisabled(false);
                isPlaceOrderPressed.current = false;
                displayDeliveryOrderAlert(errMessage);
              },
            ),
          );
          isPlaceOrderPressed.current = false;
        }
      } catch (e) {
        isPlaceOrderPressed.current = false;
        setPlacingOrder(false);
        setIsButtonDisabled(false);
      }
    } else {
      isPlaceOrderPressed.current = true;
      setPlacingOrder(true);
      setIsButtonDisabled(true);
    }
  };

  const onOrderConfirmed = () => {
    setPlacingOrder(false);
    setIsButtonDisabled(false);
    isPlaceOrderPressed.current = false;
    dispatch(removeBasketOrderSubmit());
  };
  const onOrderFailed = () => {
    setPlacingOrder(false);
    setIsButtonDisabled(false);
    isPlaceOrderPressed.current = false;
    dispatch(removeBasketOrderSubmit());
  };

  const onIframeReady = () => {
    setIsIframeReady(true);
  };
  const showCreditCardListBottomSheet = () => {
    creditCardsListBottomSheet?.current?.open?.();
  };

  const onConfirmChangeContactInfo = () => {
    if (validateMobileNumberInput()) {
      changeContactInfoSheet?.current?.closeSheet();
      const {masked: maskedPhone} = formatWithMask({
        text: inputState.phone,
        mask: constants.MASKS.PHONE_MASK,
      });
      setUpdatedContactInfo({...inputState, phone: maskedPhone});
    }
  };
  const showGiftCardsListBottomSheet = useCallback(() => {
    giftCardsListSheetRef?.current?.open?.();
  }, []);

  const slotsTitle = useMemo(() => {
    return !timemode
      ? strings.more_time
      : formatDateTime(timewanted, 'dddd h:mm A', constants.TIME_FORMAT.YYYYMMDD_HH_mm);
  }, [timewanted]);

  const showTimeSlotSheet = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'schedule',
      click_destination: 'Open Time Slots Schedule Sheet',
    });
    timSlotBottomSheetRef.current?.open?.();
  };

  const asapTime = useMemo(() => {
    let localTime = getCurrentDate();
    let earlyReadyTime = strToDate(basket?.earliestreadytime, constants.TIME_FORMAT.YYYYMMDD_HH_mm);
    const minutes = getDateDiff(earlyReadyTime, localTime, 'minutes');
    const asapAvailableTime = minutes > 0 ? earlyReadyTime : addToDate(localTime, basket?.leadtimeestimateminutes, 'minute');
    return formatDateTime(asapAvailableTime, 'h:mm A')
  }, [basket?.earliestreadytime, basket?.leadtimeestimateminutes]);


  return {
    isGuest,
    orderType,
    actualOrderTime,
    restaurantAddressString,
    providerToken,
    first_name,
    last_name,
    products,
    basket,
    basketLoading,
    isLoggedIn,
    tipPercentage,
    setTipPercentage,
    inputError,
    inputState,
    inputsRef,
    isButtonDisabled,
    bottomSheetSnapPoints,
    bottomSheetRef,
    isPlaceOrderButtonDisabled,
    onPlaceOrder,
    onOrderConfirmed,
    onOrderFailed,
    renderUserInfoInputsJSX,
    renderVehicleInfoInputsJSX,
    renderPasswordInputsJSX,
    renderTermsAndConditionsCheckboxJSX,
    renderSignupButtonJSX,
    renderAlreadyAMemberJSX,
    renderEmailUpdatesCheckboxJSX,
    renderDOBPicker,
    renderEmailInput,
    renderMobileNumberInput,
    renderBirthdayInput,
    renderSignupAndLoginButton,
    deliveryInstructions,
    setDeliveryInstructions,
    isContactLessDelivery,
    setIsContactLessDelivery,
    scrollRef,
    // placeOrder,
    getChoicesString,
    showGiftCardBottomSheet,
    hideGiftCardBottomSheet,
    creditCardsListBottomSheet,
    billingSchemes,
    showCreditCardListBottomSheet,
    isVisibleAddCreditCard,
    setIsVisibleAddCreditCard,
    creditCardBottomSheetRef,
    placingOrder,
    onIframeReady,
    utensilsReducer,
    isEmptyRewards,
    showGiftCardsListBottomSheet,
    giftCardsListSheetRef,
    changeContactInfoSheet,
    changeContactInfoSheetSnapPoints,
    onConfirmChangeContactInfo,
    updatedContactInfo,
    resetState,
    deliveryAddressString,
    timemode,
    slotsTitle,
    timSlotBottomSheetRef,
    showTimeSlotSheet,
    asapTime,
  };
};

export default useCheckoutHook;
