import {Platform, StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {
  getMScale,
  getScale,
  getVerticalScale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../theme/metrics';

const styles = StyleSheet.create({
  screen: {...appStyles.screen, flexGrow: 1, flex: 1},
  scrollContainer: {...appStyles.screen, flexGrow: 1},
  currentPointsWrapper: {
    marginTop: getMScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  greyLineStyle: {
    height: 1,
    backgroundColor: colors.primary_23,
    width: getMScale(122),
    marginTop: getMScale(7),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: '#e7e7e7',
    marginVertical: getVerticalScale(16),
    marginHorizontal: getMScale(16),
  },
  rewardsPointHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: getMScale(36),
  },
  actibeTabBar: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  timeLineWrapper: {
    flex: 1,
    marginHorizontal: getMScale(16),
  },
  dateStyle: {
    lineHeight: 16,
    letterSpacing0: 0.15,
    marginStart: getMScale(8),
  },
  eventTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingEnd: getMScale(20),
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyWrapper: {
    marginTop: getMScale(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    marginHorizontal: getMScale(50),
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  orderNowBtn: {width: '75%', marginTop: getVerticalScale(40)},
});

export default styles;
