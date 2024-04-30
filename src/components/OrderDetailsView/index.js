import {Text, View} from 'react-native';
import styles from './styles';
import React, {useMemo} from 'react';
import useOrderDetails from './useOrderDetails';
import {useState} from 'react';
import RText from "../RText";
import {logToConsole} from "../../configs";

const OrderDetailsView = ({calculationsOnly = false}) => {
  const {cartCalculations, CALCULATION_KEYS, basket, order, tipPercentage} = useOrderDetails({
    calculationsOnly,
  });

  const {discounts = []} = basket || order || {};

  const renderDiscountView = (discount, index) => {
    return (
      <View style={styles.subTotalView} key={`${discount},${index}`}>
        <RText textStyle={styles.discountLabel}>{`${
          discount.type === 'Coupon' ? 'Coupon ' : 'Reward'
        }`}</RText>
        <RText textStyle={styles.discountValue}>{`-$ ${discount?.amount?.toFixed(2)}`}</RText>
      </View>
    );
  };
  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;

  const accessibilityLabel = useMemo(() => {
    let string = '';
    Object.keys(cartCalculations).map(item => {
      if (item === 'subtotal' && discounts.length > 0) {
        discounts.map(disItem => {
          string = string + String(`${disItem.type === 'Coupon' ? 'Coupon ' : 'Reward'}, -$ ${disItem?.amount?.toFixed(2)},`)
        })
        string = string + String(`${CALCULATION_KEYS[item]}, $${cartCalculations[item]},`);
      } else if (item === 'tax' && calculationsOnly) {
        string = string + String(`Tax & Fees, $${cartCalculations[item]},`);
      } else if (item === 'tip') {
        if (calculationsOnly && tipPercentage) {
          string = string + String(`${CALCULATION_KEYS[item]}${tipPercentage}%, $${cartCalculations[item]},`)
        } else {
          string = string + String(`${CALCULATION_KEYS}, $${cartCalculations[item]},`)
        }
      } else {
        string = string + String(`${CALCULATION_KEYS[item]}, $${cartCalculations[item]},`)
      }
    })
    return String(string)
  }, [cartCalculations, calculationsOnly, discounts]);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={styles.orderDetailView}>
      {Object.keys(cartCalculations).map((label, keyIndex) => {
        return (
          <>
            {label === 'total' ? renderGreyHorizontalLine() : null}
            <View key={`${keyIndex},${label}`}>
              {label === 'subtotal' && discounts.length > 0
                ? discounts?.map(renderDiscountView)
                : null}
              <View accessible style={[styles.subTotalView, keyIndex === 0 && {marginTop: 0}]}>
                <RText
                  key={`${keyIndex},${label}`}
                  textStyle={
                    ['subtotal', 'bagTotal'].includes(label)
                      ? styles.orderDetailTitle
                      : ['total'].includes(label)
                      ? styles.totalTextStyle
                      : styles.estimatedTaxTitle
                  }>
                  {label === 'tip' && calculationsOnly && tipPercentage
                    ? `${CALCULATION_KEYS[label]} ${String(tipPercentage)}% `
                    : label === 'tax' && calculationsOnly
                    ? 'Taxes & Fees'
                    : '' + CALCULATION_KEYS[label]}
                </RText>
                <RText
                  key={`${keyIndex},${label},subtotal`}
                  textStyle={
                    ['subtotal', 'bagTotal'].includes(label)
                      ? styles.orderDetailTitleValue
                      : ['total'].includes(label)
                      ? styles.totalTextStyle
                      : styles.estimatedTaxTitle
                  }>{`$${cartCalculations[label]}`}</RText>
              </View>
            </View>
          </>
        );
      })}
    </View>
  );
};

export default OrderDetailsView;
