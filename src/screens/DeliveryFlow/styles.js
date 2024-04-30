import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import { isIos } from "../../utils/sharedUtils";

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  sheetStyle: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  bottomSheetContainer: {
    padding: 24,
    flex: 1,
  },
  sheetContentContainer: {
    flex: 1,
    // alignItems: 'center',
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
  searchParent: {
    width: '100%',
    marginTop: getVerticalScale(10),
    flexDirection: 'row',
  },
  searchIcon: {width: getScale(20), height: getScale(20)},
  inputView: {
    width: 2,
    height: '50%',
    alignSelf: 'center',
    marginHorizontal: getMScale(10),
    backgroundColor: '#cccccc',
  },
  input: {width: '100%', height: '100%', color: colors.primary},
  crossIcon: {width: getMScale(20), height: getScale(20)},
  expandedViewParent: {
    marginTop: getMScale(20),
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'white',
  },
  currentLocationView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: getMScale(16),
  },
  currLocationIcon: {width: getScale(30), height: getScale(30), paddingHorizontal: getMScale(16)},
  currLocationText: {marginStart: getMScale(10)},
  listHeader: {
    marginTop: getVerticalScale(20),
    marginBottom: getVerticalScale(10),
    paddingHorizontal: getMScale(16),
  },
  listContentContainer: {flexGrow: 1, paddingHorizontal: getMScale(15)},
  locationItemParent: {
    marginVertical: getVerticalScale(10),
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: getScale(1),
    paddingBottom: getVerticalScale(10),
    borderBottomColor: '#DFDFDF',
  },
  locationInfoView: {width: '85%'},
  locationName: {textTransform: 'uppercase'},
  favIconView: {alignSelf: 'center', padding: 5},
  favIcon: {width: getScale(25), height: getScale(25)},
  header: {
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
  headerIconBackground: {
    width: 35,
    height: 35,
    backgroundColor: colors.white,
    borderRadius: 20,
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
  headerIcon: {
    width: 20,
    height: 20,
  },
  headerCrossIcon: {
    width: 15,
    height: 14,
  },
  autoCompleteRow: {flexDirection: 'row', flexShrink: 1},
  itemLayout: {
    flex: 1,
    paddingVertical: getMScale(16),
    flexDirection: 'column',
  },
  item: {
    fontSize: 15,
    height: 44,
  },
  buttonStyle: {
    width: 'auto',
    flexGrow: 1,
    flexBasis: 'auto',
    paddingHorizontal: 1,
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonTitleStyle: {
    fontSize: 12,
  },
  container: {
    paddingHorizontal: getMScale(15),
    // height:getMScale(100),
    paddingBottom: getMScale(10),
  },
  textInput: {
    marginHorizontal: getMScale(16),
    backgroundColor: colors.textInputBackgroundColor,
    borderRadius: getMScale(12),
  },

  autocompleteContainer: {
    backgroundColor: colors.white,
  },
  textInputContainer: {
    backgroundColor: colors.white,
  },
  listView: {
    marginVertical: getMScale(16),
    flexGrow:1,
    // paddingBottom:400
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.primary_23,
    marginHorizontal: getMScale(16),
  },
  inputsView: {
    marginTop: getVerticalScale(13),
    paddingHorizontal: getMScale(16),
    // flex: 1,
  },
  makeDefaultAddressParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getMScale(10),
  },
  makeDefaultAddressInnerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeAddressDefaultTextStyle: {
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: 0.15,
    marginStart: getMScale(12),
  },
  crossBtn: {
    height: 45,
    width: 45,
  },
  bottomView: {
    width: '100%',
    // position: 'absolute',
    alignItems: 'center',
    // bottom: 70,
    marginTop: getMScale(40),
    alignSelf: 'center',
  },
  addNewAdddressBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    marginTop: getMScale(10),
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

    height: getMScale(56),
    width: '92%',
  },
  dummy: {
    marginVertical: getMScale(10),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
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

    height: getMScale(56),
    width: '90%',
  },
  deliveryAddressBtn: {width: '80%'},
  addNewDeliveryAddressBtn: {width: '100%'},
  inputParentStyle: {
    flexGrow: 1,
  },
  lowerBtnsWrapper: {
    backgroundColor: colors.white,
    height: getMScale(isIos ? 205 : 160),
  },
  saveButtonContainer: {
    position: 'absolute',
    // bottom: 30,
    paddingTop: getVerticalScale(20),
    backgroundColor: colors.white,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
});

export default styles;
