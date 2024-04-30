import {View} from 'react-native';
import {colors} from '../../theme';
import React from 'react';

const HorizontalLine = ({style}) => (
  <View
    style={[
      {
        height: 1,
        backgroundColor: colors.primary_23,
        width: '100%',
        alignSelf: 'center',
        // marginTop: 8,
      },
      style,
    ]}
  />
);
export default HorizontalLine;
