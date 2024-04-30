import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, TextInput, TouchableOpacity, View} from 'react-native';
import InputField from '../InputField';
import styles from './styles';
import {colors} from '../../theme';
import {useDispatch} from 'react-redux';
import {
  removeBasketCouponCode,
  setTipFalse,
  updateBasketCouponCode,
  updateBasketTipAmount,
} from '../../redux/actions/basket/checkout';
import RText from '../RText';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import {constants, screens, strings} from '../../constants';
import TipItemPlaceholder from './TipItemPlaceholder';
import {isAndroid, isIos} from '../../utils/sharedUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {setBasketCustomTip, setBasketTipPercentage} from '../../redux/actions/basket';
import {logToConsole} from '../../configs';

export const TIPS_PERCENTAGES = [
  {
    id: '1',
    value: 10,
    label: '10%',
  },
  {
    id: '2',
    value: 15,
    label: '15%',
  },
  {
    id: '3',
    value: 20,
    label: '20%',
  },
];

const TipAndCouponView = ({updateOrderDetailTipPercent, accessibilityElementsHidden}) => {
  const [tipAmountPercentage, setTipAmountPercentage] = useState(0);
  const [runOnce, setRunOnce] = useState(true);
  const [tipCustomAmount, setTipCustomAmount] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [couponCodeError, setCouponCodeError] = useState('');
  const [couponCodeSuccessMessage, setCouponCodeSuccessMessage] = useState('');
  const [tipInputBackgroundColor, setTipInputBackgroundColor] = useState(colors.white);
  const [tipInputTextColor, setTipInputTextColor] = useState(colors.primary);
  const [tipInputPlaceholderTextColor, setTipInputPlaceholderTextColor] = useState(colors.primary);
  const [tipInputSelectionColor, setTipInputSelectionColor] = useState(colors.secondary);
  const [noTipLoading, setNoTipLoading] = useState(false);
  const [noTipSelected, setNoTipSelected] = useState(false);

  const {basket, basketLoading, defaultTip, customTip, tipPercentage} = useBasketSelector();
  const {orderType: handOffMode = ''} = useRestaurantInfoSelector();
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();

  const selectedTipForLoadingRef = useRef(null);

  const setDefaultBasketTip = () => {
    setNoTipSelected(false);
    const defaultTipAmount = ((15 * basket.subtotal) / 100).toFixed(2);
    setTipAmountPercentage(15);
    dispatch(setBasketTipPercentage(15));
    updateTipAmountCall(defaultTipAmount);
  };

  useEffect(() => {
    if (basket) {
      if (runOnce) {
        if (basket?.tip && tipPercentage) {
          setTipAmountPercentage(tipPercentage);
        } else if (basket?.tip && customTip) {
          let convertedTip;
          convertedTip = basket?.tip * 100;
          handleTipCustomAmountChange(String(convertedTip));
        }
        setRunOnce(false);
      }
      if (basket?.coupon?.couponcode) {
        setCouponCode(basket.coupon.couponcode);
      }
    }
  }, [basket, customTip, runOnce, tipPercentage]);

  useEffect(() => {
    if (!defaultTip) {
      updateOrderDetailTipPercent(tipAmountPercentage);
    }
  }, [tipAmountPercentage, updateOrderDetailTipPercent]);

  useEffect(() => {
    logToConsole({handOffMode});
    if (handOffMode === constants.handOffMode.PICKUP && defaultTip && basket?.allowstip) {
      setNoTipSelected(true);
      setTipAmountPercentage(0);
      setTipCustomAmount('');
      dispatch(setBasketTipPercentage(0));
      dispatch(setBasketCustomTip(false));
    } else if (handOffMode !== constants.handOffMode.PICKUP && defaultTip && basket?.allowstip) {
      setDefaultBasketTip();
    }
  }, [handOffMode, tipPercentage, basket?.allowstip]);

  useEffect(() => {
    if (tipCustomAmount && !basketLoading && !tipAmountPercentage) {
      handleTipInputFocus();
    } else {
      setTipInputTextColor(colors.primary);
      setTipInputBackgroundColor(colors.white);
      setTipInputPlaceholderTextColor(colors.primary);
      setTipInputSelectionColor(colors.secondary);
    }
  }, [tipCustomAmount, basketLoading, tipAmountPercentage]);

  useEffect(() => {
    if (!basketLoading) {
      setTipLoading(false);
      setCouponLoading(false);
      setNoTipLoading(false);
    }
  }, [basketLoading]);

  const handleCouponCodeChange = text => {
    setCouponCodeError('');
    setCouponCodeSuccessMessage('');
    setCouponCode(text.trim());
  };
  const handleTipPercentage = tip => {
    logToConsole({tip, tipAmountPercentage});
    dispatch(setTipFalse(false));
    const {id, value} = tip || {};
    if (value !== tipAmountPercentage) {
      selectedTipForLoadingRef.current = id;
      setTipLoading(true);
      if (tipCustomAmount) {
        setTipCustomAmount('');
      }
      setTipAmountPercentage(value);
      handleTipChange(value);
      logFirebaseCustomEvent(strings.click, {
        click_label: 'tip',
        click_destination: screens.CHECKOUT,
      });
    }
  };

  const onRemoveTipPress = () => {
    setNoTipSelected(true);
    setNoTipLoading(true);
    dispatch(setTipFalse(true));
    if (basket?.tip) {
      setTipAmountPercentage(0);
      handleTipChange(0);
    }
  };

  const handleTipChange = val => {
    setTipCustomAmount('');
    let totalTipAmount = ((val * basket?.subtotal) / 100).toFixed(2);
    logToConsole({val, totalTipAmount});
    dispatch(setBasketTipPercentage(val));
    updateTipAmountCall(totalTipAmount);
    dispatch(setTipFalse(false));
    dispatch(setBasketCustomTip(false));
    if (val === 0) {
      setNoTipSelected(true);
    } else {
      setNoTipSelected(false);
    }
  };

  const handleTipCustomAmountChange = text => {
    const nonDecimalText = text?.split('.')?.join('');
    let tipAmount = '';
    if (parseInt(nonDecimalText, 10) === 0 || nonDecimalText.length === 0) {
      tipAmount = '';
    } else if (nonDecimalText.length < 2) {
      tipAmount = `0.0${nonDecimalText}`;
    } else if (nonDecimalText.length < 3) {
      tipAmount = `0.${nonDecimalText}`;
    } else {
      tipAmount = String(parseFloat(nonDecimalText / 100).toFixed(2));
    }
    selectedTipForLoadingRef.current = null;
    setTipCustomAmount(tipAmount);
  };

  const couponCodeSuccess = msg => {
    setCouponCodeSuccessMessage(msg);
    setCouponLoading(false);
  };

  const onCouponCodeError = err => {
    setCouponCodeError(err);
    setCouponLoading(false);
  };
  const updateCouponCodeCall = () => {
    if (basket?.coupon?.couponcode) {
      setCouponLoading(true);
      dispatch(removeBasketCouponCode(basket?.id, ''));
    } else if (couponCode.length) {
      const payload = {
        couponcode: couponCode,
      };
      setCouponLoading(true);
      dispatch(updateBasketCouponCode(basket?.id, payload, couponCodeSuccess, onCouponCodeError));
    }
  };

  const updateTipAmountCall = tip => {
    logToConsole('here');
    !noTipLoading && setTipLoading(true);
    const payload = {
      amount: tip,
    };
    dispatch(updateBasketTipAmount(basket?.id, payload));
  };

  const handleTipInputFocus = () => {
    setTipInputTextColor(colors.white);
    setTipInputBackgroundColor(colors.secondary);
    setTipInputPlaceholderTextColor(colors.white);
    setTipInputSelectionColor(colors.white);
  };

  const handleTipInputBlur = () => {
    if (customTip || tipCustomAmount > 0) {
      dispatch(setTipFalse(false));
      // global.isCustomAmount = true;
      dispatch(setBasketCustomTip(true));
      dispatch(setBasketTipPercentage(0));
      updateTipAmountCall(tipCustomAmount);
      setTipAmountPercentage(0);
      setTipInputTextColor(colors.primary);
      setTipInputBackgroundColor(colors.white);
      setTipInputPlaceholderTextColor(colors.primary);
      setTipInputSelectionColor(colors.secondary);
    }
  };

  const renderCouponCodeInput = () => {
    return (
      <View style={styles.couponInputView}>
        <InputField
          label={'Coupon'}
          placeholder={'Enter Coupon Code'}
          placeholderTextColor={'#D9D9D9'}
          value={couponCode}
          onChangeText={handleCouponCodeChange}
          returnKeyType={'done'}
          error={couponCodeError}
          // editable={!basket?.coupon?.couponcode}
          onBlur={updateCouponCodeCall}
          RightAccessoryComponent={() => (
            <ActivityIndicator
              animating={couponLoading}
              style={{marginEnd: 10}}
              size={'small'}
              color={colors.secondary}
            />
          )}
        />
        {couponCodeSuccessMessage ? (
          <RText
            text={'Coupon Successfully Applied!'}
            textStyle={{marginBottom: getVerticalScale(6)}}
            size={'xxs'}
            color={colors.teal}
          />
        ) : null}
      </View>
    );
  };

  const tipDescriptionText = useMemo(() => {
    if (handOffMode === constants.handOffMode.DISPATCH) {
      return '100% of the tip goes to the delivery driver. Thank them with a tip today!';
    }
    return 'Thank our team with a tip today. The crew appreciates it!';
  }, [handOffMode]);

  const renderTipSection = () => {
    if (handOffMode !== constants.handOffMode.DINEIN) {
      return (
        <View style={styles.tipsContainer}>
          <RText
            text={'Tip The Crew'}
            accessibilityRole={'header'}
            size={'xxs'}
            weight={'semiBold'}
          />
          <RText
            text={tipDescriptionText}
            size={'xxs'}
            color={colors.greyTextColor_}
            textStyle={{marginTop: 5}}
          />
          <View style={styles.tipsItemsView}>
            <>
              {TIPS_PERCENTAGES.map(tp => {
                const {id, label, value} = tp || {};
                const isSelected = tipAmountPercentage === value;
                return (
                  <TouchableOpacity
                    disabled={tipLoading}
                    accessibilityHint={!isSelected ? `activate to select the ${label} tip` : ''}
                    key={id}
                    accessibilityState={
                      isIos
                        ? {busy: !!tipLoading, disabled: !!tipLoading, selected: isSelected}
                        : {}
                    }
                    activeOpacity={0.8}
                    onPress={() => {
                      handleTipPercentage(tp);
                    }}
                    style={[
                      styles.tipItem,
                      tipAmountPercentage === value && styles.selectedTipItem,
                    ]}>
                    {!customTip && tipLoading && isSelected ? (
                      <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                      <RText
                        text={label}
                        size={'xxs'}
                        weight={'semiBold'}
                        color={tipAmountPercentage === value ? colors.white : colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {tipLoading && customTip ? (
              <View style={styles.inputLoadingPlaceholder}>
                <TipItemPlaceholder
                  width={getMScale(160)}
                  height={getMScale(27)}
                  itemWidth={getMScale(140)}
                  itemHeight={getMScale(27)}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.tipAmountInputView,
                  {
                    backgroundColor: tipInputBackgroundColor,
                  },
                  tipCustomAmount && {
                    minWidth: getMScale(191),
                    maxWidth: getMScale(300),
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                {tipCustomAmount ? (
                  <RText
                    size={'xxs'}
                    weight={'semiBold'}
                    color={tipInputTextColor}
                    text={'Amount Entered: $'}
                    accessibilityLabel={`Amount entered $${tipCustomAmount}`}
                    textStyle={isAndroid && {marginStart: getScale(50)}}
                  />
                ) : null}
                <TextInput
                  placeholder={'Enter Amount'}
                  allowFontScaling={isIos}
                  maxFontSizeMultiplier={1.3}
                  placeholderTextColor={tipInputPlaceholderTextColor}
                  accessibilityHint={'Enter custom tip amount'}
                  style={[
                    styles.tipAmountInput,
                    {
                      color: tipInputTextColor,
                    },
                    tipCustomAmount && {
                      textAlign: 'left',
                      width: 'auto',
                      paddingHorizontal: 5,
                    },
                  ]}
                  returnKeyType={'done'}
                  maxLength={6}
                  keyboardType={'decimal-pad'}
                  onChangeText={handleTipCustomAmountChange}
                  value={`${tipCustomAmount}`}
                  onBlur={handleTipInputBlur}
                  onFocus={handleTipInputFocus}
                  selectionColor={tipInputSelectionColor}
                />
              </View>
            )}
            <TouchableOpacity
              disabled={!basket?.tip}
              accessibilityHint={'activate to remove tip from order'}
              onPress={onRemoveTipPress}
              style={[
                styles.tipAmountInputView,
                {width: getMScale(90), marginStart: 10},
                noTipSelected && {backgroundColor: colors.secondary},
              ]}>
              {noTipLoading ? (
                <ActivityIndicator size={'small'} color={colors.white} />
              ) : (
                <RText
                  text={'No Tip'}
                  size={'xxs'}
                  weight={'semiBold'}
                  color={noTipSelected ? colors.white : colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View accessibilityElementsHidden={accessibilityElementsHidden}>
      {renderCouponCodeInput()}
      {renderTipSection()}
    </View>
  );
};

export default TipAndCouponView;
