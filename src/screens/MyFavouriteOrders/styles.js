import {StyleSheet} from 'react-native';
import { getMScale, getVerticalScale } from "../../theme/metrics";
import {colors} from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: getMScale(10),
  },
  itemContainer: {
    marginHorizontal: getMScale(10),
    padding: getMScale(10),
    borderRadius: getMScale(5),
    elevation: 3,
    marginBottom: getMScale(10),
    backgroundColor: colors.white,
  },
  reorder: {
    marginTop: getMScale(5),
    color: colors.primary,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  restaurantName: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16,
    marginEnd: getMScale(20),
    marginBottom: 3,
  },

  productText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: '500',
  },
  lastOrder: {
    color: colors.black,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
  },
  iconContainer: {
    top: 10,
    end: 10,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  modal: {
    elevation: 3,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: getMScale(15),
    justifyContent: 'center',
  },

  modalTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  favOrderTitle: {
    marginTop: 4,
    color: colors.black,
    fontSize: 12,
    fontWeight: '500',
  },
  productContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  modalProducList: {
    width: '80%',
    paddingEnd: 5,
  },
  bottomButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButtonContainer2: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    width: '20%',
    textAlign: 'right',
    color: colors.black,
    fontSize: 14,
    fontWeight: '500',
  },
  modalButton: {
    borderRadius:5,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 8,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  modalButton2: {
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: colors.primary,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  textDeleteFav: {
    width: '100%',
    fontWeight: '600',
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
  },
  emptyWrapper: {
    marginTop: getMScale(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    marginHorizontal:getMScale(50),
    lineHeight:16,
    letterSpacing:0.15
  },
  orderNowBtn: {width: '75%', marginTop: getVerticalScale(40)},
});

export default styles;
