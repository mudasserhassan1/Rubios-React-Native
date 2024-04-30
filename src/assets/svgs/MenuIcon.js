import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const MenuIcon = props => (
  <Svg
    width={16}
    height={13}
    viewBox="0 0 16 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={16} height={3} rx={1.5} fill="#052C42" />
    <Rect y={5} width={16} height={3} rx={1.5} fill="#052C42" />
    <Rect y={10} width={16} height={3} rx={1.5} fill="#052C42" />
  </Svg>
);
export default MenuIcon;
