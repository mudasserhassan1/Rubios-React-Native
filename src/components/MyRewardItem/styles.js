import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginBottom: getVerticalScale(10),
    width: getMScale(123),
    backgroundColor: colors.white,
    borderRadius: getScale(15),
    height: getMScale(178),
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  image: {
    height: getMScale(88),
    borderTopLeftRadius: getScale(15),
    borderTopRightRadius: getScale(15),
    width: '100%',
  },
  points: {
    marginTop: getMScale(5),
  },
  expires: {
    marginTop: getVerticalScale(5),
  },
  title: {
    marginTop: getVerticalScale(5),
  },
  apply: {
    marginTop: getMScale(16),
  },
  icon: {
    top: 5,
    right: 25,
    position: 'absolute',
    zIndex: 22,
  },
});

export default styles;
