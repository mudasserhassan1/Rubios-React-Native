import React, {useMemo} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

import RText from '../RText';
import {colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import {strings} from '../../constants';
import CaloriesAndPriceView from '../CaloriesAndPriceView/CaloriesAndPriceView';
import Plus from '../../assets/svgs/Plus';
import {UIActivityIndicator} from 'react-native-indicators';
import {isIos} from "../../utils/sharedUtils";

const MenuItem = ({item, imagePath, onPress, loading, onQuickAddPress}) => {
  const {name = ''} = item || {};
  const {basecalories = '', cost = '', maxcalories = '', caloriesseparator} = item || {};

  const supportsQuickAdd = useMemo(() => {
    if (item?.metadata?.length > 0) {
      const isQuickAddItem = item?.metadata?.filter(it => it?.key === 'quickAdd')[0];
      return isQuickAddItem?.value === 'true';
    }
  }, [item?.metadata]);

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

  const renderQuickAddJSX = () => {
    if (supportsQuickAdd) {
      return (
        <TouchableOpacity
          accessible
          accessibilityRole={'button'}
          accessibilityHint={'activate to add this Item to bag.'}
          accessibilityState={isIos ? {disabled: loading, busy: loading}: {}}
          disabled={loading}
          style={[styles.addButton, loading && {backgroundColor: colors.secondaryLight}]}
          onPress={onQuickAddPress}>
          {loading ? (
            <UIActivityIndicator size={15} color={colors.white} />
          ) : (
            <View style={styles.addButtonContent}>
              <Plus />
              <RText text={'Add'} maxFontSizeMultiplier={1.1} color={colors.white} size={'xxs'} weight={'headerBold'} />
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return null;
  };

  const iosActions = [
    {
      name: 'customize',
      label: 'customize',
    }
  ]

  const accessibilityActions = useMemo(() => Platform.select({
    ios: supportsQuickAdd ? [{name: 'add', label: 'add to bag'},...iosActions] : iosActions,
    android: [],
  }), [supportsQuickAdd]);

  const handleAccessibilityActions = event => {
    switch (event.nativeEvent.actionName) {
      case 'add':
        onQuickAddPress();
        break;
      case 'customize':
        onPress();
        break;
      default:
        onPress();
        break;
    }
  }
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={`${name}, ${accessibilityLabelForCalories}`}
      accessibilityHint={'swipe up or down for more actions'}
      activeOpacity={1}
      accessibilityValue={{text: cost > 0.0 ? '$' + cost.toFixed(2) : 0.0}}
      disabled={loading}
      onPress={onPress}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={handleAccessibilityActions}
      style={styles.itemContainer}>
      <Image
        source={
          item?.imagefilename
            ? {uri: imagePath}
            : require('../../assets/images/default_item_image.png')
        }
        style={styles.productImage}
        resizeMode={item?.imagefilename ? 'stretch' : 'contain'}
      />
      <View style={styles.productInfo}>
        <RText
          accessible={false}
          weight={'semiBold'}
          size={'xs'}
          numberOfLines={3}
          ellipsizeMode={'tail'}
          color={colors.primary}
          textStyle={styles.titleText}>
          {name}
        </RText>
        <CaloriesAndPriceView item={item} />
        <View
          style={{
            flexDirection: 'row',
            // flexWrap: 'wrap',
            // rowGap: 10,
            marginTop: getMScale(15),
            alignItems: 'center',
            columnGap: 5,
          }}>
          {renderQuickAddJSX()}
          <TouchableOpacity
            accessible={false}
            // accessibilityRole={'button'}
            // accessibilityHint={'activate to go to Item detail screen'}
            disabled={loading}
            style={styles.customizeButton}
            activeOpacity={0.7}
            onPress={onPress}>
            <RText
              color={colors.secondary}
              weight={'headerBold'}
              maxFontSizeMultiplier={1.2}
              text={strings.customize}
              size={'xxs'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    // height: getMScale(143),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.0,
    shadowColor: colors.black,
    elevation: 6,
  },
  customizeButton: {
    backgroundColor: 'rgba(167, 194, 209, 0.23)',
    paddingVertical: getVerticalScale(5),
    paddingHorizontal: getMScale(12),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    width: '58%',
    padding: 10,
  },
  titleText: {lineHeight: 16, letterSpacing: 0.15},
  customiseButton: {width: '75%'},
  productImage: {
    width: getScale(140),
    // height: getVerticalScale(140),
    height: '100%',
    borderTopLeftRadius: 10,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 10,
  },
  addButton: {
    alignSelf: 'center',
    paddingHorizontal: getMScale(16),
    alignItems: 'center',
    backgroundColor: colors.secondaryColor,
    paddingVertical: getVerticalScale(5),
    borderRadius: 30,
    minWidth: getMScale(60),
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    backgroundColor: colors.secondaryColor,
  },
});
export default MenuItem;
