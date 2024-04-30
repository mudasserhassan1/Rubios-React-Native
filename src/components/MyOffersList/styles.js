import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  flatListContainer: {
    paddingVertical: 16,
  },
  itemContainer: {
    width: 298,
    height: 271,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 298,
    height: 139,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  expiryDate: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  text: {
    marginVertical: 8,
    marginLeft: 8,
  },
});

export default styles;
