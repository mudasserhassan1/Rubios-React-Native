import {Image, TouchableOpacity} from 'react-native';
import {colors} from '../../theme';
import {images} from '../../assets';
import RText from '../RText';
import React from 'react';
import styles from './styles';

const UpsellsCategoryItem = ({type, index, onPress, title}) => {
  return (
    <>
      <TouchableOpacity style={styles.parentView} onPress={() => onPress?.(type)}>
        <Image source={images[type?.toLowerCase()]} style={styles.categoryImage} />
        <RText text={title} preset={'bold'} textStyle={styles.categoryText} />
      </TouchableOpacity>
      {index === 0 ? (
        <RText
          text={'Complete your Meal'}
          preset={'bold'}
          color={colors.secondaryColor}
          textStyle={styles.completeYourMealText}
        />
      ) : null}
    </>
  );
};
export default UpsellsCategoryItem;
