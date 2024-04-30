import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import { getMScale, getVerticalScale } from "../../theme/metrics";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
  },
  paginationContainer: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  skipButton: {
    fontFamily: 'Libre Franklin',
    lineHeight: 34,
  },
  paginationDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 30,
  },
  titleStyle: {
    color: colors.secondary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subTitleStyle: {
    textAlign: 'center',
    paddingTop: getMScale(11),
    lineHeight: 21,
    paddingHorizontal: getMScale(15),
  },
  nextButton: {
    zIndex: 1,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 73,
  },
  dotContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnStyle: {
    resizeMode: 'contain',
    width: getMScale(25),
    height: getMScale(16),
  },
  onBoarding6Style: {
    width: 103,
    height: 103,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  rewardsBtn: {
    position: 'absolute',
    bottom: getVerticalScale(40),
    width: '70%',
    alignSelf: 'center',
  },
});

export default styles;
