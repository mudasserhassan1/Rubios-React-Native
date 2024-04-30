import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import RText from '../../components/RText';
import {colors} from '../../theme';
import SeeMoreDropDown from '../../assets/svgs/SeeMoreDropDown';
import ShowLessIcon from '../../assets/svgs/ShowLessIcon';
import DeleteIcon from '../../assets/svgs/DeleteIcon';
import AddIcon from '../../assets/svgs/AddIcon';
import Collapsible from 'react-native-collapsible';
import {debounce} from 'lodash';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {useDispatch} from 'react-redux';
import {removeProductRequest} from '../../redux/actions/basket/product/remove';
import {updateProductRequest} from '../../redux/actions/basket/product/update';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';
import useCategoriesSelector from '../../hooks/reduxStateHooks/useCategoriesSelector';

const ACTIONS = {
  INCREMENT: '+',
  DECREMENT: '-',
};
const CartItem = ({
  title,
  customization,
  price,
  item,
  quantity: actualQuantity,
  containerStyle,
  hideQuantityView,
  onEditPressed,
  isUpsellItem,
}) => {
  const [collapse, setCollapsed] = useState(true);
  const [quantity, setQuantity] = useState(parseInt(actualQuantity || 0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuantity(parseInt(actualQuantity || 0));
  }, [actualQuantity]);

  const {basket} = useBasketSelector();

  const itemRefToInitialState = useRef(null);

  const {productImages} = useCategoriesSelector();

  useEffect(() => {
    itemRefToInitialState.current = {...item};
  }, [item]);

  const dispatch = useDispatch();

  const toggleExpanded = () => {
    setCollapsed(!collapse);
  };

  const handleLogEvents = (bagProduct, latestQty, action) => {
    const adsOnPrice = bagProduct?.choices?.reduce((prev, curr) => prev + curr?.cost, 0) || 0;
    const updatedQty = Math.abs(parseInt(bagProduct.quantity, 10) - parseInt(latestQty, 10));
    const itemDetail = {
      currency: 'USD',
      value: (item?.basecost + adsOnPrice) * updatedQty,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item?.basecost + adsOnPrice,
          quantity: updatedQty,
        },
      ],
    };
    if (action === ACTIONS.INCREMENT) {
      const isCustomized = item.choices.map(c => c.name.toLowerCase()).includes('customize');
      logFirebaseCustomEvent(strings.add_to_cart_log_event, {
        ...itemDetail,
        is_custom: isCustomized,
      });
    } else {
      logFirebaseCustomEvent(strings.remove_from_cart, itemDetail);
    }
  };

  const successCallback = params => {
    const {item, qty, action, basketResponse} = params ?? {};
    const itemInBasket = basketResponse?.products.filter(bp => item.productId === bp.productId)[0];
    const {quantity: quantityInBasket} = itemInBasket ?? {};
    if (quantity !== quantityInBasket) {
      setQuantity(quantity);
    }
    setLoading(false);
    // dispatch(getBasketRequest(basketResponse.id))
    handleLogEvents(item, qty, action);
  };

  const errorCallback = () => {
    setLoading(false);
    setQuantity(item.quantity);
  };

  const handleQuantityChange = action => {
    let tempQuantity = quantity;
    if (action === ACTIONS.DECREMENT) {
      if (tempQuantity === 0) {
        return;
      }
      tempQuantity--;
    } else {
      tempQuantity++;
    }
    if (tempQuantity > 0) {
      setQuantity(tempQuantity);
    }
    debounceQuantityChange(tempQuantity, action);
  };

  const callback = (basket, item, qty) => {
    setLoading(false);
    handleLogEvents(item, qty, ACTIONS.DECREMENT);
  };

  const updateQuantity = (qty, action) => {
    if (qty === 0) {
      Alert.alert('Remove Item', 'Do you want to remove this item from your Bag?', [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            if (actualQuantity !== '1') {
              updateQuantity(1);
            }
          },
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            dispatch(
              removeProductRequest(basket?.id, itemRefToInitialState.current, basket =>
                callback(basket, item, qty),
              ),
            );
          },
        },
      ]);
    } else {
      setLoading(true);
      if (item) {
        const request = {};
        request.productid = item.productId;
        request.quantity = qty;
        let options = '';
        item.choices.map(it => {
          options = options + it.optionid + ',';
        });
        request.options = options;
        dispatch(
          updateProductRequest(
            basket?.id,
            itemRefToInitialState.current,
            request,
            basketResponse => successCallback({item, qty, action, basketResponse}),
            errorCallback,
          ),
        );
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceQuantityChange = useCallback(debounce(updateQuantity, 700), [item]);

  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;
  const renderCollapseableView = () => {
    return (
      <Collapsible collapsed={collapse} align="center">
        <View style={styles.collapseableView}>
          <RText
            size={'xxs'}
            color={colors.primary}
            weight={'regular'}
            numberOfLines={10}
            textStyle={styles.collapseableText}
            text={customization}
          />
        </View>
      </Collapsible>
    );
  };

  const image = productImages?.[item?.productId] || '';

  const renderSeeMoreView = () => {
    if (customization) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View>
            <RText
              accessibilityLabel={collapse ? 'See More' : 'See Less'}
              accessibilityHint={
                collapse ? 'activate to see more options' : 'activate to show less options.'
              }
              text={collapse ? 'See More' : 'See Less'}
              color={colors.primary}
              size={'xxs'}
              textStyle={styles.subTitleText}
              onPress={toggleExpanded}
            />
          </View>
          <View style={styles.seeMoreStyle}>
            <TouchableOpacity
              accessible={false}
              onPress={toggleExpanded}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              {collapse ? <SeeMoreDropDown /> : <ShowLessIcon />}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const iosActions = [
    {
      name: 'activate',
      label: '',
    },
    {
      name: 'increment',
      label: 'increase quantity',
    },
    {
      name: 'decrement',
      label: 'decrease quantity',
    },
    {
      name: 'edit',
      label: 'edit item',
    },
  ];

  const accessibilityActions = Platform.select({
    ios: iosActions,
    android: [],
  });

  const accessibilityValue = useMemo(() => {
    const split = String(item.totalcost)?.split('.');
    return `${split[0]} dollars, ${split[1]} cents`;
  }, [item]);

  return (
    <View
      accessible
      accessibilityLabel={`${title}, ${!collapse ? customization : ''}`}
      accessibilityHint={'activate to toggle customizations, swipe up or down for more actions'}
      accessibilityActions={accessibilityActions}
      accessibilityValue={{text: accessibilityValue}}
      onAccessibilityAction={event => {
        switch (event.nativeEvent.actionName) {
          case 'activate':
            toggleExpanded();
            break;
          case 'increment':
            handleQuantityChange(ACTIONS.INCREMENT);
            break;
          case 'decrement':
            handleQuantityChange(ACTIONS.DECREMENT);
            break;
          case 'edit':
            onEditPressed();
            break;
        }
      }}
      style={[styles.parentStyle, containerStyle]}>
      <View style={styles.container}>
        <ImageComponent
          resizeMode={image ? 'cover' : 'contain'}
          source={image ? {uri: image} : require('../../assets/images/default_item_image.png')}
          style={styles.imageStyle}
        />
        <View style={{marginStart: getMScale(25)}}>
          <RText
            text={title}
            weight={'semiBold'}
            size={'xs'}
            color={colors.primary}
            ellipsizeMode={'tail'}
            numberOfLines={2}
            textStyle={styles.titleText}>
            {' '}
          </RText>
          {renderSeeMoreView()}
          {renderCollapseableView()}
        </View>
      </View>

      <View style={[styles.quantityView, {alignSelf: hideQuantityView && 'flex-end'}]}>
        {!hideQuantityView ? (
          <View style={styles.quantityInnerView}>
            <View style={styles.emptyView} />
            <View style={{marginStart: getMScale(25)}}>
              <Pressable
                accessible
                accessibilityLabel={quantity === 1 ? 'delete' : 'minus'}
                accessibilityRole={'button'}
                accessibilityHint={
                  quantity === 1
                    ? 'activate to remove this item from cart'
                    : 'activate to decrease item quantity from cart'
                }
                hitSlop={15}
                disabled={loading}
                onPress={() => handleQuantityChange(ACTIONS.DECREMENT)}>
                {quantity === 1 ? (
                  <DeleteIcon />
                ) : (
                  <RText text={'–'} size={'lg'} weight={'bold'} color={colors.palette.primary_50} />
                )}
              </Pressable>
            </View>
            <View style={styles.line} />
            <View
              style={{minWidth: 25, maxWidth: 40, alignItems: 'center', justifyContent: 'center'}}>
              {loading ? (
                <ActivityIndicator
                  style={{width: '100%'}}
                  size={'small'}
                  color={colors.secondary}
                />
              ) : (
                <RText
                  text={quantity}
                  accessibilityHint={'quantity'}
                  weight={'semiBold'}
                  size={'md'}
                  color={colors.primary}
                  textStyle={styles.titleText}>
                  {' '}
                </RText>
              )}
            </View>
            <View style={styles.line} />
            <Pressable
              accessible
              accessibilityRole={'button'}
              accessibilityLabel={'add'}
              accessibilityHint={'activate to increase item quantity'}
              disabled={loading}
              hitSlop={15}
              onPress={() => handleQuantityChange(ACTIONS.INCREMENT)}>
              <AddIcon />
            </Pressable>
          </View>
        ) : null}
        {!hideQuantityView && !isUpsellItem ? (
          <TouchableOpacity
            accessible
            accessibilityRole={'button'}
            accessibilityHint={'activate to edit this item in cart'}
            onPress={onEditPressed}>
            <RText
              text={'Edit'}
              color={colors.secondary}
              size={'xxs'}
              weight={'semiBold'}
              textStyle={{textDecorationLine: 'underline'}}
            />
          </TouchableOpacity>
        ) : null}
        <RText
          accessible={false}
          text={`${price}`}
          weight={'semiBold'}
          size={'xs'}
          color={colors.primary}
          textStyle={styles.titleText}
        />
      </View>
      {renderGreyHorizontalLine()}
    </View>
  );
};
const styles = StyleSheet.create({
  parentStyle: {
    flex: 1,
    justifyContent: 'center',
    marginTop: getVerticalScale(16),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: colors.primary,
    marginTop: getMScale(5),
    lineHeight: 18,
    letterSpacing: 0.15,
    maxWidth: getMScale(250),
  },
  textStyle: {
    fontSize: 20,
    color: colors.black,
  },
  subTitleText: {
    marginTop: getVerticalScale(8),
  },
  imageStyle: {width: getMScale(75), height: getMScale(75), borderRadius: 16},
  emptyView: {width: 75},
  line: {
    height: 12,
    width: 1,
    backgroundColor: colors.dividerLine,
    marginHorizontal: getMScale(15),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(10),
  },
  collapseableView: {
    marginTop: getMScale(12),
    width: '90%',
  },
  collapseableText: {
    lineHeight: getVerticalScale(16),
    letterSpacing: 0.15,
    height: getMScale(110),
  },
  seeMoreStyle: {
    marginStart: getMScale(15),
    marginTop: getVerticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  quantityView: {
    marginTop: getVerticalScale(8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default CartItem;
