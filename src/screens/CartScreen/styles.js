import {StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  itemStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  tinyImage: {
    width: 50,
    height: 50,
  },
  buttonsContainer: {
    // width: '70%',
    flex: 1,
  },
  buttonStyle: {
    width: '100%',
    padding: 5,
    // marginHorizontal: 2,
    justifyContent: 'center',
    borderRadius: 0,
    backgroundColor: colors.secondaryColor,
  },
  buttonTitleStyle: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  textStyle: {
    fontSize: 20,
    color: 'blue',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  itemTitle: {
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 3,
  },
  item: {
    paddingHorizontal: 10,
    fontSize: 12,
    height: 44,
  },
  emptyText: {
    fontSize: 20,
    color: colors.primary,
  },
  lineView: {
    marginTop: 40,
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 40,
  },
  orderDetailView: {
    flex: 1,
    marginVertical: 20,
  },
  headingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#214F66',
  },
  itemViewLine: {
    marginTop: 10,
    height: 2,
    backgroundColor: '#214F66',
    // marginLeft: 20,
    marginRight: 20,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 20,
    // marginRight: 20,
    marginTop: 20,
  },
  orderDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#214F66',
  },
  estimatedTaxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 20,
    // marginRight: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  estimatedTaxTitle: {
    fontSize: 16,
    color: '#214F66',
  },
  itemView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  itemInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemSubTitle: {
    fontSize: 12,
    color: '#214F66',
    marginLeft: 6,
  },
  removeBtnStyle: {
    color: colors.error,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  priceTextStyle: {
    paddingHorizontal: 10,
    fontSize: 14,
    height: 44,
    marginTop: 10,
  },
  editBtnStyle: {
    color: colors.primary,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginEnd: 10,
  },
  listStyle: {
    marginTop: getMScale(10),
    paddingBottom: getVerticalScale(40),
    // paddingHorizontal: getMScale(15),
  },
  daysListStyle: {
    // marginTop: getMScale(0),
    backgroundColor: 'red',
  },
  listEmptyStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemButtonContainer: {flex: 1, flexDirection: 'row'},
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  listHeaderView: {flexDirection: 'row'},
  //Cart Item Styles
  cartItemCard: {paddingVertical: 10},
  titleRow: {flex: 3},
  removeItemStyle: {flex: 1},
  listContainerStyle: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  dayList: {
    paddingHorizontal: getMScale(16),
    paddingBottom: 20,
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  upsellsContainer: {marginTop: 10},

  screen: appStyles.screen,
  container: {
    flex: 1,
    flexGrow: 1,
  },
  title: {
    color: colors.textGray,
  },

  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(16),
    marginHorizontal: getMScale(15),
  },
  greyHorizontaTimeSlotlLine: {
    height: 1,
    backgroundColor: colors.greyLine,
    // marginVertical: getVerticalScale(16),
  },
  addMoreBtnStyle: {width: '95%'},
  myOrderTextStyle: {lineHeight: 16, letterSpacing: 0.15},
  signupText: {},
  addSalsaTextStyle: {
    textTransform: 'uppercase',
    lineHeight: 24,
  },
  salsaTextStyle: {
    textShadowColor: 'black',
    textTransform: 'uppercase',
  },
  rightBtn: {
    width: 10,
    height: 17,
  },
  utensilIconStyle: {
    width: getMScale(18),
    height: getMScale(18),
  },
  includeNapkinTextStyle: {
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: 0.15,
    marginStart: 15,
  },
  checkOutBtn: {
    width: '75%',
  },
  container_: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackgroundImageStyle: {
    padding: 16,
  },
  bottomSheetParent: {marginBottom: getMScale(16), marginTop: getMScale(6)},
  salsaParent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salsaTextOne: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'GritSans-Bold',
    textTransform: 'uppercase',
  },
  utensilIconParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: getMScale(15),
    marginTop: getMScale(16),
  },
  utensilIconInnerView: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'},
  checkOutBtnStyle: {alignItems: 'center', marginTop: getMScale(40)},
  bottomSheetContainer: {
    padding: 24,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: getMScale(110),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
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

  dayItem: {
    minHeight: getMScale(75),
    minWidth: getMScale(132),
    borderRadius: getMScale(15),
    paddingHorizontal: getMScale(24),
    paddingVertical: getMScale(16),
    marginRight: getMScale(10),
    marginTop: getMScale(20),
  },
  selectedItem: {
    backgroundColor: colors.secondary,
  },
  unSelectedItem: {
    backgroundColor: '#A7C2D13B',
  },
  dateStyle: {
    marginTop: getMScale(8),
  },
  donBtnStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
  },
  doneBtn: {
    width: '70%',
  },
  timeSlotContentContainer: {
    paddingBottom: 125,
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: getMScale(16)
  },
  emptyWrapper: {
    marginTop: getMScale(120),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: getMScale(15),
  },
  emptyTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    marginHorizontal: getMScale(50),
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  orderNowBtn: {width: '65%', marginTop: getVerticalScale(40)},
});

export default styles;
