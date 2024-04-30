import {StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import RText from '../../components/RText';

const DeliveryAddress = ({address}) => {
  const {address1, address2, city, zip} = address || {};
  return (
    <View>
      <RText text={'YOUR DELIVERY ADDRESS'} preset={'bold'} textStyle={styles.headingTitle} />
      <View style={styles.addressWrapper}>
        {address1 ? <RText text={address?.address1} textStyle={styles.addressStyle} /> : null}
        {address2 ? <RText text={address?.address2} textStyle={styles.addressStyle} /> : null}
        <RText text={`${city + ', ' + zip}`} textStyle={styles.addressStyle} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headingTitle: {
    fontSize: 16,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  addressStyle: {
    fontSize: 16,
    color: colors.black,
  },
  addressWrapper: {
    marginVertical: 10,
  },
});

export default DeliveryAddress;
