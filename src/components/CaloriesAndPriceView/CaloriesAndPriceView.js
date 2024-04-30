import {StyleSheet, View} from 'react-native';
import RText from '../RText';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';
import React, {forwardRef, useMemo} from 'react';
import {logToConsole} from "../../configs";

const CaloriesAndPriceView = forwardRef(({item, priceTextColor = colors.secondary}, ref) => {
  const {basecalories = '', cost = '', maxcalories = '', caloriesseparator} = item || {};

  const caloriesRange = useMemo(() => {
    return parseInt(maxcalories, 10)
        ? basecalories + (caloriesseparator || '-') + maxcalories
        : parseInt(basecalories)
            ? basecalories
            : null;
  }, [basecalories, caloriesseparator, maxcalories]);

  const accessibilityLabelForCalories = useMemo(() => {
    let split = caloriesRange?.split('-');
    if (split?.length > 1) {
      return `${split[0]} to ${split[1]} calories`;
    }
    return `${caloriesRange} calories`
  }, [caloriesRange])

  return (
      <View  ref={ref} style={styles.caloriesPriceView}>
        {caloriesRange ? (
            <View style={styles.caloriesView} accessible accessibilityLabel={accessibilityLabelForCalories}>
              <RText
                  text={caloriesRange + ' Cal'}
                  size={'xxxs'}
                  weight={'semiBold'}
                  color={colors.primary}
              />
            </View>
        ) : null}
        <RText
            accessible={cost > 0.0}
            text={cost > 0.0 ? '$' + cost.toFixed(2) : 0.0}
            size={'xs'}
            // textStyle={{marginStart: !caloriesRange ? getMScale(0) : getMScale(15)}}
            weight={'semiBold'}
            color={priceTextColor}
        />
      </View>
  );
});
const styles = StyleSheet.create({
  caloriesPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: getMScale(15),
    marginTop: getMScale(13),
  },
  caloriesView: {
    height: getMScale(30),
    paddingHorizontal: getMScale(10),
    borderRadius: getMScale(20),
    backgroundColor: '#F5F1E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CaloriesAndPriceView;
