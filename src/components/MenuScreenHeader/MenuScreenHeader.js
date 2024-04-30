import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';

import {colors} from '../../theme';
import {goBack, navigationRef} from '../../utils/navigationUtils';
import RText from '../RText';
import CircularIcon from '../CircularIcon/CircularIcon';
import CartIcon from '../../assets/svgs/CartIcon';
import BackImage from '../../assets/svgs/BackImage';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {strings} from '../../constants';

const MenuScreenHeader = ({
  route,
  screenTitle,
  orderNumber,
  showCartIcon,
  showDivider,
  containerStyle,
    hideFromAccessibility = false,
}) => {
  const {title = '', description = '', onBackPress, loading} = route.params || {};
  const {top} = useSafeAreaInsets();
  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;
  const {cartCount = 0} = useBasketSelector();
  const handleBackButtonPress = () => {
    if (typeof onBackPress === 'function') {
      return onBackPress?.();
    }
    logFirebaseCustomEvent(strings.click, {
      click_label: 'backIcon',
      click_destination: navigationRef.current?.getCurrentRoute?.()?.name,
    });
    return goBack();
  };
  return (
    <>
      {/*{showOverlay ? <View style={styles.overlay} /> : null}*/}
      <View
        style={[
          styles.header,
          {paddingTop: top},
          !showDivider && styles.shadowStyle,
          containerStyle,
        ]}>
        <View style={styles.headerStyle}>
          <View
            style={[
              styles.parentWrapper,
              description || (orderNumber && {alignItems: 'flex-start'}),
            ]}>
            <CircularIcon
              type={'svg'}
              onPress={handleBackButtonPress}
              accessibilityElementsHidden={hideFromAccessibility}
              SVGComponent={() => <BackImage />}
              style={{backgroundColor: colors.white, marginStart: 10}}
              withShadow={false}
              accessibilityLabel={'Back'}
              accessibilityHint={'activate to go to previous screen'}
            />
            <View accessible accessibilityRole={'header'} accessibilityElementsHidden={hideFromAccessibility}>
              <RText
                accessibilityLabel={title || screenTitle}
                text={title || screenTitle}
                weight={'bold'}
                size={'lg'}
                color={colors.primary}
                allowFontScaling={false}
                numberOfLines={2}
                textStyle={{
                  maxWidth: '82%',
                  minWidth: '70%',
                  marginStart: getMScale(13),
                  marginTop: description || orderNumber ? getMScale(8) : getMScale(5),
                }}
              />
              {description ? (
                <RText
                  text={description}
                  accessibilityElementsHidden={hideFromAccessibility}
                  color={colors.primary}
                  textStyle={{marginStart: getMScale(13), marginTop: getMScale(5)}}
                />
              ) : null}
            </View>
          </View>
          {showCartIcon ? (
            <CircularIcon
                accessibilityElementsHidden={hideFromAccessibility}
                accessibilityLabel={'Shopping Bag'}
                accessibilityHint={'activate to open Shopping bag Screen'}
              type={'svg'}
              SVGComponent={CartIcon}
              countIndicator={cartCount}
            />
          ) : null}
        </View>
      </View>
      {showDivider ? renderGreyHorizontalLine() : null}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    backgroundColor: colors.white,
    height: getMScale(110),
  },
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
  },
  headerStyle: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingEnd: getMScale(16),
    alignItems: 'center',
  },
  parentWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backIconView: {marginStart: 20, height: 7},
  backIcon: {width: 20, height: 20},
  titleView: {
    width: '80%',
    paddingStart: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: getVerticalScale(5),
  },
  description: {textDecorationLine: 'underline'},
  cartIconView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    shadowColor: colors.black,
  },
  cartIcon: {width: 25, height: 25},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.primary_23,
    width: '90%',
    alignSelf: 'center',
    // marginVertical: getMScale(16),
    // marginHorizontal: getMScale(16),
  },
});
export default MenuScreenHeader;
