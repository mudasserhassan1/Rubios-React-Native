import { Platform, StyleSheet } from "react-native";
import {colors} from '../../theme';
import { getMScale, getScale, getVerticalScale } from "../../theme/metrics";

const styles = StyleSheet.create({
  circularItem: {
    flex: 1,
    // width: getMScale(130),
    alignItems: 'center',
    marginBottom: getVerticalScale(37),
  },
  circularView: {
    width: getMScale(66),
    height: getMScale(66),
    borderRadius: getMScale(33),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  itemName: {
    marginTop: getMScale(8),
    lineHeight: 17.5,
    letterSpacing: 0.15,
    textAlign: 'center',
    minHeight: getMScale(30),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  iconContainer: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        right: getScale(20),
      },
      android: {
        right: getMScale(15),
      },
    }),
    top: 3,
    zIndex: 1,
  },
  quantitySelector: {
    backgroundColor: colors.white,
    // width: getMScale(87),
    height: getVerticalScale(26),
    position: 'absolute',
    top: 0,
    zIndex: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 14,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.11,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  rightQtyView: {
    borderLeftColor: 'rgba(142, 142, 147, 0.3)',
    borderLeftWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {alignSelf: 'center', lineHeight: 22},
  leftQtyView: {
    borderRightColor: 'rgba(142, 142, 147, 0.3)',
    borderRightWidth: 1,
    paddingHorizontal: 10,
  },
  listHeader: {textTransform: 'uppercase'},
});

export default styles;
