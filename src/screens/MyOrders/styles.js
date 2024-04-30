import {StyleSheet} from 'react-native';
import {getMScale, getVerticalScale} from '../../theme/metrics';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: getMScale(2),
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
    borderRadius: 5,
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

  datebgStyle: {
    height: getMScale(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateStyle: {
    alignSelf: 'flex-start',
    lineHeight: 17,
    letterSpacing: 0.15,
    marginStart: getMScale(16),
  },
  orderCompletedateStyle: {
    alignSelf: 'center',
    lineHeight: 17,
    letterSpacing: 0.15,
  },
  orderItemText: {
    lineHeight: 17,
    letterSpacing: 0.15,
    marginStart: getMScale(16),
  },
  greyHorizontalLineStyle: {
    height: 1,
    backgroundColor: colors.greyLine,
    marginBottom: getVerticalScale(16),
    marginHorizontal: getMScale(15),
  },
  addToFavWrapper_: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getMScale(32),
  },
  reOrderBtn: {
    marginTop: getMScale(24),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  sheetStyle: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    height: getMScale(110),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: colors.black,
    elevation: 3,
  },

  infoText: {
    lineHeight: 16,
    letterSpacing: 0.15,
    marginStart: getMScale(40),
    marginEnd: getMScale(70),
    marginVertical: getMScale(16),
  },
  orderTotalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getMScale(10),
    marginBottom: getMScale(18),
    marginHorizontal: getMScale(16),
  },
  estimatedTax: {
    marginTop: getMScale(8),
  },
  totalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getMScale(3),
    marginHorizontal: getMScale(16),
  },
  emptyWrapper: {
    marginTop: getMScale(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextStyle: {
    marginTop: getMScale(24),
    textAlign: 'center',
    marginHorizontal: getMScale(50),
    lineHeight: 16,
    letterSpacing: 0.15,
  },
  orderNowBtn: {width: '75%', marginTop: getVerticalScale(40)},
});

export default styles;
