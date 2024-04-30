import {TouchableOpacity, View} from 'react-native';
import styles from '../UpsellsItemCard/styles';
import RText from '../RText';
import {colors} from '../../theme';
import React from 'react';

const QuantitySelector = ({onPlusPress, onMinusPress, value, disabled}) => {
  return (
    <View style={styles.quantitySelectorParent}>
      <RText preset={'bold'} textStyle={{width: '25%', color: colors.primary}} text={'QTY'} />
      <View style={styles.selectorView}>
        <TouchableOpacity
          disabled={disabled}
          style={styles.selectorCellView}
          onPress={onMinusPress}>
          <RText preset={'bold'} text={'-'} />
        </TouchableOpacity>
        <View style={styles.selectorValueView}>
          <RText preset={'bold'} text={String(value)} />
        </View>
        <TouchableOpacity disabled={disabled} style={styles.selectorCellView} onPress={onPlusPress}>
          <RText preset={'bold'} text={'+'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default QuantitySelector;
