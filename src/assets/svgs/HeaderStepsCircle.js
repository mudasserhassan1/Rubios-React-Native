import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const HeaderStepsCircle = ({activeStep}) => {
  const renderActiveCirclePath = () => {
    if (activeStep === '0') {
      return (
        <Path
          d="M19 2C22.1565 2 25.2574 2.83003 27.9918 4.40683C30.7262 5.98363 32.9979 8.25176 34.579 10.9837C36.1601 13.7156 36.995 16.8153 37 19.9717C37.0049 23.1282 36.1798 26.2305 34.6073 28.9673"
          stroke="#052C42"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    if (activeStep === '1' || activeStep === '2') {
      return (
        <Path
          d="M19 2C22.1613 2 25.2668 2.83255 28.0041 4.4139C30.7414 5.99524 33.014 8.2696 34.5932 11.0082C36.1724 13.7467 37.0025 16.8529 37 20.0141C36.9975 23.1754 36.1625 26.2802 34.579 29.0163C32.9955 31.7524 30.7194 34.0232 27.9796 35.6002C25.2398 37.1773 22.133 38.0049 18.9717 38C15.8105 37.995 12.7063 37.1576 9.97145 35.5719C7.23662 33.9863 4.96762 31.7084 3.39273 28.9673"
          stroke="#052C42"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
    if (activeStep === '3') {
      return (
        <Path
          d="M20 2C24.2859 2 28.4311 3.52925 31.6901 6.31269C34.9491 9.09613 37.1079 12.9511 37.7784 17.1842C38.4488 21.4173 37.5869 25.7507 35.3475 29.405C33.1082 33.0593 29.6384 35.7946 25.5623 37.119C21.4862 38.4434 17.0713 38.27 13.1117 36.6298C9.15208 34.9897 5.90762 31.9906 3.96188 28.1718C2.01614 24.3531 1.49683 19.9654 2.49734 15.798C3.49785 11.6305 5.95253 7.95686 9.41986 5.43769"
          stroke="#052C42"
          strokeWidth={3}
          strokeLinecap="round"
        />
      );
    }
  };
  return (
    <Svg width={39} height={39} viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx={19}
        cy={20}
        r={18}
        stroke="#052C42"
        strokeOpacity={0.5}
        strokeWidth={2}
        strokeDasharray="4 4"
      />
      {renderActiveCirclePath()}
    </Svg>
  );
};
export default HeaderStepsCircle;
