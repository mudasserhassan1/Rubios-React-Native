import React, {useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {colors} from '../../theme';
import RText from '../../components/RText';
import styles from './styles';
import useRestaurantInfoSelector from '../../hooks/reduxStateHooks/useRestaurantInfoSelector';
import {constants, screens, strings} from '../../constants';
import PickupTypeIcon from '../../assets/svgs/PickupTypeIcon';
import DeliveryIConSmall from '../../assets/svgs/DeliveryIConSmall';
import {moveToPreviousScreenWithMerge} from '../../utils/navigationUtils';
import {useSelector} from 'react-redux';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

const OrderTypeAndLocationInfo = ({
  containerStyle,
  CustomImage,
  orderTypeOnly,
  customTitle = '',
  titleFontSize,
  titleWeight,
  subTitleSize,
}) => {
  const handleChangePress = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'Change',
      click_destination: screens.CHOOSE_ORDER_TYPE,
    });
    moveToPreviousScreenWithMerge(screens.CHOOSE_ORDER_TYPE, {
      changingOrderType: true,
      fromScreen: screens.MENU_CATEGORIES,
    });
  };
  const {orderType, restaurant} = useRestaurantInfoSelector();
  const {address = {}} = useSelector(state => state.deliveryAddress);
  const {address1 = '', address2: apt = '', city: deliveryCity} = address || {};
  const {streetaddress, city} = restaurant || {};

  const {Image = View, title = ''} = useMemo(() => {
    if (orderType) {
      if (orderType === constants.handOffMode.PICKUP) {
        return {
          Image: PickupTypeIcon,
          title: 'Pick Up In Store',
        };
      }
      if (orderType === constants.handOffMode.DISPATCH) {
        return {
          Image: DeliveryIConSmall,
          title: 'Delivered To',
        };
      }
    } else {
      return {
        Image: PickupTypeIcon,
        title: 'Pick Up In Store',
      };
    }
  }, [orderType]);

  const getAddressSubtitle = () => {
    // if (subTitle) {
    //   return subTitle;
    // }
    if (orderType === constants.handOffMode.DISPATCH) {
      return address1 + ', ' + `${apt ? `${apt}, ` : ''}` + deliveryCity;
    }
    return streetaddress + ', ' + city;
  };
  return (
    <View
        accessible
        accessibilityLabel={`${title}, ${getAddressSubtitle()}`}
        accessibilityHint={
          orderType === constants.handOffMode.PICKUP
              ? 'activate to change Pickup address'
              : 'double tap to change delivery address'
        }
        onAccessibilityTap={handleChangePress}
        style={[styles.container, containerStyle]}>
      <View style={{width: '15%'}}>{CustomImage ? <CustomImage /> : <Image />}</View>
      <View style={{width: '65%', marginStart: 10}}>
        <RText
          text={customTitle || title}
          weight={titleWeight || 'semiBold'}
          size={titleFontSize || 'xs'}
          color={colors.primary}
          textStyle={styles.titleText}>
          {' '}
        </RText>
        {!orderTypeOnly ? (
          <RText
            text={getAddressSubtitle()}
            color={colors.primary}
            size={subTitleSize || 'xxs'}
            numberOfLines={1}
            ellipsizeMode={'tail'}
            textStyle={styles.subTitleText}
          />
        ) : null}
      </View>

      <View style={styles.line} />
      <TouchableOpacity
        style={{width: '22%'}}
        onPress={handleChangePress}>
        <View hitSlop={{top: 20, bottom: 20, left: 10, right: 10}}>
          <RText
            text={'Change'}
            size={'xxs'}
            weight={'semiBold'}
            color={colors.primaryLink}
            textStyle={styles.rightText}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderTypeAndLocationInfo;
