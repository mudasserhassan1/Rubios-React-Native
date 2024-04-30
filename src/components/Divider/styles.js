import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  line: {
    height: getMScale(1),
    backgroundColor: colors.primary_23,
  },
});

export default styles;
