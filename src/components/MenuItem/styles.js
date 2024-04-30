import {StyleSheet} from 'react-native';
import {appStyles} from '../../theme';
import {getMScale} from '../../theme/metrics';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  infoContainer: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    color: '#214f66',
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 20,
    paddingBottom: 4,
  },
  subTitle: {
    color: '#214f66',
    fontWeight: 'normal',
    fontSize: 13,
    paddingBottom: 4,
  },
  productImage: {
    width: 120,
    height: 120,
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'red',
  },
  infoImage: {
    width: '100%',
    height: getMScale(390),
  },
  bottomView: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  caloriesTitle: {
    color: '#0075BF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
