import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

const styles = StyleSheet.create({
  parentView: {
    height: 100,
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  categoryImage: {height: 70, width: 70, resizeMode: 'cover'},
  categoryText: {marginStart: 10, color: colors.secondaryColor},
  completeYourMealText: {
    textTransform: 'uppercase',
    textAlign: 'center',
    marginVertical: 5,
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: 'orange',
  },
});

export default styles;
