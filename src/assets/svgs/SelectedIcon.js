import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const SelectedIcon = props => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={14.5} cy={13.5} r={9.5} fill="#6AC7BD" stroke="#6AC7BD" strokeWidth={1.5} />
    <Path
      d="M10.8457 13.7436L13.6359 17.1539L19.6149 9.84619"
      stroke="#F5F1E9"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SelectedIcon;
