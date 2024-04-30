import {TouchableOpacity} from 'react-native';
import {colors} from '../../theme';
import {useEffect, useRef, useState} from 'react';
import CheckBoxImage from '../../assets/svgs/CheckBoxImage';
import RText from '../RText';
import {getMScale} from '../../theme/metrics';
import {isIos} from '../../utils/sharedUtils';
import {logToConsole} from "../../configs";

const CheckBox = ({
  checked,
  onValueChange,
  color = colors.primary,
  text,
  children,
  height = 13,
  width = 13,
  textSize = 'xs',
  textWeight = 'regular',
  style,
  textStyle,
  ...rest
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const checkBoxValueForScreenReader = useRef(isChecked);

  useEffect(() => {
    checkBoxValueForScreenReader.current = checked;
    setIsChecked(checked);
  }, [checked]);

  const onChange = () => {
    checkBoxValueForScreenReader.current = !isChecked;
    onValueChange?.(!isChecked);
  };

  return (
    <TouchableOpacity
      accessibilityRole={'checkbox'}
      accessible
      accessibilityHint={'toggle to change setting'}
      accessibilityState={isIos ? {checked: !!checked} : {}}
      activeOpacity={0.7}
      onPress={onChange}
      onAccessibilityTap={onChange}
      style={[{flexDirection: 'row', alignItems: 'center', width: '100%'}, style]}
      {...rest}>
      <CheckBoxImage isChecked={isChecked} height={height} width={width} />
      <RText
        numberOfLines={2}
        size={textSize}
        color={color}
        weight={textWeight}
        textStyle={[{marginStart: getMScale(10), width: '85%'}, textStyle]}>
        {text || children}
      </RText>
    </TouchableOpacity>
  );
};
export default CheckBox;
