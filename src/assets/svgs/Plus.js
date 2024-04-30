import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const PlusIcon = props => (
  <Svg
    width={10}
    height={10}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      id="Vector"
      d="M5 0C4.45 0 4 0.45 4 1V4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6H4V9C4 9.55 4.45 10 5 10C5.55 10 6 9.55 6 9V6H9C9.55 6 10 5.55 10 5C10 4.45 9.55 4 9 4H6V1C6 0.45 5.55 0 5 0Z"
      fill="white"
    />
  </Svg>
);
export default PlusIcon;
