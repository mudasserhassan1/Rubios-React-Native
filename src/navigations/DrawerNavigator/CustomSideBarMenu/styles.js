import {Platform, StyleSheet} from 'react-native';
import {getMScale, getVerticalScale} from '../../../theme/metrics';
import {colors} from '../../../theme';

const styles = StyleSheet.create({
  crossBtn: {
    height: 60,
    width: 60,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: getVerticalScale(30),
  },
  crossButton: {
    position: 'absolute',
    left: 7,
  },
  headerBackgroundImageStyle: {
    flex: 1,
    // height: ,
    ...Platform.select({
      ios: {
        height: getMScale(230),
      },
      android: {
        height: getMScale(225),
      },
    }),
  },
  horizontalLineStyle: {
    height: 1,
    backgroundColor: colors.dividerLine,
    marginVertical: getVerticalScale(13),
    marginHorizontal: getMScale(15),
  },
  bottomWhiteArea: {
    backgroundColor: colors.white,
    paddingVertical: getVerticalScale(16),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(16),
    marginHorizontal: getMScale(15),
  },
  leftIconStyle: {
    height: 51,
    width: 51,
  },
  textStyle: {
    marginLeft: getMScale(11),
    lineHeight: 17.5,
    letterSpacing: 0.15,
  },
  sideMenuLowerItemstextStyle: {
    // marginLeft: getMScale(11),
  },
  logOutTextStyle: {
    // marginLeft: getMScale(11),
    color: colors.primaryLink,
    textDecorationLine: 'underline',
  },
  rightBtn: {
    width: 10,
    height: 17,
  },
  downBtn: {
    width: 17,
    height: 10,
  },
  upperViewParentStyle: {
    marginHorizontal: getMScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upperInnerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerViewParentStyle: {
    marginHorizontal: getMScale(15),
    marginVertical: getVerticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseableView: {
    marginHorizontal: getMScale(40),
  },
  collapseableText: {
    lineHeight: getVerticalScale(17.5),
    letterSpacing: 0.15,
    paddingVertical: getVerticalScale(10),
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sheetContentContainer: {
    flex: 1,
    // alignItems: 'center',
  },
  sheetStyle: {
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    shadowColor: colors.black,
    elevation: 24,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#214F66',
    height: 40,
    paddingRight: 12,
    paddingLeft: 12,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTopImageStyle: {
    marginTop: getVerticalScale(24),
    height: getVerticalScale(115),
    width: getMScale(115),
  },
  rewardsTextSyle: {
    marginTop: getVerticalScale(24),
    marginHorizontal: getMScale(60),
    textAlign: 'center',
  },
  rewardsSubtitleStyle: {
    marginTop: getVerticalScale(16),
    marginHorizontal: getMScale(60),
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  createAccountBtn: {width: '75%', marginTop: getVerticalScale(32)},
  signupText: {marginTop: getMScale(20)},
  creatAccountTextStyle: {
    // marginLeft: getMScale(11),
    color: colors.secondary,
  },
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.3,
  },
  nameTextStyle: {
    width: '70%',
    textTransform: 'uppercase',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
export default styles;
