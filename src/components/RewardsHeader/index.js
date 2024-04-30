import React, {useRef} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageBackground, StyleSheet, View} from 'react-native';

import {colors} from '../../theme';
import {goBack} from '../../utils/navigationUtils';
import RText from '../RText';
import CircularIcon from '../CircularIcon/CircularIcon';
import BackImage from '../../assets/svgs/BackImage';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import RefreshIcon from '../../assets/svgs/RefreshIcon';
import {useNavigation} from '@react-navigation/native';
import {images} from '../../assets';
import AccessibilityWrapper from "../AccessibilityWrapper/AccessibilityWrapper";

const MenuScreenHeader = ({
  route,
  screenTitle,
  showDivider,
  containerStyle,
  onRefresh,
}) => {
  const {title = '', comingFrom} = route.params || {};
  const {top} = useSafeAreaInsets();
  const renderGreyHorizontalLine = () => <View style={styles.greyHorizontalLineStyle} />;
  const navigation = useNavigation();
  const handleBackButtonPress = () => {
    if (comingFrom === 'RewardsOnBoarding') {
      return navigation?.popToTop?.();
    } else {
      return goBack();
    }
  };

  const backButtonRef = useRef();
  const titleRef = useRef();
  const historyButtonRef = useRef();

  return (
    <ImageBackground source={images.rewardsBg} style={styles.backgroundParent}>
      <AccessibilityWrapper fieldsRefs={[backButtonRef, titleRef, historyButtonRef]}>
        <View
            style={[
              styles.header,
              {paddingTop: top - getMScale(15)},
              !showDivider && styles.shadowStyle,
              containerStyle,
            ]}>
          <View style={styles.headerStyle}>
            <CircularIcon
                ref={backButtonRef}
                type={'svg'}
                onPress={handleBackButtonPress}
                SVGComponent={() => <BackImage />}
                style={{backgroundColor: colors.white}}
                withShadow={true}
                accessible
                accessibilityLabel={'Back button'}
                accessibilityHint={'activate to go to previous screen'}
            />
              <RText
                  ref={titleRef}
                  accessible
                  accessibilityLabel={title || screenTitle}
                  text={title || screenTitle}
                  accessibilityRole={'header'}
                  weight={'bold'}
                  size={'lg'}
                  color={colors.primary}
                  textStyle={{
                    marginStart: getMScale(13),
                    marginTop: getMScale(5),
                  }}
              />
            <CircularIcon
                ref={historyButtonRef}
                style={{backgroundColor: colors.white}}
                type={'svg'}
                onPress={onRefresh}
                SVGComponent={() => <RefreshIcon />}
                accessible
                accessibilityLabel={'Rewards History'}
                accessibilityHint={'activate to go to rewards history screen'}
            />
          </View>
        </View>
      </AccessibilityWrapper>
      {showDivider ? renderGreyHorizontalLine() : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    backgroundColor: colors.transparent,
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
    backgroundColor: colors.transparent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: getMScale(16),
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
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
  backgroundParent: {
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    // flex: 1,
    // flexGrow: 1,
    resizeMode: 'stretch',
  },
});
export default MenuScreenHeader;
