import {useCallback, useMemo, useState} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {
  dateComponents,
  getCurrentDate,
  getDateComponent,
  isAfterDate,
  isValidDate,
  strToDate,
} from '../../utils/timeUtils';
import {getCreditCardObj, updatePaymentCardsAmount} from '../../helpers/checkout';
import {useDispatch, useSelector} from 'react-redux';
import {
  submitBasketSinglePaymentSuccess,
  updateBasketBillingSchemes,
} from '../../redux/actions/basket/checkout';
import {displayToast} from '../../helpers/toast';
import {logToConsole} from '../../configs';
import {useNavigation} from '@react-navigation/native';
import {screens, strings} from '../../constants';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import {getUserRecentOrders} from '../../redux/actions/user';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {setSaveCreditCard} from '../../redux/actions/basket';
import {AccessibilityInfo} from "react-native";
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";
import Config from "react-native-config";

export const INPUT_KEYS = {
  ZIP_CODE: 'zip',
  CARD_EXPIRY: 'cardExpiry',
};
export const INPUTS = [
  {
    key: INPUT_KEYS.CARD_EXPIRY,
    placeHolder: 'Card Expiry MM/YY',
    isMaskedInput: true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/],
    keyboardType: 'number-pad',
    returnKeyType: 'done',
  },
  {
    key: INPUT_KEYS.ZIP_CODE,
    placeHolder: 'Zip Code',
    isMaskedInput: true,
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
    keyboardType: 'number-pad',
    returnKeyType: 'done',
  },
];

const useAddCreditCard = ({onClose, onOrderSuccess, onOrderFailure, onIframeReady}) => {
  const [inputState, setInputState] = useState({
    [INPUT_KEYS.CARD_EXPIRY]: '',
    [INPUT_KEYS.ZIP_CODE]: '',
  });
  const [inputError, setInputError] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {[INPUT_KEYS.CARD_EXPIRY]: cardExpiry, [INPUT_KEYS.ZIP_CODE]: zip} = inputState || {};

  const {basket, billingSchemes, saveCreditCard} = useBasketSelector();
  const {id: basketId = ''} = basket || {};
  const handleInputChange = (text, key) => {
    setError(key, '');
    setInputState(prevState => ({...prevState, [key]: text}));
  };
  const {config = {}} = useSelector(state => state.firebaseConfig);
  const {payment_script} = config || {};
  const {isGuest} = useGuestSelector();

  const setError = (key, error) => {
    setInputError(prevState => ({...prevState, [key]: error}));
  };

  const validateInputFields = () => {
    if (!cardExpiry?.length) {
      setError(INPUT_KEYS.CARD_EXPIRY, 'Card Expiry is required');
      return false;
    }
    if (!zip?.length) {
      setError(INPUT_KEYS.ZIP_CODE, 'Zip Code is required');
      return false;
    }
    if (zip?.length < 3) {
      setError(INPUT_KEYS.ZIP_CODE, 'Zip Code must be 3 to 5 digits');
      return false;
    }
    if (cardExpiry?.length < 5) {
      setError(INPUT_KEYS.CARD_EXPIRY, 'Please enter valid date.');
      return false;
    }
    const currentDate = getCurrentDate();
    const expiryDate = strToDate(cardExpiry, 'MM/YY');
    if (!isValidDate(expiryDate)) {
      setError(INPUT_KEYS.CARD_EXPIRY, 'Please enter valid date.');
      return false;
    }
    if (!isAfterDate(expiryDate, currentDate)) {
      setError(INPUT_KEYS.CARD_EXPIRY, 'Please enter future date.');
      return false;
    }
    return true;
  };
  const onSubmitCreditCard = () => {
    if (validateInputFields()) {
      let billingSchemesNewArray = billingSchemes.filter(
        account => !(account.billingmethod === 'creditcard' && !account.billingaccountid),
      );
      billingSchemesNewArray = billingSchemesNewArray.map(element => {
        if (element.billingmethod === 'creditcard') {
          return {
            ...element,
            selected: false,
          };
        }
        return element;
      });
      const obj = {
        exp_year: getDateComponent(
          inputState[INPUT_KEYS.CARD_EXPIRY],
          'MM/YYYY',
          dateComponents.year,
        ),
        exp_month:
          getDateComponent(inputState[INPUT_KEYS.CARD_EXPIRY], 'MM/YYYY', dateComponents.month) + 1,
        postal_code: zip,
        savecard: String(saveCreditCard),
      };
      const cardObject = getCreditCardObj(obj);
      Array.prototype.push.apply(billingSchemesNewArray, cardObject);
      billingSchemesNewArray = updatePaymentCardsAmount(billingSchemesNewArray, basket);
      dispatch(updateBasketBillingSchemes(billingSchemesNewArray));
      displayToast('SUCCESS', `Credit Card ${global.isEditingCard ? 'Updated' : 'Added'}.`);
      const newAddedCard = billingSchemesNewArray.filter(item => !item.billingaccountid)[0];
      logFirebaseCustomEvent(strings.add_payment_info, {
        currency: 'USD',
        value: newAddedCard?.amount,
        items: orderProducts,
        coupon: basket?.coupon?.couponcode,
        payment_type: 'CreditCard',
      });

      onClose?.();
    }
  };

  const onCancelCreditCard = () => {
    onClose?.();
  };

  const orderProducts = useMemo(() => {
    return basket?.products?.map(product => {
      const {name, basecost, id, quantity} = product;
      return {
        item_name: name,
        price: basecost + product?.choices?.reduce((prev, curr) => prev + curr?.cost, 0) || 0,
        item_id: id,
        quantity,
      };
    });
  }, [basket?.products]);

  const onOrderPlaced = order => {
    const {coupon = {}} = basket || {};
    logFirebaseCustomEvent(strings.purchase, {
      currency: 'USD',
      location: String(order.vendorid),
      transaction_id: order?.oloid,
      value: order?.total,
      items: orderProducts,
      coupon: coupon?.couponcode || '',
      tax: order?.taxes?.reduce((sum, curr) => sum + curr.tax, 0) || 0,
    });
    // if (basketId) {
    //   dispatch(submitBasketSinglePaymentSuccess());
    //   typeof onOrderSuccess === 'function' && onOrderSuccess?.();
    // }
    dispatch(getUserRecentOrders());
    navigation?.replace?.(screens.DELIVERY_STATUS, {
      orderId: order.id,
      vendorid: order.vendorid,
      deliveryMode: order?.deliverymode,
      fromScreen: screens.CHECKOUT,
      orderNumber: order.oloid,
      fromCheckout: true,
      onBackPress: () => navigation.navigate({name: 'Home', merge: true}),
    });
  };

  const onBridgeMessage = useCallback(
    event => {
      try {
        logToConsole({event});
        let data = event?.nativeEvent?.data;
        data = JSON.parse(data ?? '{}');
        const {type, data: response = {}} = data || {};
        switch (type) {
          case 'success':
            onOrderSuccess?.();
            displayToast('SUCCESS', 'Order has been placed');
            onOrderPlaced?.(response);
            break;
          case 'error':
            onOrderFailure?.();
            response?.forEach(error => {
              if (error?.description.includes('valid phone number')) {
                displayToast(
                  'ERROR',
                  'Please provide a phone number in case the restaurant needs to contact you about your order.',
                  true,
                );
              } else {
                displayToast('ERROR', error.description, true);
              }
            });
            break;
          case 'ready':
            onIframeReady?.();
            break;
          default:
            break;
        }
      } catch (e) {
        logToConsole({onBridgeMessageError: e.message});
      } finally {
      }
    },
    [basket],
  );

  const onChangeCheckBox = val => {
    dispatch(setSaveCreditCard(val));
  };
  return {
    inputState,
    inputError,
    basketId,
    handleInputChange,
    onSubmitCreditCard,
    onCancelCreditCard,
    onBridgeMessage,
    isGuest,
    saveCreditCard,
    onChangeCheckBox,
    payment_script,
  };
};
export default useAddCreditCard;
