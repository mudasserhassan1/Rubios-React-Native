import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = props => (
  <Svg
    width={14}
    height={12}
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M1.28516 7.0814C0.464844 6.31577 0 5.22202 0 4.07358V3.93687C0 2.0228 1.36719 0.382178 3.25391 0.0813965C4.51172 -0.137354 5.76953 0.272803 6.67187 1.1478L7 1.47593L7.32812 1.1478C8.20312 0.272803 9.48828 -0.137354 10.7187 0.0813965C12.6055 0.382178 14 2.0228 14 3.93687V4.07358C14 5.22202 13.5078 6.31577 12.6875 7.0814L7.73828 11.7025C7.54687 11.8939 7.27344 11.9759 7 11.9759C6.69922 11.9759 6.42578 11.8939 6.23437 11.7025L1.28516 7.0814Z"
      fill="#006DB7"
    />
  </Svg>
);
export default SVGComponent;