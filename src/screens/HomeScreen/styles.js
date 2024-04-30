import {Platform, StyleSheet} from 'react-native';
import {colors, spacing} from '../../theme';
import {getMScale, getVerticalScale, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../theme/metrics';

const styles = StyleSheet.create({
  backgroundParent: {
    width: SCREEN_WIDTH,
    flex: 1,
    flexGrow: 1,
    resizeMode: 'stretch',
  },
  qrcodeContainer: {
    height: 63,
    backgroundColor: colors.white,
    width: 63,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 4.62,
    elevation: 4,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    ...Platform.select({
      ios: {
        bottom: SCREEN_HEIGHT * 0.15,
      },
      android: {
        bottom: getMScale(115),
      },
    }),
  },

  imageBackground: {
    flex: 1,
  },
  titleStyle: {
    color: colors.secondary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subTitleStyle: {
    textAlign: 'center',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: SCREEN_HEIGHT * 0.87,
      },
      android: {
        top: SCREEN_HEIGHT * 0.92,
      },
    }),
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  startOrderButton: {
    backgroundColor: colors.primaryYellow,
  },
  smallStartOrderButton: {width: '45%'},
  reorderButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.white,
    maxWidth: '45%',
  },
  loader: {
    height: getMScale(25),
    width: getMScale(25),
    position: 'absolute',
    bottom: 25,
  },
  orderInProgressContainer: {
    top: SCREEN_HEIGHT * 0.51,
    marginVertical: 5,
    paddingHorizontal: getMScale(5),
    borderRadius: 0,
  },
  scanText: {marginTop: 5},
  smallStartOrderButtonTitle: {fontSize: 16},
  reorderButtonTitle: {color: colors.white, fontSize: 16},
  alreadyMemberSigninView: {marginTop: getVerticalScale(16)},
  alreadyMemberText: {textDecorationLine: 'underline'},
});

export default styles;
