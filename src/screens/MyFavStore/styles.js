import {StyleSheet} from 'react-native';
import {getMScale, getVerticalScale, SCREEN_WIDTH} from '../../theme/metrics';
import {colors} from '../../theme';
import { isIos } from "../../utils/sharedUtils";

const styles = StyleSheet.create({
  parentContainer: {flex: 1, width: SCREEN_WIDTH, backgroundColor: colors.white},
  imageBackgroundContainer: {
    paddingHorizontal: 15,
  },
  headerView: {width: '100%', flexDirection: 'row', height: 48, alignItems: 'center'},
  headerTitle: {marginStart: 15},
  storeLocationInfoContainer: {flexDirection: 'row', alignItems: 'center', marginHorizontal: 15},
  storeName: {
    textTransform: 'uppercase',
    marginStart: 10,
    lineHeight: 20,
    width: '80%',
  },
  horizontalLine: {width: '100%', height: 1, backgroundColor: colors.greyLine, marginVertical: 15},
  bottomInfoContainer: {marginHorizontal: 15, alignItems: 'center'},
  addressContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarInfoView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginTop: 10,
  },
  otherDaysCalendarText: {marginTop: 5},
  moreHoursText: {textDecorationLine: 'underline'},
  changeStoreContainer: {
    justifyContent: 'flex-end',
    marginEnd: getMScale(39),
    marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeStoreText: {textDecorationLine: 'underline'},
  circleArrowIcon: {marginStart: 10},
  bottomContainer: {paddingHorizontal: 15, paddingVertical: 15},
  orderTypeRowView: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 15,
    backgroundColor: colors.white,
    marginVertical: 10,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    elevation: 3,
  },
  orderTypeInnerLeftView: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myFavStoreText: {
    marginStart: getMScale(16),
    marginBottom: getMScale(16),
    paddingTop: 0,
  },
  emptyWrapper: {
    marginTop: getMScale(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    marginHorizontal: getMScale(50),
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  orderNowBtn: {width: '75%', marginTop: getVerticalScale(40)},
});
export default styles;
