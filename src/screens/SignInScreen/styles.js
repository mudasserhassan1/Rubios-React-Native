import {StyleSheet} from 'react-native';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {appStyles, colors} from '../../theme';
import {isAndroid} from '../../utils/sharedUtils';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  title: {
    textTransform: 'uppercase',
  },
  iconMain: {
    width: getMScale(180),
    height: getVerticalScale(65),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: getVerticalScale(isAndroid ? 40 : 20),
  },
  mainInputsView: {
    paddingVertical: getVerticalScale(40),
    marginTop: getVerticalScale(20),
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '90%',
    alignSelf: 'center',
    borderRadius: getMScale(15),
    paddingHorizontal: getMScale(20),
  },
  inputsView: {width: '100%', marginTop: getVerticalScale(30)},
  buttonForgotPassword: {
    alignSelf: 'flex-end',
  },
  loginButton: {width: '75%', marginTop: 20},
  buttonAsGuest: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: getMScale(10),
    alignSelf: 'center',
  },
  signupText: {marginTop: getMScale(20)},
  textAsGuest: {
    fontSize: 15,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  inputRightViewContainer: {alignSelf: 'center', marginRight: 15},
  inputRightImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  bottomMostContainer: {marginTop: getVerticalScale(40)},
  continueAsGuestArrow: {
    width: getMScale(25),
    height: getMScale(25),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginStart: 8,
  },
  apiErrorTextStyle: {
    marginStart: getMScale(15),
  },
});

export default styles;
