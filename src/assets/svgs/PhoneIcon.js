import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const PhoneIcon = props => (
  <Svg
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M13.2234 10.0807L11.2126 9.85115C10.7297 9.79573 10.2547 9.96198 9.91425 10.3024L8.45758 11.7591C6.21717 10.6191 4.3805 8.79031 3.2405 6.54198L4.70508 5.07739C5.0455 4.73698 5.21175 4.26198 5.15633 3.77906L4.92675 1.78406C4.83175 0.984479 4.15883 0.382812 3.35133 0.382812H1.98175C1.08717 0.382812 0.342999 1.12698 0.398416 2.02156C0.817999 8.7824 6.22508 14.1816 12.978 14.6011C13.8726 14.6566 14.6167 13.9124 14.6167 13.0178V11.6482C14.6247 10.8486 14.023 10.1757 13.2234 10.0807Z"
      fill="#052C42"
      fillOpacity={0.5}
    />
  </Svg>
);
export default PhoneIcon;
