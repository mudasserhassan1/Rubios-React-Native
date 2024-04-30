import {StyleSheet} from 'react-native';
import { getMScale, SCREEN_WIDTH } from "../../theme/metrics";
import {colors} from '../../theme';

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    height: '100%',
  },
  headerText: {
    textTransform: 'uppercase',
    width: '60%',
  },
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: getMScale(30),
    marginBottom: getMScale(70),
  },
  button: {width: getMScale(226), height: getMScale(42), alignSelf: 'center'},
  cancelButton: {width: '35%'},
  buttonTitleStyle: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontSize: 14,
  },
});
export default styles;
