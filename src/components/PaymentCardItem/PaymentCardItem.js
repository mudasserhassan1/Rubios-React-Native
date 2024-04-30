import React, {useMemo} from 'react';
import {colors} from '../../theme';
import {Platform, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
import usePaymentCardItem from './usePaymentCardItem';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import ChevronForward from '../../assets/svgs/ChevronForward';
import CheckBoxImage from '../../assets/svgs/CheckBoxImage';
import DeleteSeaGreenIcon from "../../assets/svgs/DeleteSeaGreenIcon";
import {isIos} from "../../utils/sharedUtils";

const PaymentCardItem = ({showChargeAmount, card, handleCardPress, showSelection, onEditPress}) => {
  const {
    CardImage,
    cardLabel,
    cardlastfour,
    selected,
    isGiftCard,
    isCreditCard,
    getGiftCardLastFourDigits,
    isEditEligible,
    amount,
    billingaccountid,
      cardtype,
    onCheckboxPress,
      onDeletePress,
  } = usePaymentCardItem({
    card,
    showSelection,
    showChargeAmount,
  });

  const handleEditPress = () => {
    global.isEditingCard = true;
    onEditPress?.();
  };

  const accessibilityActions = useMemo(() => {
      const actions = [];
      if (showChargeAmount) {
          actions.push({name: 'remove', label: 'remove, activate to remove this card from order'})
      } else {
          if (!selected) {
              actions.push({name: 'delete', label: 'delete, activate to delete this card'})
          }
      }
      if (isEditEligible) {
          actions.push({name: 'edit', label: 'edit, activate to edit card details'})
      }
      return Platform.select({
          ios: actions,
          android: [],
      })
  }, [isEditEligible, selected, showChargeAmount])

    const handleAccessibilityAction = (event) => {
      switch (event.nativeEvent.actionName){
          case 'remove':
              onCheckboxPress();
              break;
          case 'edit':
              handleEditPress();
              break;
          case 'delete':
              onDeletePress();
              break;
          default:
              handleCardPress?.(card?.billingmethod);
              break;
      }
    }

  if (showChargeAmount) {
    return (
            <TouchableOpacity
                accessible={true}
                activeOpacity={0.8}
                accessibilityHint={`activate to open ${isGiftCard ? 'Gift': 'Credit'} cards list modal, or swipe up or down for more actions`}
                accessibilityLabel={`${cardLabel}`}
                accessibilityValue={{text: `charge amount, $${amount.toFixed(2)}`}}
                accessibilityActions={accessibilityActions}
                onAccessibilityAction={handleAccessibilityAction}
                onPress={() => handleCardPress?.(card?.billingmethod)}>
                <View style={styles.cardParentView}>
                    <Pressable
                        hitSlop={10} onPress={onCheckboxPress}>
                        <CheckBoxImage isChecked={selected} height={15} width={15} />
                    </Pressable>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '60%',
                        }}>
                        <CardImage />
                        <RText
                            accessible={false}
                            size={'xs'}
                            text={cardLabel}
                            accessibilityHint={`activate to open ${isGiftCard ? 'Gift': 'Credit'} cards list modal`}
                            textStyle={{marginStart: 5}} />
                        <RText
                            accessible={false}
                            text={`${isCreditCard && cardlastfour  ? '*' + cardlastfour : isGiftCard ? '*' +  getGiftCardLastFourDigits : ''}`}
                            size={'xs'}
                            accessibilityHint={`card last four , activate to open ${isGiftCard ? 'Gift': 'Credit'} cards list modal`}
                            textStyle={{marginStart: 6}} />
                        {isEditEligible ? (
                            <TouchableOpacity
                                onPress={handleEditPress}
                                style={{paddingHorizontal: 10, position: 'absolute', paddingVertical: 8, right: 0}}>
                                <RText text={'Edit'} weight={'semiBold'} color={colors.secondary} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <RText
                            accessible={false}
                             text={`$ ${amount.toFixed(2)}`}
                             weight={'headerBold'} />
                        {!showSelection ? (
                            <View style={{marginStart: getMScale(20)}}>
                                <ChevronForward color={colors.palette.primary_50} />
                            </View>
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
        accessible={true}
        accessibilityLabel={isGiftCard ? `${cardLabel}`: 'Pay with Card'}
        accessibilityHint={selected ? 'activate to unselect this card': 'activate to select this card' + ', or swipe up or down for more actions'}
        accessibilityState={isIos ? {selected: selected} : {}}
        accessibilityValue={{text: `${cardtype}, ${isCreditCard && cardlastfour  ? cardlastfour : isGiftCard ? getGiftCardLastFourDigits : ''}` || (isGiftCard ? 'Gift Card' : 'Credit Card')}}
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
        activeOpacity={0.8}
        onPress={() => handleCardPress?.(card?.billingmethod)}
        style={[
          styles.cardParentView,
          showSelection && selected && {borderWidth: 2, borderColor: colors.secondary},
        ]}>
      <RText
          accessible
          weight={'headerBold'}
          size={'xs'}
          text={cardLabel}/>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {
              !selected && billingaccountid && isCreditCard ? (
                  <TouchableOpacity
                      onPress={onDeletePress}
                      style={{alignSelf: 'center', width: 40,}}>
                      <DeleteSeaGreenIcon />
                  </TouchableOpacity>
              ) : null
          }
              <CardImage />
          <RText
              text={`${isCreditCard && cardlastfour  ? '*' + cardlastfour : isGiftCard ?  '*' + getGiftCardLastFourDigits : ''}`}
              size={'xs'}
              accessibilityHint={'card last four,' + (!selected ? 'activate to select this card': 'activate to unselect this card')}
              textStyle={{marginStart: 6}} />
        {isEditEligible ? (
          <TouchableOpacity
              accessible
            onPress={handleEditPress}
            style={{paddingStart: 10, paddingVertical: 8}}>
            <RText text={'Edit'} weight={'semiBold'} color={colors.secondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {!showSelection ? (
        <View style={{marginStart: getMScale(20)}}>
          <ChevronForward color={colors.palette.primary_50} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardParentView: {
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: 10,
    marginTop: getVerticalScale(10),
    paddingHorizontal: getMScale(20),
    height: getMScale(57),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: colors.black,
        shadowOffset: {
          width: 1,
          height: 0,
        },
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
export default PaymentCardItem;
