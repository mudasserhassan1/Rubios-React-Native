import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ChevronForward = ({color = '#052C42'}) => (
  <Svg width={10} height={16} viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M2.05417 15.0708L9.125 8L2.05417 0.929164L0.875 2.1075L6.76833 8L0.875 13.8925L2.05417 15.0708Z"
      fill={color}
    />
  </Svg>
);
export default ChevronForward;
