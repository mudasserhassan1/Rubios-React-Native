import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ImageComponent from '../ImageComponent/ImageComponent';

const SocialButtonWrapper = ({
  imageName,
  containerStyle,
  imageStyle,
  onPress,
  disabled,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={'button'}
      style={[styles.container, containerStyle]}
      {...rest}>
      <ImageComponent source={imageName} style={[styles.imageStyle, imageStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  imageStyle: {width: 35, height: 35},
});

export default SocialButtonWrapper;
