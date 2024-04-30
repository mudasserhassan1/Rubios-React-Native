import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {
  getMScale,
  getVerticalScale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../theme/metrics';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: getMScale(120),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
  },
  mapContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    padding: getMScale(17),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    marginHorizontal: getMScale(16),
    backgroundColor: colors.white,
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
  adressDetailWrapper: {
    marginHorizontal: getMScale(16),
  },
  addressStyle: {
    textDecorationLine: 'underline',
    marginTop: getMScale(5),
  },
  addressStyle_: {
    marginTop: getMScale(5),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(16),
    marginHorizontal: getMScale(15),
  },
  orderStatusView: {
    height: SCREEN_HEIGHT / 2.5,
    marginTop: getMScale(20),
    paddingTop: getMScale(17),
    borderTopLeftRadius: getMScale(16),
    borderTopRightRadius: getMScale(16),
    backgroundColor: colors.white,
    shadowColor: 'rgba(162, 162, 162, 0.3)',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deliveryTimeStyle: {
    marginVertical: getMScale(16),
    lineHeight: 21,
    letterSpacing: 0.15,
  },
  pickupPointsTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getMScale(10),
  },
  pickupRewardImageStyle: {
    height: getMScale(50),
    width: getMScale(50),
  },
  deliveryRewardImageStyle: {
    height: getMScale(27),
    width: getMScale(27),
  },
  deliveryPointsTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: getMScale(10),
    alignItems: 'center',
  },
  orderStatusTextStyle: {
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  orderStatusTextStyle_: {
    textAlign: 'center',
    lineHeight: 16,
    marginTop: getMScale(6),
  },
  deliveryStatusImageStyle: {
    height: getMScale(100),
    width: SCREEN_WIDTH,
    marginTop: getMScale(10),
  },




  calloutContainer: {
    backgroundColor: '#fff',
    // padding: 10,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderRadius:16
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
  },
});

export default styles;
