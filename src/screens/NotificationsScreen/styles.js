import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, SCREEN_HEIGHT} from '../../theme/metrics';

const styles = StyleSheet.create({
  parent: {flex: 1, backgroundColor: colors.white},
  listContainer: {flex: 1, backgroundColor: colors.white, marginTop: getMScale(10)},
  messageItemParent: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    alignItems: 'center',
    marginTop: getMScale(8),
    padding: getMScale(16),
    borderRadius: getMScale(15),
    // justifyContent: 'space-between',
    flexDirection: 'row',
    columnGap: getMScale(16),
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowColor: colors.primary,
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  notificationIcon: {width: 60, height: 60},
  midContainer: {width: '55%'},
  description: {marginTop: getMScale(2)},
  messageItemActionButton: {
    width: '18%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonTitle: {textAlign: 'center', alignSelf: 'center'},
  listEmptyView: {
    flex: 1,
    rowGap: getMScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT * 0.7,
  },
  listEmptyIcon: {width: 100, height: 100},
  modalBodyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    // borderTopStartRadius: 16,
    // borderTopEndRadius: 16,
    // overflow: 'hidden',
    minHeight: '85%',
    // alignItems: 'center',
  },
});
export default styles;
