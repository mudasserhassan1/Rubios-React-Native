import {useCallback, useMemo, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {
  deleteBillingAccount,
  getAllBillingAccounts,
  updateBillingAccount,
} from '../../redux/actions/user';
import {requestGiftCardBalance} from '../../services/user';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';

const usePaymentMethodHooks = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [isGiftCardLoading, setIsGiftCardLoading] = useState(false);

  const isLoadedOnce = useRef(false);
  const getGiftCardsOnce = useRef(true);

  const dispatch = useDispatch();
  const {userBillingAccounts, userDataLoading} = useUserSelector();
  const {billingaccounts = []} = userBillingAccounts || {};

  const {creditCards} = useMemo(() => {
    const cards = billingaccounts.filter(
      billingAccount => billingAccount.accounttype === 'creditcard',
    );
    return {
      creditCards: cards.reduce(
        (pre, curr) => (curr?.isdefault ? [curr, ...pre] : [...pre, curr]),
        [],
      ),
    };
  }, [billingaccounts]);

  useEffect(() => {
    if (!isLoadedOnce?.current) {
      if (billingaccounts?.length) {
        isLoadedOnce.current = true;
      }
    }
  }, [billingaccounts]);

  useEffect(() => {
    dispatch(getAllBillingAccounts());
  }, []);

  useEffect(() => {
    if (billingaccounts && billingaccounts?.length && getGiftCardsOnce.current) {
      updateGiftCard().then();
    }
  }, [billingaccounts]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'payment_methods_screen',
    });
  }, []);

  const updateGiftCard = async () => {
    setIsGiftCardLoading(true);
    const gift = billingaccounts?.filter(
      cardType =>
        cardType.accounttype !== 'creditcard' && cardType.accounttype !== 'payinstore (cash)',
    );
    if (gift.length > 0) {
      const giftCardBalance = await getGiftCardBalance(gift);
      setGiftCards(giftCardBalance);
      if (giftCardBalance?.length > 0) {
        getGiftCardsOnce.current = false;
      }
    } else {
      setGiftCards([]);
      setIsGiftCardLoading(false);
    }
  };

  const getGiftCardBalance = async gift => {
    const giftCardIds = gift.map(card => {
      return card.accountidstring;
    });
    let balanceResponse = await requestGiftCardBalance(giftCardIds);
    setIsGiftCardLoading(false);
    if (balanceResponse && balanceResponse.length) {
      let giftCardsBalance = gift.map((e, i) => {
        let temp = balanceResponse.find(element => {
          const id = element.config.url.substring(element.config.url.lastIndexOf('/') + 1);
          return id === e.accountidstring;
        });
        if (temp && temp.data.balance) {
          e.balance = temp.data.balance;
        }
        return e;
      });
      return giftCardsBalance;
    }
  };

  const deleteBillingAccountHandler = id => {
    dispatch(deleteBillingAccount(id));
  };

  const makeBillingCardDefaultHandler = item => {
    const obj = {
      isdefault: true,
    };
    dispatch(updateBillingAccount(obj, item.accountid));
  };

  return {
    creditCards,
    giftCards,
    userDataLoading,
    isGiftCardLoading,
    isLoadedOnce,
    deleteCreditCardHandler: deleteBillingAccountHandler,
    makeDefaultCreditCard: makeBillingCardDefaultHandler,
  };
};

export default usePaymentMethodHooks;
