import {appStyles, colors} from '../../theme';
import {
  getMScale,
  getScale,
  getVerticalScale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
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
  imageBackground: {
    height: getMScale(200),
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
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
  topImage: {
    height: getMScale(150),
    width: getMScale(150),
    borderRadius: getMScale(16),
  },
  qrParent: {
    height: SCREEN_HEIGHT - 200,
    // flex: 1,
    backgroundColor: colors.white,
  },
});
export default styles;
