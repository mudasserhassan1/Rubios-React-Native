import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {getBillingSchemesStats, getUniqueId, remainingAmount, updatePaymentCardsAmount,} from '../../helpers/checkout';
import {useDispatch} from 'react-redux';
import useAuthSelector from '../../hooks/reduxStateHooks/useAuthSelector';
import {updateBasketBillingSchemes} from '../../redux/actions/basket/checkout';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';

const useOrderPaymentMethods = ({placingOrder}) => {
  const [isVisibleAddCreditCardModal, setVisibleAddCreditCardModal] = useState(false);
  const [isVisibleAddGiftCardModal, setIsVisibleAddGiftCardModal] = useState(false);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);

  const {isGuest = false} = useGuestSelector();
  const {basket, allowedBillingSchemes, billingSchemes, basketLoading} = useBasketSelector();
  const {isLoggedIn} = useAuthSelector();
  const {userBillingAccounts, userDataLoading} = useUserSelector();
  const dispatch = useDispatch();

  const removeCreditCardOnceRef = useRef(true);
  const calculateBillingSchemes = useRef(true);

  const {showCardsList, selectedBillingSchemes} = useMemo(
    () => ({
      showCardsList: billingSchemes && billingSchemes.length > 0,
      selectedBillingSchemes: billingSchemes.filter(item => item.selected),
    }),
    [billingSchemes],
  );

  const giftCardBottomSheetRef = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      removeCreditCardOnceRef.current = true;
      calculateBillingSchemes.current = true;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (
      basket &&
      allowedBillingSchemes?.length &&
      !billingSchemes?.length &&
      !userDataLoading &&
      !basketLoading &&
      !isGuest
    ) {
      const creditCardIndex = allowedBillingSchemes.findIndex(
        schemes => schemes.type === 'creditcard',
      );
      const giftCardIndex = allowedBillingSchemes.findIndex(schemes => schemes.type === 'giftcard');
      let billingArray = [];
      if (creditCardIndex !== -1 && userBillingAccounts) {
        if (userBillingAccounts.billingaccounts && userBillingAccounts.billingaccounts.length) {
          userBillingAccounts.billingaccounts.forEach(card => {
            if (card?.accounttype === 'creditcard') {
              let cardObj = {
                localId: getUniqueId(),
                selected: card.isdefault,
                savedCard: true,
                billingmethod: 'creditcard',
                amount: 0,
                tipportion: 0.0,
                cardtype: card.cardtype,
                cardlastfour: card.cardsuffix,
                billingaccountid: card.accountidstring,
                billingschemeid: allowedBillingSchemes[creditCardIndex].id,
              };
              billingArray.push(cardObj);
            }
          });
        }
      }
      if (giftCardIndex !== -1) {
        if (
          allowedBillingSchemes[giftCardIndex].accounts &&
          allowedBillingSchemes[giftCardIndex].accounts.length
        ) {
          let defaultGiftCards = allowedBillingSchemes[giftCardIndex].accounts;
          defaultGiftCards = defaultGiftCards
            .map(card => {
              return {
                ...card,
                balance: (card.balance && card.balance.balance) || 0,
              };
            })
            .filter(card => card.balance > 0)
            .sort((a, b) => (a.balance > b.balance ? 1 : b.balance > a.balance ? -1 : 0));
          let giftCardArray = createDefaultGiftCards(defaultGiftCards);
          Array.prototype.push.apply(billingArray, giftCardArray);
        }
      }
      if (billingArray.length) {
        billingArray = updatePaymentCardsAmount(billingArray, basket);
        dispatch(updateBasketBillingSchemes(billingArray));
        calculateBillingSchemes.current = false;
      }
    }
  }, [
    allowedBillingSchemes,
    userBillingAccounts,
    isGuest,
    billingSchemes,
    basketLoading,
    basket,
    userDataLoading,
    dispatch,
  ]);

  useEffect(() => {
    if (basket) {
      if (billingSchemes && billingSchemes.length) {
        const updatedBillingScheme = updatePaymentCardsAmount(billingSchemes, basket);
        dispatch(updateBasketBillingSchemes(updatedBillingScheme));
      }
    }
  }, [basket, dispatch]);

  let runOnceRef = useRef(true);

  useEffect(() => {
    if (basket && billingSchemes && billingSchemes.length && removeCreditCardOnceRef.current && !placingOrder) {
      let billingArray = billingSchemes.filter(
        account => !(account.billingmethod === 'creditcard' && !account.billingaccountid),
      );
      if (
        billingArray.filter(element => element.billingmethod === 'creditcard' && element.selected)
          .length === 0
      ) {
        const findCard = billingArray.findIndex(elem => elem.billingmethod === 'creditcard');
        if (findCard !== -1) {
          billingArray[findCard].selected = true;
        }
      }
      billingArray = updatePaymentCardsAmount(billingArray, basket);
      dispatch(updateBasketBillingSchemes(billingArray));
      removeCreditCardOnceRef.current = false;
    }
  }, [basket, dispatch, placingOrder]);

  const showCreditCardModal = useCallback(() => setVisibleAddCreditCardModal(true), []);

  const hideCreditOrGiftCardModal = useCallback(() => {
    setVisibleAddCreditCardModal(false);
    setIsVisibleAddGiftCardModal(false);
    setIsEditingCard(false);
  }, []);

  const billingSchemeStats = getBillingSchemesStats(billingSchemes);

  const createDefaultGiftCards = defaultGiftCards => {
    let array = [];
    for (let i = 0; i < defaultGiftCards.length; i++) {
      let giftCardObj = {
        localId: getUniqueId(),
        savedCard: true,
        selected: true,
        billingmethod: 'storedvalue',
        amount: 0,
        balance: defaultGiftCards[i].balance,
        tipportion: 0.0,
        cardlastfour: defaultGiftCards[i].cardsuffix,
        billingaccountid: defaultGiftCards[i].accountidstring,
        billingschemeid: defaultGiftCards[i].id,
      };
      array.push(giftCardObj);
    }
    return array;
  };

  const remainingOrderAmount = useMemo(() => {
    return remainingAmount(basket, billingSchemes);
  }, [basket, billingSchemes]);

  const isAddCreditCardVisible = useMemo(() => {
    return Boolean(
      basket &&
        allowedBillingSchemes &&
        allowedBillingSchemes.length &&
        !billingSchemes.some(bs => bs.billingmethod === 'creditcard' && bs.selected),
    );
  }, [allowedBillingSchemes, basket, billingSchemes]);

  const isAddGiftCardVisible = useMemo(() => {
    return (
      basket &&
      billingSchemeStats.giftCard < 4 &&
      allowedBillingSchemes &&
      allowedBillingSchemes.length > 0 &&
      allowedBillingSchemes.some(item => item.type === 'giftcard')
    );
  }, [allowedBillingSchemes, basket, billingSchemes]);

  const isSelectGiftCardVisible = useMemo(() => {
    return (
      billingSchemes && billingSchemeStats.selectedGiftCard === 0 && billingSchemeStats.giftCard > 0
    );
  }, [billingSchemeStats, billingSchemes]);

  const isChangePaymentMethodVisible = useMemo(() => {
    return (
      basket &&
      isLoggedIn &&
      billingSchemes &&
      billingSchemes?.filter(account => account.billingmethod === 'creditcard').length > 0 &&
      billingSchemes?.filter(account => account.billingmethod === 'creditcard' && account.selected)
        .length === 0 &&
      allowedBillingSchemes.length &&
      allowedBillingSchemes.filter(element => {
        return element.type === 'creditcard';
      }).length > 0
    );
  }, [allowedBillingSchemes, isLoggedIn, basket, billingSchemes, isLoggedIn, showSavedCards]);

  const displaySavedCards = useCallback(() => setShowSavedCards(true), []);

  const showAddAnotherPaymentMessage = useMemo(
    () =>
      Boolean(
        billingSchemeStats.selectedGiftCard === 4 &&
          billingSchemeStats.creditCard === 0 &&
          remainingOrderAmount > 0,
      ),
    [billingSchemeStats.creditCard, billingSchemeStats.selectedGiftCard, remainingOrderAmount],
  );

  const {isSavedCardsListEligibleToDisplay, savedCardsList} = useMemo(() => {
    return {
      savedCardsList: billingSchemes.filter(account => account.savedCard && !account.selected),
      isSavedCardsListEligibleToDisplay:
        showSavedCards && billingSchemes && billingSchemes.length > 0,
    };
  }, [billingSchemes, showSavedCards]);

  return {
    giftCardBottomSheetRef,
    remainingOrderAmount,
    isAddCreditCardVisible,
    isAddGiftCardVisible,
    isVisibleAddCreditCardModal,
    isVisibleAddGiftCardModal,
    showCardsList,
    selectedBillingSchemes,
    showCreditCardModal,
    hideCreditOrGiftCardModal,
    isChangePaymentMethodVisible,
    displaySavedCards,
    isEditingCard,
    showAddAnotherPaymentMessage,
    isSavedCardsListEligibleToDisplay,
    savedCardsList,
    isSelectGiftCardVisible,
    userDataLoading,
  };
};
export default useOrderPaymentMethods;
