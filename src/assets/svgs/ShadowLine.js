import Svg, { LinearGradient, Defs, Stop, Rect } from 'react-native-svg'
import * as React from 'react';
const ShadowLine = props => (
  <Svg
    width={28}
    height={4}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#e6e6e6" stopOpacity="1" />
        <Stop offset="1" stopColor="#e6e6e6" stopOpacity="0.01" />
      </LinearGradient>
    </Defs>
    <Rect height="100" width="100%" fill="url(#grad)" />
  </Svg>
);
export default ShadowLine;
