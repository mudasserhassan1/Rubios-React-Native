import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';
const YellowEllipse = props => (
  <Svg
    width={51}
    height={51}
    viewBox="0 0 51 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={25.5} cy={25.5} r={25.5} fill="#FFCE38" />
  </Svg>
);
export default YellowEllipse;
