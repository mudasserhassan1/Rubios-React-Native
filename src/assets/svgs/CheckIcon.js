import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CheckIcon = props => (
  <Svg
    width={19}
    height={20}
    viewBox="0 0 19 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.00162 16.9988C7.00095 16.9994 6.99986 16.9994 6.99919 16.9988L1.83964 11.7319C1.37315 11.2558 1.37315 10.4939 1.83964 10.0178C2.31971 9.5277 3.10863 9.52748 3.58898 10.0173L7.0004 13.4957C7.00141 13.4967 7.00141 13.4984 7.0004 13.4994L16.4113 3.89287C16.8914 3.40275 17.6805 3.40275 18.1606 3.89287C18.627 4.36891 18.627 5.13049 18.1607 5.60656L8.71446 15.2503L7.00162 16.9988Z"
      fill="#052C42"
      fillOpacity={0.23}
    />
  </Svg>
);
export default CheckIcon;
