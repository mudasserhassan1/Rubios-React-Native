import {StyleSheet, TouchableOpacity, View} from 'react-native';
import RText from '../RText';
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
import RewardsGiftIcon from '../../assets/svgs/RewardsGiftIcon';
import {logToConsole} from '../../configs';

const DOTS_ARRAY_LENGTH = 4;

const RewardsInfo = ({containerStyle}) => {
  const {first_name, rewardPoints = 0, isLoadingRewards = false} = useRewards({pointsOnly: true});

  const parentProgressWidth = useRef(); //Ref holds the total width of progress bar
  const widthValue = useSharedValue(0);

  const activeWidth = useMemo(() => {
    // let p = parentProgressWidth.current / (1300 / rewardPoints)
    logToConsole({rewardPoints});
    let factor = 0;
    if (rewardPoints > 0 && !isLoadingRewards) {
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
  }, [rewardPoints, isLoadingRewards]);

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

  const getAccessibilityLabel = () => {
    return `${strings.you_have_got}${String(pointsFormatting) + ' Points'}, Keep up with free tacos , ${first_name}!`
  }
  const renderLoggedInUserContent = () => {
    return (
      <View>
        <RText text={strings.you_have_got} weight={'semiBold'} textStyle={styles.myRewardsText} />
        <View style={styles.pointsInfoContainer}>
          <View style={styles.pointsView}>
            <View style={styles.points}>
              <RText
                text={String(pointsFormatting) + ' Points'}
                weight={'semiBold'}
                color={colors.teal}
              />
            </View>
          </View>

          <View style={styles.enthusiasmMessageView}>
            <RText
              accessible={false}
              text={`Keep up with free tacos , ${first_name}!`}
              color={'#82959E'}
              size={'xxs'}
              numberOfLines={2}
              weight={'semiBold'}
              ellipsizeMode={'tail'}
              textStyle={styles.enthusiasmMessage}
            />
          </View>
        </View>
        <Animated.View
          accessible={false}
          accessibilityLabel={`Points progress bar, Progress bar is at ${pointsFormatting}`}
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
          {/*<Animated.View style={[styles.activeLineAndStarContainer, animatedStyle]}>*/}
          <Animated.View
            style={[
              styles.activeLineAndStarContainer,
              animatedStyle,
              activeWidth === 0 && {top: -15},
            ]}>
            <View style={[styles.star]}>
              <RewardStar />
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    );
  };
  return (
    <View  accessible accessibilityLabel={getAccessibilityLabel()} style={[styles.rewardsParentView, containerStyle]}>
      {/*{isLoadingRewards ? <Placeholder /> : renderLoggedInUserContent()}*/}
      {renderLoggedInUserContent()}
      <View accessible={false} style={{position: 'absolute', top: -20, right: -10}}>
        <RewardsGiftIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardsParentView: {
    height: 130,
    borderRadius: 15,
    width: '100%',
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
  myRewardsText: {marginStart: 10},
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
    paddingHorizontal: getMScale(12),
    paddingVertical: getMScale(8),
    borderRadius: getMScale(20),
    minWidth: getMScale(65),
    minHeight: getMScale(20),
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
    marginTop: 20,
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
});
export default React.memo(RewardsInfo);
