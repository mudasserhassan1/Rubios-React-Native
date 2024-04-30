import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    zIndex: 999,
    flex: 1,
  },
  headerText: {
    textTransform: 'uppercase',
    fontSize: 20,
    marginVertical: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    marginTop: 40,
    width: '100%',
  },
  button: {width: '60%', height: 42, alignSelf: 'center',},
  buttonTitleStyle: {
    color: colors.primary,
    textTransform: 'uppercase',
    fontSize: 14,
  },
});
export default styles;
