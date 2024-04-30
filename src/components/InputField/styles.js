import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: '100%',
    marginTop: getVerticalScale(12),
    marginBottom: getVerticalScale(10),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    ...Platform.select({
      ios: {
        height: getVerticalScale(56),
      },
      android: {
        height: getVerticalScale(56),
      },
    }),
    paddingHorizontal: 10,
    width: '90%',
    paddingEnd: getMScale(20),
    color: colors.black,
    fontFamily: 'LibreFranklin-Regular',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    paddingStart: getMScale(15),
  },
  label: {
    backgroundColor: colors.white,
    position: 'absolute',
    top: -8,
    start: 8,
    paddingHorizontal: 8,
  },
  inputRightViewContainer: {alignSelf: 'center', marginRight: 15},
  inputRightImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default styles;
