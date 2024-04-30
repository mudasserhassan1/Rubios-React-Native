import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import { getMScale, getVerticalScale } from "../../theme/metrics";

const styles = StyleSheet.create({
  parent: {flex: 1, backgroundColor: colors.white},
  ccListHeader: {marginVertical: getMScale(16), marginStart: getMScale(15)},
  gcListHeader: {marginStart: getMScale(15), marginTop: getMScale(10)},
  gcListContentContainer: {
    marginTop: getMScale(10),
    marginBottom: 0,
    paddingEnd: getMScale(15),
    paddingBottom: getVerticalScale(24),
  },
  gcListDivider: {
    marginBottom: getVerticalScale(24),
    width: '90%',
    alignSelf: 'center',
  },
  container: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
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
  addressTextStyle: {
    paddingLeft: 10,
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
  creditCardTextStyle: {
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 18,
  },
  expiryDateTextStyle: {
    paddingTop: 7,
    paddingLeft: 10,
    fontSize: 18,
  },
  ccGiftTextStyle: {
    fontSize: 18,
    color: colors.grey2,
  },
  listHeaderWrapper:{
    margin: 10,
    paddingTop: 10,
  },
  bottomMostView: {
    marginHorizontal: getMScale(15),
    backgroundColor: colors.white,
    paddingStart: getMScale(18),
    paddingEnd: getMScale(15),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 7,
    shadowOpacity: 0.1,
    shadowColor: colors.black,
    elevation: 3,
    borderRadius: getMScale(15),
    marginBottom: getMScale(60),
  },
  addNewPaymentMethodTitle: {marginTop: getMScale(20), lineHeight: getMScale(18)},
  descriptionText: {lineHeight: getMScale(18), marginBottom: getMScale(18)},
});

export default styles;
