import * as React from 'react';
import {StyleSheet, Animated, Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {goBack} from '../../utils/navigationUtils';
import {colors} from '../../theme';
import BackImage from '../../assets/svgs/BackImage';
import CircularIcon from '../../components/CircularIcon/CircularIcon';
import CartIcon from '../../assets/svgs/CartIcon';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import RText from '../../components/RText';
import {forwardRef, useRef, useState} from 'react';
import {isIos} from '../../utils/sharedUtils';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {screens, strings} from '../../constants';
import AccessibilityWrapper from "../../components/AccessibilityWrapper/AccessibilityWrapper";

const DynamicHeader = ({animHeaderValue, title = ''}) => {
  const [headerHeight, setHeaderHeight] = useState();
  const {top} = useSafeAreaInsets();
  const Header_Max_Height = 385;
  const Header_Min_Height = isIos ? top + 55 : top + 65;

  const backIconRef = useRef();
  const titleRef = useRef();
  const cartIconRef = useRef();

  const {cartCount} = useBasketSelector();

  const animateHeaderHeight = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp',
  });

  const isWhiteHeader = headerHeight === Header_Min_Height;

  const goToBackScreen = () => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'backIcon',
      click_destination: screens.MENU,
    });
    goBack();
  };
  return (
        <Animated.View
              onLayout={e => setHeaderHeight(parseInt(e.nativeEvent.layout.height, 10))}
              style={[
                styles.header,
                {
                  ...Platform.select({
                    ios: {
                      paddingTop: top,
                    },
                    android: {
                      paddingTop: top + 10,
                      elevation: isWhiteHeader ? 3 : 0,
                    },
                  }),
                  height: animateHeaderHeight,
                  backgroundColor: isWhiteHeader ? colors.white : 'transparent',
                  paddingBottom: 10,
                },
                isWhiteHeader && styles.headerShadow,
              ]}>
            <>
              <CircularIcon
                  ref={backIconRef}
                  type={'svg'}
                  onPress={goToBackScreen}
                  withShadow={false}
                  SVGComponent={() => <BackImage />}
                  style={{backgroundColor: colors.white}}
                  accessible={true}
                  accessibilityLabel={'Back Icon'}
                  accessibilityHint={'activate to go to previous screen'}
              />
              {headerHeight === Header_Min_Height ? (
                  <View
                      style={{
                        width: '70%',
                        height: 40,
                        marginTop: 3,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                    <RText
                        ref={titleRef}
                        accessible={headerHeight === Header_Min_Height}
                        accessibilityLabel={title}
                        accessibilityRole={'header'}
                        text={title}
                        numberOfLines={1}
                        weight={'headerBold'}
                        allowFontScaling={false}
                        textStyle={{textTransform: 'uppercase'}}
                    />
                  </View>
              ) : null}
              <CircularIcon
                  ref={cartIconRef}
                  type={'svg'}
                  SVGComponent={() => <CartIcon />}
                  withShadow={false}
                  countIndicator={cartCount}
              />
            </>
          </Animated.View>
  );
};
export default DynamicHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    left: 0,
    right: 0,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  headerShadow: {
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2.0,
    shadowColor: colors.black,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.0,
    shadowColor: colors.black,
  },
  icon: {width: 20, height: 20},
});
