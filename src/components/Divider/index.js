import {View} from 'react-native';
import styles from './styles';
import React from 'react';

const Divider = ({style}) => {
  return <View style={[styles.line, style]} />;
};

export default React.memo(Divider);
