import {useCallback, useEffect, useState} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {getGiftCardBalance, verifyGiftCardPinRequirement} from '../../services/checkout';
import {displayToast} from '../../helpers/toast';
import {getGiftCardObj, updatePaymentCardsAmount} from '../../helpers/checkout';
import {updateBasketBillingSchemes} from '../../redux/actions/basket/checkout';
import {useDispatch} from 'react-redux';
import {Keyboard} from 'react-native';
import {logToConsole} from '../../configs';

const INPUT_KEYS = {
  GIFT_CARD_NUMBER: 'giftCardNumber',
  PIN: 'pin',
};

const INPUTS = [
  {
    key: INPUT_KEYS.GIFT_CARD_NUMBER,
    placeholder: 'Enter Gift Card No.',
    label: 'Gift Card No.',
    returnKeyType: 'done',
    keyboardType: 'number-pad',
    // isMaskedInput: true,
    accessibilityLabelForLabel: 'gift card number',
    accessibilityLabelForInput: 'Enter gift card number',
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  },
  {
    key: INPUT_KEYS.PIN,
    placeholder: 'Enter Pin No.',
    accessibilityLabelForLabel: 'Pin number',
    accessibilityLabelForInput: 'Enter pin number',
    label: 'Pin No.',
    returnKeyType: 'done',
    keyboardType: 'number-pad',
    // isMaskedInput: true,
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  },
];
const useAddGiftCardHook = ({onClose}) => {
  const [inputState, setInputState] = useState({});
  const [inputError, setInputError] = useState({});
  const [checkPin, setCheckPin] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {basket, billingSchemes, allowedBillingSchemes} = useBasketSelector();
  const dispatch = useDispatch();

  const validateInputs = useCallback(() => {
    const {[INPUT_KEYS.GIFT_CARD_NUMBER]: cardNumber = '', [INPUT_KEYS.PIN]: cardPin = ''} =
      inputState;
    if (!cardNumber.length) {
      return false;
    }
    if (checkPin && !cardPin.length) {
      return false;
    }
    return true;
  }, [checkPin, inputState]);

  useEffect(() => {
    setIsButtonDisabled(!validateInputs());
  }, [validateInputs]);

  useEffect(() => {
    if (allowedBillingSchemes && allowedBillingSchemes.length) {
      const isPinCheckEnabled =
        allowedBillingSchemes &&
        allowedBillingSchemes.length &&
        allowedBillingSchemes.findIndex(
          element =>
            element.type === 'giftcard' &&
            element.fields &&
            element.fields.length &&
            element.fields.findIndex(field => {
              return field.type === 'password' && field.isMandatory;
            }) === 1,
        ) === 1;
      setCheckPin(isPinCheckEnabled);
    }
  }, [allowedBillingSchemes]);

  const handleInputChange = (key, text) => {
    setInputError(prevState => ({...prevState, [key]: ''}));
    setInputState(prevState => ({...prevState, [key]: text}));
  };

  const onCancelAddGiftCard = () => {
    onClose?.();
    setCheckPin(false);
  };

  const validateCardNumber = () => {
    if (inputState?.[INPUT_KEYS.GIFT_CARD_NUMBER].length < 10) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.GIFT_CARD_NUMBER]: 'Must be at least 10 digits',
      }));
      return false;
    }
    return true;
  };

  const checkExistingGiftCard = (billingSchemes = [], cardNumber = '') => {
    return billingSchemes.find(billingScheme => {
      if (
        billingScheme.billingmethod === 'storedvalue' &&
        billingScheme?.billingfields?.[0]?.value === cardNumber
      ) {
        return billingScheme;
      }
      return null;
    });
  };

  const handleGetGiftCardBalance = async (billingSchemeId, body) => {
    try {
      const balanceResponse = await getGiftCardBalance(basket?.id, billingSchemeId, body);
      if (balanceResponse) {
        if (balanceResponse?.success) {
          let billingSchemesNewArray = billingSchemes;
          let cardObj = getGiftCardObj(
            balanceResponse,
            billingSchemeId,
            body,
            billingSchemesNewArray,
          );
          Array.prototype.push.apply(billingSchemesNewArray, cardObj);
          billingSchemesNewArray = updatePaymentCardsAmount(billingSchemesNewArray, basket);
          dispatch(updateBasketBillingSchemes(billingSchemesNewArray));
          displayToast('SUCCESS', 'Gift Card Added');
          setIsLoading(false);
          setIsButtonDisabled(false);
          onClose?.();
        } else {
          displayToast('ERROR', `${balanceResponse.message}`);
          setIsLoading(false);
          setIsButtonDisabled(false);
        }
      }
    } catch (e) {
      logToConsole({error: e});
      setIsLoading(false);
      setIsButtonDisabled(false);
    } finally {
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };
  const onSubmitAddGiftCard = async () => {
    if (validateCardNumber()) {
      Keyboard.dismiss();
      // collapseBottomSheet?.();
      setIsButtonDisabled(true);
      const body = {
        cardnumber: inputState[INPUT_KEYS.GIFT_CARD_NUMBER],
      };
      if (checkPin && inputState[INPUT_KEYS.PIN]) {
        body.pin = inputState[INPUT_KEYS.PIN];
      }
      if (basket && basket?.id) {
        const giftCardIndex = allowedBillingSchemes.findIndex(element => {
          return element.type === 'giftcard';
        });
        if (checkExistingGiftCard(billingSchemes, inputState[INPUT_KEYS.GIFT_CARD_NUMBER])) {
          displayToast('ERROR', 'Gift Card already exists');
          setIsButtonDisabled(false);
        } else {
          if (giftCardIndex !== -1) {
            setIsLoading(true);
            try {
              const billingSchemeId = allowedBillingSchemes[giftCardIndex].id;
              const pinResponse = await verifyGiftCardPinRequirement(billingSchemeId, body);
              if (pinResponse && pinResponse?.ispinrequired && !checkPin) {
                displayToast('SUCCESS', 'Please add gift card pin.');
                setIsButtonDisabled(false);
                setCheckPin(true);
                setIsLoading(false);
              } else {
                await handleGetGiftCardBalance(billingSchemeId, body);
              }
            } catch (e) {
              displayToast(
                'ERROR',
                e?.data?.message ||
                  'Something went wrong. Please try again later or a different card.',
                true,
              );
              setIsButtonDisabled(false);
              setIsLoading(false);
            }
          }
        }
      }
    }
  };
  return {
    inputState,
    handleInputChange,
    inputError,
    onCancelAddGiftCard,
    onSubmitAddGiftCard,
    INPUT_KEYS,
    INPUTS,
    checkPin,
    isButtonDisabled,
    isLoading,
  };
};

export default useAddGiftCardHook;
