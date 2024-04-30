import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';

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
    fontSize: 14,
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
  onBoardingSubTitleStyle: {
    textAlign: 'center',
    lineHeight: 21,
  },
  onBoardingTitleStyle: {
    textTransform: 'uppercase',
    textAlign: 'center',
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
});

export default styles;
