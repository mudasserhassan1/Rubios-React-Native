import {Platform, StyleSheet} from 'react-native';
import {SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';

const isIos = Platform.OS === 'ios';
const styles = StyleSheet.create({
  parentView: {
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  topContainer: {
    height: '15%',
    justifyContent: 'space-between',
    paddingHorizontal: isIos ? 20 : 15,
  },
  textContainer: {
    alignSelf: 'center',
    top: 20,
  },
  title: {
    color: colors.primaryWireFrames,
    textAlign: 'center',
    fontFamily: 'GritSans-Bold',
  },
  divider: {
    borderColor: colors.lightGray,
    borderWidth: 0.7,
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.primaryWireFrames,
    marginTop: 5,
  },
  imageAndButtonsContainer: {
    height: '70%',
    alignItems: 'center',
    zIndex: 1,
  },
  onBoardingImage: {
    width: '100%',
    height: '100%',
    marginBottom: 10,
    backgroundColor: colors.lightGray,
  },

  imageBackground: {
    flex: 1,
  },
  paginationDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    textTransform: 'uppercase',
    textAlign: 'center',
    // lineHeight:10,
  },
  subTitleStyle: {
    textAlign: 'center',
    lineHeight: 21,
  },
  nextButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 100,
  },
  onboarding6: {
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 200,
    marginStart: 40,
  },
  dotContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnStyle: {width: 45, height: 45, resizeMode: 'contain', alignSelf: 'center'},
  onBoarding6Style: {
    width: 103,
    height: 103,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttonWrapper: {
    marginTop: 34,
  },
});

export default styles;
