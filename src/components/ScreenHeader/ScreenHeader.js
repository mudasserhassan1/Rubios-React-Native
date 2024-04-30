import {Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';
import BackImage from '../../assets/svgs/BackImage';
import {constants} from '../../constants';
import ImageComponent from '../ImageComponent/ImageComponent';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CircularIcon from '../CircularIcon/CircularIcon';
import CartIcon from '../../assets/svgs/CartIcon';
import React from 'react';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {images} from '../../assets';
import {isAndroid} from '../../utils/sharedUtils';
import {parseInt} from 'lodash';

const totalSignupSteps = 4;

const ScreenHeader = ({
  title,
  onBackPress,
  titleStyle,
  activeStep,
  containerStyle,
  underlined = true,
  isLoading,
  withBackIcon = true,
  showCartButton,
}) => {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const {cartCount} = useBasketSelector();

  const handleBackPress = () => {
    if (typeof onBackPress === 'function') {
      return onBackPress?.();
    }
    return navigation.goBack();
  };
  return (
    <View
      style={[
        styles.parent,
        {
          ...Platform.select({
            ios: {
              paddingTop: top,
            },
            android: {
              paddingTop: top + getVerticalScale(20),
            },
          }),
        },
      ]}>
      {isLoading ? <View style={styles.overlay} /> : null}
      <View style={[{alignItems: 'flex-start'}, containerStyle]}>
        <View style={styles.headerParent}>
          {withBackIcon ? (
            <CircularIcon
              type={'svg'}
              SVGComponent={BackImage}
              withShadow={false}
              style={styles.backIcon}
              onPress={handleBackPress}
              accessibilityLabel={'Go Back'}
              accessibilityHint={'activate to go to previous screen'}
            />
          ) : null}
          {showCartButton ? (
            <CircularIcon
              type={'svg'}
              SVGComponent={CartIcon}
              countIndicator={cartCount}
              accessibilityLabel={'Shopping Bag'}
              accessibilityHint={'activate to open Shopping bag Screen'}
            />
          ) : null}
        </View>

        <View style={styles.signupStepsAndTitleView}>
          <RText
            accessible
            accessibilityRole={'header'}
            text={title}
            allowFontScaling={false}
            preset={'header'}
            color={colors.primary}
            textStyle={[styles.headerTitle, titleStyle]}
          />
          {activeStep ? (
            <ImageComponent
              accessibilityLabel={'Sign up Step' + (parseInt(activeStep, 10) + 1)}
              source={
                activeStep === '0'
                  ? require('./step1.png')
                  : activeStep === '1'
                  ? require('./step2.png')
                  : require('./step3.png')
              }
              style={{width: getMScale(36), height: getMScale(36)}}
            />
          ) : null}
        </View>
      </View>
      {underlined ? (
        <View style={styles.bottomLineView}>
          <ImageComponent
            accessible={false}
            source={images.waveLine}
            resizeMode={'stretch'}
            style={{
              width: getMScale(420),
              height: getMScale(15),
              marginBottom: getMScale(isAndroid ? 10 : 0),
            }}
          />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  parent: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight,
    ...Platform.select({
      ios: {
        height: constants.IOS_HEADER_HEIGHT,
      },
      android: {
        height: constants.ANDROID_HEADER_HEIGHT,
      },
    }),
  },
  backIcon: {backgroundColor: colors.white, marginStart: getMScale(10)},
  signupStepsAndTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getVerticalScale(3),
    width: '90%',
    alignSelf: 'center',
  },
  headerTitle: {
    textTransform: 'uppercase',
  },
  bottomLine: {
    backgroundColor: colors.lightGray,
    width: '100%',
    height: 1,
  },
  signupStepsParent: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  backgroundLine: {
    height: 2,
    backgroundColor: '#BBBBBB',
    position: 'absolute',
    zIndex: 1,
    bottom: 5,
  },
  dotsParent: {
    flexDirection: 'row',
    width: `${100 / totalSignupSteps}%`,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#BBBBBB',
    zIndex: 1,
    bottom: 3,
    alignSelf: 'center',
  },
  counterText: {position: 'absolute', alignSelf: 'center', top: 10},
  bottomLineView: {marginVertical: getVerticalScale(9), alignSelf: 'center'},
  headerParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    width: '95%',
    alignContent: 'center',
  },
});

export default ScreenHeader;
