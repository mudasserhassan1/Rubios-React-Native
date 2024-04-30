import {View} from 'react-native';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import PaymentCardItem from '../../components/PaymentCardItem/PaymentCardItem';
import RButton from '../../components/RButton';
import {colors} from '../../theme';
import {screens, strings} from '../../constants';
import Divider from '../../components/Divider';
import BottomSheetModalComponent from '../../components/BottomSheetModal/BottomSheetModalComponent';
import BottomSheetHeader from '../../components/BottomSheetHeader/BottomSheetHeader';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useMemo} from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useDispatch} from 'react-redux';
import {updateBasketBillingSchemes} from '../../redux/actions/basket/checkout';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {updatePaymentCardsAmount} from '../../helpers/checkout';
import {displayToast} from '../../helpers/toast';

const CreditCardsListBottomSheet = forwardRef(({onPressAddCreditCard, onEditPress}, ref) => {
  const sheetRef = useRef();
  const snapPoints = useMemo(() => {
    return [getMScale(776)];
  }, []);

  const dispatch = useDispatch();

  const prevSelectedCard = useRef(null);

  const {top} = useSafeAreaInsets();
  const {billingSchemes, basket} = useBasketSelector();
  const [savedCards, setSavedCards] = useState(billingSchemes);

  useEffect(() => {
    setSavedCards([...billingSchemes]);
  }, [billingSchemes]);

  const creditCards = useMemo(() => {
    return savedCards?.filter(item => item.billingmethod === 'creditcard');
  }, [savedCards]);

  useEffect(() => {
    prevSelectedCard.current = creditCards?.filter(item => item.selected)[0];
  }, []);

  const hideAddCreditCard = billingSchemes.some(
    item => item.billingmethod === 'creditcard' && !item.billingaccountid,
  );

  const handleCardSelection = item => {
    let updatedSchemes = savedCards.map(cc => {
      if (cc.billingmethod === 'creditcard') {
        if (cc.selected) {
          return {
            ...cc,
            selected: false,
          };
        }
        return {
          ...cc,
          selected: item.localId === cc.localId,
        };
      }
      return cc;
    });
    setSavedCards(updatedSchemes);
  };

  const handleDonePress = () => {
    const newSelectedCard = creditCards.filter(item => item.selected)[0];
    if (prevSelectedCard?.current?.localId !== newSelectedCard?.localId) {
      displayToast('SUCCESS', 'Payment method updated.');
    }
    const updatedBasketBillingSchemes = updatePaymentCardsAmount(savedCards, basket);
    dispatch(updateBasketBillingSchemes(updatedBasketBillingSchemes));
    sheetRef?.current?.closeSheet?.();
    prevSelectedCard.current = newSelectedCard;
  };
  const renderCards = ({item}) => {
    return (
      <View style={{marginHorizontal: getMScale(15), marginVertical: getMScale(3)}}>
        <PaymentCardItem
          card={item}
          showSelection
          handleCardPress={() => handleCardSelection(item)}
          onEditPress={onEditPress}
        />
      </View>
    );
  };

  const renderListFooter = () => {
    return (
      <View style={{width: '90%', alignSelf: 'center', marginTop: getVerticalScale(15)}}>
        {!hideAddCreditCard ? (
          <>
            <RButton
              onPress={onPressAddCreditCard}
              accessibilityHint={'activate to open add credit card sheet'}
              buttonStyle={{
                backgroundColor: colors.transparent,
                borderColor: colors.secondary,
                borderWidth: 2,
                width: '100%',
              }}
              click_label={strings.add_credit_Card}
              click_destination={screens.CHECKOUT}
              titleStyle={{color: colors.secondary, textAlign: 'center'}}
              title={strings.add_credit_Card}
            />
          </>
        ) : null}
        <Divider style={{marginVertical: getMScale(15)}} />
        <RButton
          title={strings.done}
          accessibilityHint={'activate to save credit card selection'}
          onPress={handleDonePress}
          click_label={strings.done}
          click_destination={screens.CHECKOUT}
          buttonStyle={{alignSelf: 'center', marginVertical: getMScale(25)}}
        />
      </View>
    );
  };

  const open = () => {
    sheetRef?.current?.openSheet();
  };

  const close = () => {
    sheetRef?.current?.closeSheet();
  };
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <BottomSheetModalComponent
      ref={sheetRef}
      hideHandleBar
      snapIndex={0}
      topInset={top + 20}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      snapPoints={snapPoints}>
      <View style={{flex: 1}}>
        <BottomSheetHeader
          title={'Select Card'}
          withBackIcon
          onClose={() => sheetRef?.current?.closeSheet?.()}
        />
        <View style={{marginTop: getMScale(15), flex: 1}}>
          <BottomSheetFlatList
            data={creditCards}
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={item => item.localId}
            renderItem={renderCards}
            ListFooterComponent={renderListFooter}
          />
        </View>
      </View>
    </BottomSheetModalComponent>
  );
});

export default CreditCardsListBottomSheet;
