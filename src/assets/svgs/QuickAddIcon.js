import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const QuickAddIcon = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      id="Vector"
      d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM16.8 13.2H13.2V16.8C13.2 17.46 12.66 18 12 18C11.34 18 10.8 17.46 10.8 16.8V13.2H7.2C6.54 13.2 6 12.66 6 12C6 11.34 6.54 10.8 7.2 10.8H10.8V7.2C10.8 6.54 11.34 6 12 6C12.66 6 13.2 6.54 13.2 7.2V10.8H16.8C17.46 10.8 18 11.34 18 12C18 12.66 17.46 13.2 16.8 13.2Z"
      fill="#006DB7"
    />
  </Svg>
);
export default QuickAddIcon;
