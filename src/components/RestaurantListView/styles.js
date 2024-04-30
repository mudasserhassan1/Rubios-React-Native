import {appStyles, colors} from '../../theme';
import {
  getMScale,
  getScale,
  getVerticalScale,
} from '../../theme/metrics';
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  subTitle: {
    textTransform: 'uppercase',
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: getMScale(15),
  },

  hint: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  code: {
    color: colors.primary,
    marginTop: getMScale(15),
    alignSelf: 'center',
  },
  qrcodeContainer: {
    backgroundColor: colors.white,
    padding: 20,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getMScale(25),
    alignSelf: 'center',
    borderRadius: getMScale(16),
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

  loaderContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
    width: 250,
    marginVertical: getMScale(40),
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
  separatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  emptyComponentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListTextStyle: {
    fontSize: 18,
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
  searchParent: {
    backgroundColor: '#f4f4f4',
    width: '90%',
    marginTop: getVerticalScale(10),
    height: getVerticalScale(45),
    borderRadius: getScale(10),
    paddingHorizontal: getScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
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
});
export default styles;
