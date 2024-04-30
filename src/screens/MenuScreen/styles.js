import {StyleSheet} from 'react-native';
import {appStyles} from '../../theme';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  screen: appStyles.screen,
  container: {
    padding: 2,
  },
  itemContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: 'white',
    margin: 4,
  },
  title: {
    textTransform: 'uppercase',
    color: '#214f66',
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 20,
  },
  subTitle: {
    color: '#214f66',
    fontWeight: 'normal',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#214F66',
    height: 40,
    paddingRight: 12,
    paddingLeft: 12,
    width: '100%',
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: '70%',
    textTransform: 'capitalize',
  },
  viewTiming: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  cartCount: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'red',
    zIndex: 1,
    elevation: 1,
    position: 'absolute',
    marginTop: -5,
  },
  countText: {color: colors.white, fontSize: 8, fontWeight: 'bold'},
});

export default styles;
