import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import { getVerticalScale } from "../../theme/metrics";

const styles = StyleSheet.create({
  paymentViewParent: {
    paddingHorizontal: 0,
  },
  headingTitle: {
    fontSize: 20,
    color: '#214F66',
    textTransform: 'uppercase',
  },
  remainingAmountStyle: {
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
  addCreditCardButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 30,
    width: '100%',
    marginTop: getVerticalScale(20),
  },
  buttonTitleStyle: {
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  addGiftCardView: {alignSelf: 'center', marginTop: getVerticalScale(20)},
  addGiftCardText: {textDecorationLine: 'underline'},
});

export default styles;
