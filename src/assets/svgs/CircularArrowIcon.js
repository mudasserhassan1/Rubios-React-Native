import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CircularArrowIcon = ({color = '#052C42'}) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10ZM10 12.79V11H7C6.45 11 6 10.55 6 10C6 9.45 6.45 9 7 9H10V7.21C10 6.76 10.54 6.54 10.85 6.86L13.64 9.65C13.84 9.85 13.84 10.16 13.64 10.36L10.85 13.15C10.54 13.46 10 13.24 10 12.79Z"
      fill={color}
    />
  </Svg>
);
export default CircularArrowIcon;
