import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
import ChevronForward from '../../assets/svgs/ChevronForward';
import {colors} from '../../theme';
import RewardStar from '../../assets/svgs/RewardStar';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import useRewards from '../../hooks/useRewards';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {strings} from '../../constants';
import {getMScale} from '../../theme/metrics';
import TacoIcon from '../../assets/svgs/TacoIcon';
import CircularArrowIcon from '../../assets/svgs/CircularArrowIcon';
import RewardsItemPlaceholder from './Placeholder';
import useModalSheetStatusSelector from '../../hooks/reduxStateHooks/useModalSheetStatusSelector';

const DOTS_ARRAY_LENGTH = 4;

const RewardsInfo = ({containerStyle, withGuestContent, loading, accessible}) => {
  const {
    first_name,
    rewardPoints = 0,
    navigateToRewards,
    isGuest,
    navigateToSignup,
    isLoadingRewards,
  } = useRewards({isCheckout: false, pointsOnly: true});
  const parentProgressWidth = useRef(); //Ref holds the total width of progress bar
  const widthValue = useSharedValue(0);
  const {isAccessibilityEnabledOnHomeScreen = false} = useModalSheetStatusSelector() || {};

  const activeWidth = useMemo(() => {
    // let p = parentProgressWidth.current / (1300 / rewardPoints)
    let factor = 0;
    if (rewardPoints > 0) {
      if (rewardPoints < 400) {
        factor = 3.5;
      } else if (rewardPoints <= 500) {
        factor = 3;
      } else if (rewardPoints <= 800) {
        factor = 1.5;
      } else if (rewardPoints < 1300) {
        factor = 1.2;
      } else if (rewardPoints >= 1300) {
        factor = 1;
      }
      return parentProgressWidth.current / factor;
    } else {
      return 1;
    }
  }, [rewardPoints]);

  useEffect(() => {
    widthValue.value = activeWidth;
  }, [activeWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(activeWidth, {
        duration: 1000, // Animation duration in milliseconds
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Easing function (cubic-bezier)
      }),
    };
  }, [activeWidth]);

  const getDotsBackgroundColor = useCallback(
    index => {
      if (activeWidth < 100 * index + 5) {
        return '#82959E';
      }
      return colors.primary;
    },
    [activeWidth],
  );

  const pointsFormatting = useMemo(() => {
    if (parseInt(rewardPoints, 10) > 9999) {
      const digit = parseFloat(rewardPoints / 1000, 10).toFixed(1);
      return `${digit}K`;
    }
    return rewardPoints;
  }, [rewardPoints]);

  const accessibilityLabel = useMemo(() => {
    if (isGuest) {
      return 'Sign up to get free tacos!';
    }
    return strings.my_rewards;
  }, [isGuest]);

  const accessibilityValue = useMemo(() => {
    if (isGuest) {
      return '';
    }
    return `${rewardPoints} Points`;
  }, [isGuest, rewardPoints]);

  const accessibilityHint = useMemo(() => {
    if (isGuest) {
      return 'activate to go to sign up screen';
    }
    return 'activate to access rewards';
  }, [isGuest]);

  const renderGuestContent = () => {
    return (
      <View accessible={false} styles={styles.guestContentParent}>
        <View style={styles.tacoIconParent}>
          <View style={styles.yellowCircle} />
          <View style={styles.tacoIcon}>
            <TacoIcon />
          </View>
        </View>
        <View style={styles.guestCardRightSideView}>
          <RText
            accessible={isAccessibilityEnabledOnHomeScreen}
            text={'Sign Up to get Free Tacos!'}
            color={colors.secondary}
            numberOfLines={2}
            size={'xxs'}
            textStyle={styles.freeTacosText}
            weight={'headerBold'}
          />
          <View accessibilityHint={'activate to go to sign up screen'}>
            <TouchableOpacity
              accessible={isAccessibilityEnabledOnHomeScreen}
              accessibilityHint={'activate to go to sign up screen'}
              onPress={navigateToSignup}
              activeOpacity={0.7}
              style={styles.getStartedView}>
              <RText
                accessible={isAccessibilityEnabledOnHomeScreen}
                text={'Get Started'}
                size={'xs'}
                textStyle={styles.getStartedText}
              />
              <CircularArrowIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderLoggedInUserContent = () => {
    return (
      <View accessible={false}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={navigateToRewards}
          style={styles.rewardsTitleView}>
          <RText text={strings.my_rewards} weight={'semiBold'} textStyle={styles.myRewardsText} />
          <ChevronForward />
        </TouchableOpacity>

        <View style={styles.pointsInfoContainer}>
          <View style={styles.pointsView}>
            {isLoadingRewards && pointsFormatting === 0 ? (
              <RewardsItemPlaceholder />
            ) : (
              <View style={styles.points}>
                <RText text={String(pointsFormatting)} weight={'semiBold'} color={colors.teal} />
              </View>
            )}
            <RText
              text={strings.points_balance}
              weight={'semiBold'}
              size={'xxs'}
              textStyle={{marginStart: 5, maxWidth: 90}}
            />
          </View>
          {loading && !first_name ? null : (
            <View style={styles.enthusiasmMessageView}>
              <RText
                text={'Keep Eating,\n Keep Earning.'}
                color={'#82959E'}
                size={'xxs'}
                // allowFontScaling={false}
                numberOfLines={2}
                weight={'semiBold'}
                ellipsizeMode={'tail'}
                textStyle={styles.enthusiasmMessage}
              />
            </View>
          )}
        </View>

        <Animated.View
          accessible={false}
          accessibilityElementsHidden
          // accessibilityLabel={`Points progress bar, Progress bar is at ${pointsFormatting}`}
          onLayout={event => (parentProgressWidth.current = event.nativeEvent.layout.width)}
          style={styles.rewardsProgressContainer}>
          <View style={styles.dotsContainer}>
            {Array.from({length: DOTS_ARRAY_LENGTH}, (v, i) => i).map((item, index) => {
              return (
                <View
                  key={String(index)}
                  style={{
                    width: item === 0 || item === DOTS_ARRAY_LENGTH - 1 ? 5 : 8,
                    height: item === 0 || item === DOTS_ARRAY_LENGTH - 1 ? 5 : 8,
                    borderRadius: 8,
                    backgroundColor: getDotsBackgroundColor(item),
                    alignSelf: 'center',
                  }}
                />
              );
            })}
          </View>
          <Animated.View style={[styles.activeLineAndStarContainer, animatedStyle]}>
            <View style={[styles.star, activeWidth === 0 && {top: -15}]}>
              <RewardStar />
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  };
  return (
    <View
      accessible={accessible}
      accessibilityRole={'header'}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{text: accessibilityValue}}
      accessibilityHint={accessibilityHint}
      onAccessibilityTap={isGuest && withGuestContent ? navigateToSignup : navigateToRewards}
      style={[styles.rewardsParentView, containerStyle]}>
      {isGuest && withGuestContent ? (
        <>{renderGuestContent()}</>
      ) : (
        <>{renderLoggedInUserContent()}</>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rewardsParentView: {
    height: 130,
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 4.62,
    elevation: 4,
  },
  rewardsTitleView: {flexDirection: 'row', marginTop: 5, alignItems: 'center'},
  myRewardsText: {marginEnd: 5},
  pointsInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  pointsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  points: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 65,
    minHeight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  rewardsProgressContainer: {
    width: '95%',
    alignSelf: 'center',
    height: 4,
    backgroundColor: '#82959E',
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
  },
  activeLineAndStarContainer: {
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    position: 'absolute',
    borderRadius: 5,
  },
  star: {end: -15, zIndex: 22, top: -1},
  enthusiasmMessageView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  enthusiasmMessage: {textAlign: 'right', width: getMScale(130)},
  guestContentParent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tacoIconParent: {marginStart: 10, width: '50%'},
  yellowCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
    backgroundColor: colors.primaryYellow,
  },
  tacoIcon: {position: 'absolute', top: 15, start: 22},
  guestCardRightSideView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    alignItems: 'center',
    top: 15,
    end: 15,
  },
  freeTacosText: {textTransform: 'uppercase', width: 130, lineHeight: 18},
  getStartedView: {flexDirection: 'row', marginTop: 20, width: 130},
  getStartedText: {textDecorationLine: 'underline', marginEnd: 10},
});
export default React.memo(RewardsInfo);
