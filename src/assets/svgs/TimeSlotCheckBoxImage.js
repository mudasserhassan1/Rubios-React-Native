import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const CheckBoxImage = ({isChecked, width, height}) => {
  const renderInnerPart = () => {
    if (isChecked) {
      return (
        <>
          <Circle opacity={0.5} cx={9.5} cy={10} r={5.5} fill="#6AC7BD" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.5 2.5C5.35786 2.5 2 5.85786 2 10C2 14.1421 5.35786 17.5 9.5 17.5C13.6421 17.5 17 14.1421 17 10C17 5.85786 13.6421 2.5 9.5 2.5ZM0 10C0 4.75329 4.25329 0.5 9.5 0.5C14.7467 0.5 19 4.75329 19 10C19 15.2467 14.7467 19.5 9.5 19.5C4.25329 19.5 0 15.2467 0 10Z"
            fill="#6AC7BD"
          />
        </>
      );
    }
    return (
      <>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.5 2.5C5.35786 2.5 2 5.85786 2 10C2 14.1421 5.35786 17.5 9.5 17.5C13.6421 17.5 17 14.1421 17 10C17 5.85786 13.6421 2.5 9.5 2.5ZM0 10C0 4.75329 4.25329 0.5 9.5 0.5C14.7467 0.5 19 4.75329 19 10C19 15.2467 14.7467 19.5 9.5 19.5C4.25329 19.5 0 15.2467 0 10Z"
          fill="#052C42"
          fillOpacity={0.23}
        />
        <Circle cx={9.5} cy={10} r={5.5} fill="#A7C2D1" fillOpacity={0.23} />
      </>
    );
  };
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      {renderInnerPart()}
    </Svg>
  );
};
export default CheckBoxImage;
