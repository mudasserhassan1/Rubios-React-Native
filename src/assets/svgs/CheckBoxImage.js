import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const CheckBoxImage = ({isChecked, width, height}) => {
  const renderInnerPart = () => {
    if (isChecked) {
      return (
        <>
          <Circle cx={7.5} cy={8} r={6.5} fill="#6AC7BD" stroke="#6AC7BD" strokeWidth={1.5} />
          <Path
            d="M5 8.16667L6.90909 10.5L11 5.5"
            stroke="#F5F1E9"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    }
    return <Circle cx={7.5} cy={8} r={6.5} stroke="#6AC7BD" strokeWidth={1.5} />;
  };
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      {renderInnerPart()}
    </Svg>
  );
};
export default CheckBoxImage;
