import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {getMScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  content: {
    padding: 15,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  heading: {
    textTransform: 'uppercase',
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: getMScale(10),
  },
  description: {
    marginTop: getMScale(3),
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
  },
  qrcodeContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderColor: colors.black,
    borderWidth: 1,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: getMScale(20),
    alignSelf: 'center',
    flexDirection: 'column',
  },
  image: {
    marginVertical: getMScale(15),
    alignSelf: 'center',
  },
});

export default styles;
