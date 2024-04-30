import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
import {colors} from '../../theme';
import useOrderItem from './useOrderItem';
import PickUpLargeIcon from '../../assets/svgs/PickUpLargeIcon';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {constants, screens, strings} from '../../constants';
import DeliveryLargeIcon from '../../assets/svgs/DeliveryLargeIcon';
import Star from '../../assets/svgs/Star';
import {navigateTo} from '../../utils/navigationUtils';
import BlueFilledStar from '../../assets/svgs/BlueFilledStar';

const OrderItem = ({item, onFavClick, isFavourite, onUnFavClick, onReorderPress, loading, isReorderPressed}) => {
  const {
    vendorname = '',
    name = '',
    products = [],
    deliverymode = '',
    deliveryaddress = {},
  } = useOrderItem({
    order: item || {},
  });

  const deliveryAddressString = useMemo(() => {
    const {streetaddress, building, zipcode, city} = deliveryaddress || {};
    return `${streetaddress}, ${building ? building + ', ' : ''}${city}, ${zipcode}`;
  }, [deliveryaddress]);


  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;
  return (
      <View>
        <TouchableOpacity
            accessible
            accessibilityHint={'activate to open Order details screen'}
            onPress={() => navigateTo(screens.MY_ORDER_DETAIL, {item})}
            activeOpacity={0.7}
            style={styles.container}>
          <View style={styles.innerContainer}>
            {!isFavourite ? (
                <View style={{marginStart: getMScale(16)}}>
                  {deliverymode === constants.handOffMode.DISPATCH ? (
                      <DeliveryLargeIcon />
                  ) : (
                      <PickUpLargeIcon />
                  )}
                </View>
            ) : null}
            <View style={styles.textArea}>
              <RText
                  ellipsizeMode={'tail'}
                  size={'xxs'}
                  weight={'semiBold'}
                  color={colors.primary}
                  textStyle={styles.resturantName}
                  text={
                    isFavourite
                        ? name
                        : deliverymode === constants.handOffMode.DISPATCH
                            ? 'Delivered To:' + '\n' + deliveryAddressString
                            : 'Pick Up From:' + '\n' + vendorname
                  }
              />
              {products.slice(0, 3).map((product, index) => (
                  <>
                    <RText
                        key={index}
                        numberOfLines={3}
                        text={product?.name}
                        textStyle={styles.productName}
                        color={colors.subTitleText}
                        size={'xxs'}
                    />
                    <RText
                        text={`${product?.quantity} ${product?.quantity > 1 ? 'Items' : 'item'} ${
                            !isFavourite && product?.totalcost !== 0 ? ' $' + product?.totalcost : ''
                        } `}
                        textStyle={styles.quantityPriceTextStyle}
                        color={colors.primary}
                        size={'xxs'}
                    />
                  </>
              ))}
            </View>
          </View>
          {renderGreyHorizontalLine()}
          <View
              style={[styles.bottomArea, {justifyContent: isFavourite ? 'flex-end' : 'flex-start'}]}>
            <TouchableOpacity
                accessible
                accessibilityHint={
                  isFavourite
                      ? 'activate to unfavorite this item'
                      : 'activate to favorite this item'
                }
                hitSlop={{top: 15, left: 15, right: 10, bottom: 15}}
                onPress={isFavourite ? onUnFavClick : onFavClick}>
              {isFavourite ? (
                  <BlueFilledStar />
              ) : (
                  <View style={styles.addToFavWrapper}>
                    <Star />
                    <RText
                        color={colors.secondary}
                        size={'xxs'}
                        text={'Add to Favorites'}
                        textStyle={{marginStart: getMScale(8)}}
                    />
                  </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
                accessible
                accessibilityHint={'activate to re order this previous order.'}
                disabled={isReorderPressed}
                activeOpacity={0.7}
                onPress={onReorderPress}>
              <View style={styles.reOrderBtn}>
                {isReorderPressed && loading ? (
                    <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                    <RText
                        maxFontSizeMultiplier={1.2}
                        color={colors.white}
                        weight={'headerBold'}
                        text={strings.reOrder}
                        size={'xxs'}
                    />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.emptyView} />
      </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    paddingVertical: getMScale(16),
    backgroundColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
    marginTop: getMScale(10),
    borderRadius: getMScale(16),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginBottom:16
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginTop: getVerticalScale(16),
  },
  productName: {
    marginTop: getMScale(5),
    lineHeight: 16,
    width: '85%',
  },
  reOrderBtn: {
    backgroundColor: colors.secondary,
    minHeight: getMScale(24),
    minWidth: getMScale(85),
    // marginStart: getMScale(16),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resturantName: {
    lineHeight: 17.5,
    marginEnd: getMScale(16),
    maxWidth: '90%',
  },
  quantityPriceTextStyle: {
    marginTop: getMScale(5),
    lineHeight: 16,
  },
  dateStyle: {
    marginStart: getMScale(16),
  },
  emptyView: {
    marginTop: getMScale(16),
  },
  textArea: {
    paddingBottom: getMScale(16),
    marginStart: getMScale(16),
    maxWidth: '70%',
  },
  bottomArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    // rowGap: 10,
    columnGap: getMScale(10),
    alignItems: 'center',
    marginStart: getMScale(114),
    marginEnd: getMScale(16),
    marginTop: getMScale(16),
  },
  addToFavWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  imageContainer: {
    justifyContent: 'center',
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  counterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.primaryYellow,
    position: 'absolute',
    bottom: 4,
    left: 16,
  },
  topCircle: {
    position: 'absolute',
    top: 0,
    left: 16,
  },
  bottomCircle: {
    marginTop: 30,
    marginStart: 45,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});

export default React.memo(OrderItem);
