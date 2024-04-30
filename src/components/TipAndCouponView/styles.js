import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale, getScale, getVerticalScale} from '../../theme/metrics';
import {FONT_WEIGHT} from '../RText/constants';

const styles = StyleSheet.create({
  headingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#214F66',
  },
  tipText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  itemViewLine: {
    marginTop: 10,
    height: 2,
    backgroundColor: '#214F66',
    marginLeft: 20,
    marginRight: 20,
  },

  tipView: {
    backgroundColor: '#214F66',
    margin: 4,
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  tipInput: {
    flex: 1,
    width: 200,
  },
  tipInputContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors.primary,
    height: 50,
    width: 80,
  },
  iconDisable: {
    backgroundColor: colors.grey500,
  },
  remove: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
  couponInputView: {marginTop: getVerticalScale(16), paddingHorizontal: getMScale(15)},
  tipsContainer: {marginTop: getVerticalScale(10), paddingHorizontal: getMScale(15)},
  tipsItemsView: {flexDirection: 'row', marginTop: getVerticalScale(10)},
  tipItem: {
    backgroundColor: colors.white,
    borderRadius: getScale(20),
    marginEnd: getMScale(10),
    // paddingVertical: getVerticalScale(5),
    height: getMScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: getMScale(80),
    // paddingHorizontal: getMScale(25),
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
  selectedTipItem: {
    backgroundColor: colors.secondary,
  },
  tipAmountInputView: {
    backgroundColor: colors.white,
    width: getMScale(133),
    paddingHorizontal: getMScale(15),
    height: getMScale(30),
    borderRadius: getScale(20),
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: getVerticalScale(10),
    flexDirection: 'row',
  },
  tipAmountInput: {
    ...FONT_WEIGHT.semiBold,
    fontSize: 12,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    paddingVertical: 0,
    alignSelf: 'center',
    color: colors.primary,
    lineHeight: 14,
  },
  inputLoadingPlaceholder: {
    height: getMScale(26),
    marginTop: getVerticalScale(10),
    width: getMScale(130),
  },
});

export default styles;
