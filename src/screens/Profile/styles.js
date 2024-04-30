import {StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    flex: 1,
    paddingHorizontal: getMScale(20),
    backgroundColor: 'white',
  },
  title: {
    textTransform: 'uppercase',
    color: colors.green,
    fontWeight: '400',
    fontSize: 15,
  },
  subTitle: {
    textTransform: 'uppercase',
    color: '#463a72e3',
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: getMScale(10),
  },

  text: {
    color: 'gray',
    marginStart: getMScale(5),
    marginEnd: getMScale(10),
    paddingEnd: getMScale(22),
    fontSize: getMScale(15),
  },

  link: {
    color: '#6178f7',
  },
  locationItemContainer: {
    padding: getMScale(10),
  },
  locationText: {
    color: colors.text,
  },
  listStyle: {backgroundColor: 'white'},
  checkBoxContainer: {
    marginVertical: getMScale(10),
  },
  notificationToggle_text: {
    fontSize: 18,
  },
  toggle_wrapper: {
    marginVertical: getMScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleTextStyle: {
    marginVertical: getMScale(10),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.primary_23,
    marginVertical: getMScale(10),
  },
  communicationTextStyle: {
    marginTop: getMScale(5),
  },
  subText: {
    marginTop: getMScale(10),
    lineHeight: 16,
    fontSize: 12,
    color: colors.subTitleText,
  },
  systemText: {
    lineHeight: 16,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: colors.secondary,
  },
  viaEmailTextStyle: {
    lineHeight: 16,
  },
  viaPNTextStyle: {
    marginTop: getMScale(8),
  },
  privacyPolicyText: {
    marginTop: getMScale(10),
    textDecorationLine: 'underline',
  },
  versiontextStyle: {
    marginTop: getMScale(10),
  },
  deleteAccount: {
    marginTop: getMScale(10),
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: getMScale(60),
    backgroundColor: '#F4F4F4',
    paddingHorizontal: getMScale(16),
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerView: {
    height: getVerticalScale(60),
    width: '100%',
    borderTopEndRadius: getScale(20),
    borderTopStartRadius: getScale(20),
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullHeaderIcon: {
    width: 35,
    height: 35,
    backgroundColor: colors.transparent,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBackground: {
    width: 35,
    height: 35,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCrossIcon: {
    width: 15,
    height: 14,
  },
  dateStyle: {
    marginTop: getMScale(8),
  },
  passwordFieldsWrapper: {
    marginHorizontal: getMScale(16),
    marginTop: getMScale(16),
  },
  pawordInstructionsTextStyle: {
    lineHeight: 17.5,
    letterSpacing: 0.15,
    marginBottom: getMScale(16),
  },
  submitBtnStyle: {
    width: '70%',
    alignSelf: 'center',
    marginTop: getMScale(40),
  },
  completeBtnStyle: {
    width: '70%',
    alignSelf: 'center',
    marginTop: getMScale(30),
  },
  otpInstructionsTextStyle: {
    lineHeight: 17.5,
    letterSpacing: 0.15,
    marginHorizontal: getMScale(16),
    marginTop: getMScale(16),
  },
});

export default styles;
