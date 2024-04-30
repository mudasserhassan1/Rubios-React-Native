import {Platform, StyleSheet} from 'react-native';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
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
    lineHeight: 28,
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
  textStyleOfImageText: {
    marginHorizontal: getMScale(60),
    textAlign: 'center',
    marginTop: getMScale(16),
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  imagesWrapper: {
    marginTop: getMScale(90),
    height: getMScale(450),
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: getMScale(200),
    // marginTop: getMScale(27),
  },
  colum2: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    height: getMScale(200),
    marginTop: getMScale(27),
  },
  dividerLine: {
    // marginTop: getMScale(18),
  },
  phoneBg1: {
    marginTop: getMScale(10),
    width: getMScale(210),
    height: getMScale(405),
  },
  rightView: {
    width: '70%',
    padding: 16,
    borderTopLeftRadius: getMScale(16),
    borderBottomLeftRadius: getMScale(16),
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(9),
  },
  secondIndexWrapper: {
    marginTop: getMScale(90),
  },
  infoText: {
    lineHeight: 16,
    letterSpacing: 0.15,
    paddingEnd: 16,
  },
  pointer1: {
    position: 'absolute',
    top: getMScale(380),
    left: getMScale(165),
  },

  leftView: {
    marginTop: getMScale(123),
    width: '100%',
    padding: 16,
    borderTopRightRadius: getMScale(16),
    borderBottomRightRadius: getMScale(16),
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  phoneBg2: {
    width: getMScale(210),
    height: getMScale(405),
  },
  infoTextLeft: {
    lineHeight: 16,
    letterSpacing: 0.15,
    textAlign: 'right',
  },
  pointer2: {
    position: 'absolute',
    top: getMScale(270),
    left: getMScale(158),
  },
  bottomView: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
    alignSelf: 'center',
  },
  bottomTextWrapper: {
    height: 240,
    paddingTop: getMScale(35),
    width: getMScale(300),
    alignSelf: 'center',
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getVerticalScale(100),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    margin: isIos ? 10 : 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default styles;
