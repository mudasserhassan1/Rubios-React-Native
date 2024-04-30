import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const SalsaRightIcon = (props) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Rect
            x={24}
            y={24}
            width={24}
            height={24}
            rx={12}
            transform="rotate(-180 24 24)"
            fill="#F5F1E9"
        />
        <Path
            d="M6.27383 12.83L15.9537 12.83L13.8369 15.2089C13.5503 15.5311 13.5503 16.0515 13.8369 16.3736C14.1236 16.6958 14.5866 16.6958 14.8733 16.3736L18.2469 12.5822C18.5336 12.26 18.5336 11.7397 18.2469 11.4175L14.8733 7.62608C14.5866 7.30393 14.1236 7.30393 13.8369 7.62608C13.5503 7.94822 13.5503 8.46862 13.8369 8.79076L15.9537 11.178L6.27383 11.178C5.86959 11.178 5.53884 11.5497 5.53884 12.004C5.53884 12.4583 5.86959 12.83 6.27383 12.83Z"
            fill="#77C043"
        />
    </Svg>
);
export default SalsaRightIcon;
