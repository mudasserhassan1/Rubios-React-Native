import {Platform, StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import {FONT_WEIGHT} from '../../components/RText/constants';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  headerShadowStyle: {
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // shadowColor: colors.black,
    // elevation: 3,
  },
  contactInfoParent: {
    padding: getVerticalScale(16),
    marginHorizontal: getMScale(15),
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: getVerticalScale(5),
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
  contactInfoView: {width: '80%'},
  contactInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: getVerticalScale(4),
  },
  contactInfoRowIcon: {width: 20, alignItems: 'center'},
  contactInfoRowText: {marginStart: getMScale(10), maxWidth: getMScale(250)},
  verticalLine: {width: 1, height: '100%', backgroundColor: colors.dividerLine},
  contactInfoChangeText: {width: '17%', alignItems: 'center'},
  confirmOrderItemsParent: {marginVertical: getVerticalScale(16), marginHorizontal: getMScale(15)},
  productsContainer: {
    paddingHorizontal: getScale(16),
    marginTop: getVerticalScale(16),
    backgroundColor: colors.white,
    borderRadius: 16,
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
  productItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomColor: colors.dividerLine,
  },
  quantityView: {
    width: getMScale(37),
    backgroundColor: colors.primaryYellow,
    borderRadius: getScale(20),
    height: getMScale(37),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameAndChoicesView: {
    width: '70%',
    justifyContent: 'center',
    minHeight: getScale(37),
    paddingStart: getMScale(10),
  },
  priceView: {
    width: '18%',
    height: getScale(37),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rewardsContainer: {height: getMScale(258), backgroundColor: '#F5F1E9'},
  rewardsSectionTitle: {
    marginVertical: getVerticalScale(16),
    marginStart: getMScale(15),
    textTransform: 'uppercase',
  },
  couponInputView: {marginTop: getVerticalScale(16), paddingHorizontal: getMScale(15)},
  tipsContainer: {marginTop: getVerticalScale(10), paddingHorizontal: getMScale(15)},
  tipsItemsView: {flexDirection: 'row', marginTop: getVerticalScale(10)},
  tipItem: {
    backgroundColor: colors.white,
    borderRadius: getScale(20),
    marginEnd: getMScale(10),
    paddingVertical: getVerticalScale(5),
    paddingHorizontal: getMScale(25),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.9,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tipAmountInputView: {
    backgroundColor: colors.white,
    width: getMScale(133),
    height: getScale(26),
    borderRadius: getScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(162, 162, 162, 0.3)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.9,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
    marginTop: getVerticalScale(10),
  },
  tipAmountInput: {
    ...FONT_WEIGHT.semiBold,
    fontSize: 12,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    paddingVertical: 0,
    alignSelf: 'center',
  },
  dividerContainer: {marginHorizontal: getMScale(15)},
  divider: {marginTop: getVerticalScale(15)},
  calculationContainer: {marginHorizontal: getMScale(15), marginTop: getVerticalScale(20)},
  paymentMethodsView: {marginTop: getVerticalScale(20), marginHorizontal: getMScale(15)},
  lineView: {
    marginTop: 20,
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: 20,
  },
  loader: {
    height: getMScale(25),
    width: getMScale(25),
    alignSelf: 'center',
  },
  whoPickupTitle: {
    fontSize: 14,
    color: '#0375BE',
    textTransform: 'uppercase',
  },
  changeTextContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  dateText: {
    paddingEnd: 10,
    fontWeight: '500',
    fontSize: 15,
    color: colors.black,
  },

  changeText: {
    fontSize: 15,
    color: colors.textColorDark,
  },
  pickupTypeTitle: {
    fontSize: 20,
    color: '#062C43',
    textTransform: 'uppercase',
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    margin: 4,
    padding: 8,
  },

  timeSlotText: {
    fontSize: 15,
    color: colors.black,
  },

  timeBoxView: {
    height: 60,
    width: 100,
    backgroundColor: colors.secondaryColor,
    marginEnd: 4,
    marginVertical: 4,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBoxViewSelected: {
    backgroundColor: '#0375BE',
  },
  chooseTimeView: {
    backgroundColor: colors.secondaryColor,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12,
  },
  timeModalView: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 30,
  },
  estTimeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '400',
  },
  textBoxTime: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  editBtnStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  guestSignupHeader: {
    color: colors.secondaryColor,
    fontSize: 18,
    textAlign: 'center',
  },
  guestSignupDescription: {
    color: colors.textColorDark,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  contactlessDeliveryCheckboxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '55%',
    alignItems: 'center',
    marginTop: 5,
  },
  bottomButtonContainer2: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton2: {
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: colors.primary,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  textDeleteFav: {
    width: '100%',
    fontWeight: '600',
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  modal: {
    elevation: 3,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: getMScale(15),
    justifyContent: 'center',
  },
  suggestedTimeScrollView: {
    flexDirection: 'row',
  },
});

export default styles;
