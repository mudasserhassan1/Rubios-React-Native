import {Platform, StyleSheet} from 'react-native';
import {appStyles, colors} from '../../theme';
import {getMScale, getScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRight: {
    marginEnd: -20,
  },
  modifierMainView: {
    paddingHorizontal: 5,
  },
  newDesignModifiersView: {
    // backgroundColor: '#A7C2D13B',
    backgroundColor: '#A7C2D13B',
    overflow: 'hidden',
    marginHorizontal:5,
    // borderRadius: getScale(16)
  },
  required: {
    color: 'green',
  },
  modifierInnerView: {
    margin: 4,
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  newDesignInnerView: {
    backgroundColor: 'transparent',
    marginHorizontal: getMScale(10),
    paddingHorizontal: getMScale(10),
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftDots: {
    width: 20,
    height: 20,
  },
  modifierImageView: {
    height: getMScale(65),
    width: getMScale(65),
    borderRadius: getMScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: colors.teal,
  },
  modifierImage: {
    width: '100%',
    height: '100%',
    // aspectRatio: 15 / 13,
    borderRadius: getMScale(50),
  },
  itemMeta: {
    alignItems: 'flex-start',
    width: '60%',
  },
  modifierItemTitle: {
    marginStart: 10,
    padding: 2,
    textAlign: 'left',
  },
  modifierItemPrice: {
    textAlign: 'center',
    color: colors.palette.primary,
  },
  bottomView: {
    paddingVertical: getVerticalScale(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.7,
        shadowRadius: 12.0,
        shadowColor: colors.black,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  priceContainer: {width: '28%', marginStart: getMScale(20)},
  quantityParent: {width: '27%'},
  bottomQuantityView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 50,
    paddingVertical: 5,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5.0,
        shadowColor: colors.black,
      },
    }),
  },
  quantityTitle: {
    // marginRight: 20,
  },
  stepperView: {
    borderRadius: 10,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stepperInnerView: {
    width: 30,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.offWhite,
  },
  addCartView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getMScale(42),
    backgroundColor: colors.palette.secondary,
    marginHorizontal:15,
    width: 'auto',
    minWidth: 130,
    // marginEnd: getMScale(10),
  },
  addCartTitle: {
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  ddlButton: {
    justifyContent: 'center',
    margin: 5,
    width: '20%',
  },
  ddlText: {
    textAlign: 'right',
  },
  modal: {
    padding: 0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  safeArea: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  ddlModalButton: {
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  singleOptionView: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryYellow,
    borderRadius: 20,
  },
  optionHeadingView: {
    paddingVertical: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.primaryYellow,
    borderRadius: 20,
    // width: '100%',
    alignSelf: 'flex-start',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  modifierSimpleHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: getMScale(10),
    alignItems: 'center',
    marginTop: getVerticalScale(8),
    overflow: 'hidden',
  },
  modifierHeadingHR: {
    marginHorizontal: 10,
    marginTop: 0,
  },
  //Options Item Styles
  modifiersParentView: {
    width: '72%',
  },
  selectImage: {
    width: 28,
    height: 28,
    position: 'absolute',
    zIndex: 1,
    right: -9,
    top: 0,
  },
  selectedModifierParent: {width: '30%'},
  selectionInner: {
    justifyContent: 'center',
    margin: 5,
    width: '100%',
  },
  selectionInnerText: {textAlign: 'right'},
  swipeableItem: {
    minWidth: getScale(71),
    alignItems: 'center',
    marginHorizontal: 8,
    justifyContent: 'center',
    borderRightWidth: 0,
    // paddingVertical: 10,
    borderRadius: 10,
    minHeight: getMScale(40),
  },
  swipeableText: {
    // width: '70%',
    marginHorizontal: 7,
    textAlign: 'center',
    alignSelf: 'center',
  },
  customizeItem: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 8,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  customizeItemNewDesign: {
    borderRadius: getScale(16),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    paddingVertical: 16,
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  toggleText: {textTransform: 'uppercase'},
  header: {
    width: '100%',
    height: getVerticalScale(77),
    alignItems: 'center',
    backgroundColor: colors.bottomSheetHeaderColor,
    justifyContent: 'center',
  },
  crossIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    position: 'absolute',
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  proteinItem: {width: (SCREEN_WIDTH - 50) / 3, alignItems: 'center'},
  proteinItemText: {
    textAlign: 'center',
    minHeight: getVerticalScale(30),
    width: getMScale(110),
    marginTop: getVerticalScale(10),
  },
  proteinItemCost: {marginTop: getVerticalScale(10)},
  bottomSheetHeaderText: {textTransform: 'uppercase', width: '50%', textAlign: 'center'},
  bottomSheetContentContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  proteinsScrollContentContainer: {
    paddingTop: getVerticalScale(20),
    paddingBottom: getVerticalScale(50),
  },
  buttonContainerStyle: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: getVerticalScale(16),
    paddingVertical:40,
  },
  buttonStyle: {
    width: '80%',
    alignSelf: 'center',
  },

});

export default styles;
