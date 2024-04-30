import {ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBoxImage from '../../assets/svgs/CheckBoxImage';
import {colors} from '../../theme';
import styles from '../RButton/styles';
import {getMScale} from '../../theme/metrics';
import {logToConsole} from "../../configs";

const CheckBox = ({checked, onValueChange, disabled, height, width, loading}) => {
  const [isChecked, setIsChecked] = useState(checked);
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const onChange = () => {
    onValueChange?.(!isChecked);
  };
  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={colors.secondary}
          style={{height: getMScale(20), width: getMScale(20), alignSelf: 'center'}}
        />
      ) : (
        <TouchableOpacity
          accessible={false}
          disabled={!!disabled}
          activeOpacity={0.7}
          onPress={onChange}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBoxImage isChecked={checked} height={height} width={width} />
        </TouchableOpacity>
      )}
    </>
  );
};
export default CheckBox;
