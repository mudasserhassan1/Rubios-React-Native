import {useCallback, useMemo, useState} from 'react';
import {getBillingSchemesStats, updatePaymentCardsAmount} from '../../helpers/checkout';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useDispatch} from 'react-redux';
import {updateBasketBillingSchemes} from '../../redux/actions/basket/checkout';
import {displayToast} from '../../helpers/toast';
import GiftCardIcon from '../../assets/svgs/GiftCardIcon';
import VisaIcon from '../../assets/svgs/VisaIcon';
import MasterCardIcon from '../../assets/svgs/MasterCardIcon';
import AmexIcon from '../../assets/svgs/AmexIcon';
import DiscoverIcon from '../../assets/svgs/DiscoverIcon';
import {Alert} from 'react-native';
import GenericCardIcon from "../../assets/svgs/GenericCardIcon";
import { logToConsole } from "../../configs";
import {deleteBillingAccount} from "../../redux/actions/user";

const usePaymentCardItem = ({card, showSelection, showChargeAmount}) => {
  const {
    billingmethod = '',
    billingfields = [],
    cardlastfour = '',
    amount = 0.0,
    billingaccountid = '',
    cardtype = '',
    selected,
    localId,
  } = card || {};

  const [visibleRemovePaymentModal, setVisibleRemovePayment] = useState(false);
  const [removablePaymentMethod, setRemoveablePaymentMethod] = useState({});

  const dispatch = useDispatch();
  const {billingSchemes, basket} = useBasketSelector();

  const isGiftCard = billingmethod === 'storedvalue';
  const isCreditCard = billingmethod === 'creditcard';

  const showRemovePaymentModal = useCallback(() => setVisibleRemovePayment(true), []);
  const hideRemovePaymentModal = useCallback(() => setVisibleRemovePayment(false), []);

  const CardImage = useMemo(() => {
    if (isCreditCard) {
      switch (cardtype) {
        case 'Visa':
          return VisaIcon;
        case 'Mastercard':
          return MasterCardIcon;
        case 'Amex':
          return AmexIcon;
        case 'Discover':
          return DiscoverIcon;
        default:
          return GenericCardIcon;
      }
    } else {
      return GiftCardIcon;
    }
  }, [cardtype, isCreditCard]);

  const getGiftCardLastFourDigits = useMemo(() => {
    if (cardlastfour) {
      return cardlastfour;
    }
    const giftCardNumber =
      (billingfields &&
        billingfields.length &&
        billingfields[0].name === 'number' &&
        billingfields[0].value) ||
      '';
    if (giftCardNumber !== '') {
      return giftCardNumber.toString().slice(-4);
    } else {
      return '';
    }
  }, [billingfields]);

  const cardLabel = useMemo(() => {
    if (isGiftCard) {
      if (showChargeAmount) {
        return `Gift Card`;
      }
      if (billingfields) {
        return `Balance $${card.balance.toFixed(2)}`;
      }
      if (cardlastfour) {
        return `Gift Card x${cardlastfour}`;
      }
      return '';
    }
    if (isCreditCard) {
      if (showSelection) {
        return 'Pay with Card';
      }
      return 'Card';
    }
  }, [billingfields, cardlastfour, getGiftCardLastFourDigits, isCreditCard, isGiftCard]);

  const handleCheckBox = checked => {
    const billingSchemeStats = getBillingSchemesStats(billingSchemes);
    const totalCardsSelected =
      billingSchemeStats.selectedGiftCard + billingSchemeStats.selectedCreditCard;
    if (totalCardsSelected === 5 && checked) {
      if (billingmethod === 'creditcard') {
        let updatedBillingSchemes = billingSchemes.map(element => {
          if (element.billingmethod === 'creditcard') {
            return {
              ...element,
              selected: element.localId === localId,
            };
          }
          return element;
        });
        updatedBillingSchemes = updatePaymentCardsAmount(updatedBillingSchemes, basket);
        dispatch(updateBasketBillingSchemes(updatedBillingSchemes));
        return;
      } else {
        return displayToast('ERROR', 'Maximum 5 payment methods can be used to make a payment');
      }
    }
    if (billingSchemeStats.selectedGiftCard === 4 && checked && billingmethod === 'storedvalue') {
      return displayToast('ERROR', 'Only 4 Gift Card can be used to make a payment');
    }
    if (billingSchemeStats.selectedCreditCard === 1 && checked && billingmethod === 'creditcard') {
      let updatedBillingSchemes = billingSchemes.map(element => {
        if (element.billingmethod === 'creditcard') {
          return {
            ...element,
            selected: element.localId === localId,
          };
        }
        return element;
      });
      updatedBillingSchemes = updatePaymentCardsAmount(updatedBillingSchemes, basket);
      return dispatch(updateBasketBillingSchemes(updatedBillingSchemes));
    }
    const accountIndex = billingSchemes.findIndex(element => element.localId === localId);
    if (accountIndex > -1) {
      let updatedBillingSchemes = billingSchemes;
      if (checked) {
        updatedBillingSchemes[accountIndex].selected = checked;
        updatedBillingSchemes = updatePaymentCardsAmount(updatedBillingSchemes, basket);
        dispatch(updateBasketBillingSchemes(updatedBillingSchemes));
      } else {
        setRemoveablePaymentMethod({
          localId: localId,
          billingmethod: updatedBillingSchemes[accountIndex],
        });
      }
    }
  };

  const removeSingleBasketBillingSchemes = () => {
    if (removablePaymentMethod) {
      let updatedBillingSchemes = billingSchemes.map(element => {
        if (element.localId === localId) {
          return {
            ...element,
            selected: false,
          };
        } else {
          return element;
        }
      });

      updatedBillingSchemes = updatePaymentCardsAmount(updatedBillingSchemes, basket);
      dispatch(updateBasketBillingSchemes(updatedBillingSchemes));
      displayToast('SUCCESS', 'Card Removed.');
    }
    hideRemovePaymentModal();
  };

  const isEditEligible = useMemo(() => {
    return isCreditCard && !billingaccountid;
  }, [billingaccountid, isCreditCard]);

  const onCheckboxPress = item => {
    const giftCardLastFour = getGiftCardLastFourDigits;
    const ccLastFour = cardlastfour;
    const last4 = isGiftCard ? giftCardLastFour : ccLastFour;
    Alert.alert(
      'Remove Payment Method',
      `Do you want to remove ${cardLabel} ending with *${last4} from this order?`,
      [
        {
          text: 'Remove',
          style: 'destructive',
          onPress: removeSingleBasketBillingSchemes,
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const handleDelete = () => {
    const updatedBillingSchemes = billingSchemes.filter(item => item?.billingaccountid !== billingaccountid);
    dispatch(updateBasketBillingSchemes(updatedBillingSchemes));
    dispatch(deleteBillingAccount(billingaccountid));
    displayToast('SUCCESS', 'Card removed');
  }

  const onDeletePress = () => {
    Alert.alert(
        'Delete Method',
        ` Are you sure you want to delete the card ending in ${cardlastfour}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: handleDelete,
          },
        ],
    );
  };

  return {
    amount,
    isGiftCard,
    isCreditCard,
    CardImage,
    cardlastfour,
    billingaccountid,
    getGiftCardLastFourDigits,
    cardLabel,
    selected,
    visibleRemovePaymentModal,
    handleCheckBox,
    showRemovePaymentModal,
    hideRemovePaymentModal,
    removeSingleBasketBillingSchemes,
    isEditEligible,
    onCheckboxPress,
    onDeletePress,
    cardtype,
  };
};

export default usePaymentCardItem;
