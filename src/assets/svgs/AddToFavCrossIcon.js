import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const AddToFavCrossIcon = props => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={16} cy={16} r={16} fill="white" fillOpacity={0.76} />
    <Path
      d="M22.3007 9.70973C21.9107 9.31973 21.2807 9.31973 20.8907 9.70973L16.0007 14.5897L11.1107 9.69973C10.7207 9.30973 10.0907 9.30973 9.7007 9.69973C9.3107 10.0897 9.3107 10.7197 9.7007 11.1097L14.5907 15.9997L9.7007 20.8897C9.3107 21.2797 9.3107 21.9097 9.7007 22.2997C10.0907 22.6897 10.7207 22.6897 11.1107 22.2997L16.0007 17.4097L20.8907 22.2997C21.2807 22.6897 21.9107 22.6897 22.3007 22.2997C22.6907 21.9097 22.6907 21.2797 22.3007 20.8897L17.4107 15.9997L22.3007 11.1097C22.6807 10.7297 22.6807 10.0897 22.3007 9.70973Z"
      fill="black"
    />
  </Svg>
);
export default AddToFavCrossIcon;