import {View} from 'react-native';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import PaymentCardItem from '../../components/PaymentCardItem/PaymentCardItem';
import RButton from '../../components/RButton';
import {colors} from '../../theme';
import {strings} from '../../constants';
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
import {getBillingSchemesStats, updatePaymentCardsAmount} from '../../helpers/checkout';
import {displayToast} from '../../helpers/toast';

const GiftCardsListBottomSheet = forwardRef(({onPressAddGiftCard, onEditPress}, ref) => {
  const sheetRef = useRef();
  const snapPoints = useMemo(() => {
    return [getMScale(776)];
  }, []);

  const dispatch = useDispatch();

  const {top} = useSafeAreaInsets();
  const {billingSchemes, basket} = useBasketSelector();
  const [savedCards, setSavedCards] = useState(billingSchemes);

  useEffect(() => {
    setSavedCards([...billingSchemes]);
  }, [billingSchemes]);

  const giftCards = useMemo(() => {
    return savedCards.filter(item => item.billingmethod === 'storedvalue');
  }, [savedCards]);

  const hideAddGiftCard =
    billingSchemes.filter(item => item.billingmethod === 'storedvalue' && item.selected).length ===
    4;

  const handleCardSelection = item => {
    const billingSchemeStats = getBillingSchemesStats(billingSchemes);
    const isAlreadySelected = item.selected;
    if (
      billingSchemeStats.selectedGiftCard === 4 &&
      !isAlreadySelected &&
      item.billingmethod === 'storedvalue'
    ) {
      displayToast('ERROR', 'Only 4 Gift Card can be used to make a payment');
      return;
    }
    const accountIndex = billingSchemes.findIndex(element => element.localId === item.localId);
    if (accountIndex !== -1) {
      let updatedBillingSchemes = billingSchemes;
      if (!isAlreadySelected) {
        updatedBillingSchemes[accountIndex].selected = true;
        updatedBillingSchemes[accountIndex].alwaysVisible = false;
      } else {
        updatedBillingSchemes[accountIndex].selected = false;
      }
      updatedBillingSchemes = updatePaymentCardsAmount(updatedBillingSchemes, basket);
      updatedBillingSchemes = updatedBillingSchemes.map(element => {
        let obj = {
          ...element,
        };
        if (updatedBillingSchemes[accountIndex].billingmethod === element.billingmethod) {
          obj.alwaysVisible = false;
        }
        return obj;
      });
      setSavedCards(updatedBillingSchemes);
    }
  };

  const handleDonePress = () => {
    const updatedBasketBillingSchemes = updatePaymentCardsAmount(savedCards, basket);
    dispatch(updateBasketBillingSchemes(updatedBasketBillingSchemes));
    sheetRef?.current?.closeSheet?.();
  };
  const renderCards = ({item, index}) => {
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
        {!hideAddGiftCard ? (
          <>
            <RButton
              onPress={onPressAddGiftCard}
              accessibilityHint={'activate to open add gift card modal'}
              buttonStyle={{
                backgroundColor: colors.transparent,
                borderColor: colors.secondary,
                borderWidth: 2,
                width: '100%',
              }}
              titleStyle={{color: colors.secondary}}
              title={'add a gift card'}
            />
          </>
        ) : null}
        <Divider style={{marginVertical: getMScale(15)}} />
        <RButton
          title={strings.done}
          accessibilityHint={'activate to save gift card selection'}
          onPress={handleDonePress}
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
          title={'Select Gift Card'}
          withBackIcon
          onClose={() => sheetRef?.current?.closeSheet?.()}
        />
        <View style={{marginTop: getMScale(15), flex: 1}}>
          <BottomSheetFlatList
            data={giftCards}
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

export default GiftCardsListBottomSheet;
