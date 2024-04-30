import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import { getMScale, getScale, getVerticalScale, SCREEN_WIDTH } from "../../theme/metrics";
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

const styles = StyleSheet.create({
  parent: {flex: 1, backgroundColor: colors.white},
  // map: {
  //   // flex: 1,
  //   height: '50%'
  // },
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
    // padding: 24,
    flex: 1,
    backgroundColor: 'transparent',
  },
  sheetContentContainer: {
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: '#f4f4f4',
    width: '90%',
    marginTop: getVerticalScale(10),
    height: getVerticalScale(45),
    borderRadius: getScale(10),
    paddingHorizontal: getScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {width: getScale(20), height: getScale(20)},
  inputView: {
    width: 2,
    height: '50%',
    alignSelf: 'center',
    marginHorizontal: getMScale(10),
    backgroundColor: '#cccccc',
  },
  input: {width: '80%', height: '100%', color: colors.primary},
  crossIcon: {width: getMScale(20), height: getScale(20)},
  expandedViewParent: {width: '100%', marginTop: 10, flexGrow: 1, minHeight: SCREEN_HEIGHT * 0.2},
  currentLocationView: {
    flexDirection: 'row',
    width: '90%',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: getVerticalScale(10),
    alignItems: 'center',
    alignSelf: 'center',
  },
  currLocationIcon: {width: getScale(30), height: getScale(30)},
  currLocationText: {marginStart: getMScale(10)},
  listHeader: {
    marginStart: getMScale(10),
    marginTop: getVerticalScale(15),
    marginBottom: getVerticalScale(5),
  },
  listContentContainer: {flexGrow: 1, paddingHorizontal: getMScale(15)},
  locationItemParent: {
    marginVertical: getVerticalScale(8),
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: getVerticalScale(16),
    paddingHorizontal: getMScale(20),
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  locationInfoView: {width: '70%', marginStart: getMScale(17)},
  locationName: {textTransform: 'capitalize'},
  favIconView: {alignSelf: 'center', padding: 5},
  favIcon: {width: getScale(25), height: getScale(25)},
  header: {
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  headerIconBackground: {
    width: 35,
    height: 35,
    backgroundColor: colors.white,
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
