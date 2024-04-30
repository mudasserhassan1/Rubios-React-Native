import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {isIos} from '../../utils/sharedUtils';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: getMScale(8),
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  addressTextStyle: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 18,
  },
  deleteMarkDefaultWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteTextStyle: {
    color: 'red',
    fontSize: 18,
    padding: 10,
  },
  makeDefaultTextStyle: {
    color: colors.primary,
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  wrapper: {
    borderColor: colors.primary,
    borderWidth: 1,
    margin: 10,
    borderRadius: 15,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyComponentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListTextStyle: {
    fontSize: 18,
  },
  myDeliveryAddText: {
    marginStart: getMScale(16),
    marginBottom: getMScale(16),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(24),
  },
  addNewDevileryAddress: {
    padding: getMScale(16),
    marginHorizontal: getMScale(16),
    borderRadius: getMScale(16),
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
  },
});
