import {StyleSheet} from 'react-native';
import {appStyles} from '../../theme';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  bottomLineView: {
    alignSelf: 'center',
    borderBottomColor: 'black',
    height: '20%',
    width: '90%',
  },
});

export default styles;
