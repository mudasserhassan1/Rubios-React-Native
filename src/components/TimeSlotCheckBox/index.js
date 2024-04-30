import {TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import TimeSlotCheckBoxImage from '../../assets/svgs/TimeSlotCheckBoxImage';

const TimeSlotCheckBox = ({checked, onValueChange, height, width}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const onChange = () => {
    onValueChange?.(!isChecked);
  };
  return (
    <TouchableOpacity
      accessible={false}
      activeOpacity={0.7}
      onPress={onChange}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <TimeSlotCheckBoxImage isChecked={checked} height={height} width={width} />
    </TouchableOpacity>
  );
};
export default TimeSlotCheckBox;
