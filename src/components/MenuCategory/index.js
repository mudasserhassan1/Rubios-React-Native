import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from './styles';
import RText from "../RText";
const MenuCategory = ({item, onPress, containerStyle, titleStyle, isSelected}) => {
  const {name = ''} = item || {};
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <RText textStyle={[styles.title, titleStyle]}>{name}</RText>
      <View
        style={[
          styles.bottomLineView,
          {
            borderBottomWidth: isSelected ? 2 : 0,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default MenuCategory;
