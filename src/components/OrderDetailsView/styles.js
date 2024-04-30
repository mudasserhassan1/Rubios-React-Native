import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getScale, getVerticalScale} from '../../theme/metrics';
import {FONT_WEIGHT} from '../RText/constants';

const styles = StyleSheet.create({
  orderDetailView: {
    flex: 1,
  },
  itemView: {
    // marginLeft: 20,
    // marginRight: 20,
    // marginTop: 10,
  },
  itemInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetailTitle: {
    ...FONT_WEIGHT.semiBold,
    fontSize: getScale(14),
    lineHeight: 16,
    color: colors.primary,
    width: '80%',
  },
  orderDetailTitleValue: {
    ...FONT_WEIGHT.semiBold,
    fontSize: getScale(14),
    lineHeight: 16,
    color: colors.primary,
    width: '20%',
    textAlign: 'right',
  },
  itemSubTitle: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 20,
    // marginRight: 20,
    marginTop: 8,
  },
  estimatedTaxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginLeft: 20,
    // marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  estimatedTaxTitle: {
    fontSize: 14,
    color: colors.primary,
    ...FONT_WEIGHT.regular,
    // marginTop: getMScale(8),
  },
  headingTitle: {
    fontSize: 20,
    color: colors.primary,
  },
  itemViewLine: {
    marginTop: 10,
    height: 2,
    color: colors.primary,
    marginLeft: 20,
    marginRight: 20,
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginVertical: getVerticalScale(16),
  },
  totalTextStyle: {
    fontSize: 20,
    letterSpacing: 0.15,
    lineHeight: 22,
    color: colors.primary,
    ...FONT_WEIGHT.semiBold,
  },
  discountLabel: {
    ...FONT_WEIGHT.regular,
    fontSize: 14,
    color: colors.primary,
  },
  discountValue: {
    ...FONT_WEIGHT.regular,
    color: colors.red,
    fontSize: 14,
  },
});

export default styles;
