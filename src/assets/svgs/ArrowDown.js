import * as React from "react";
import Svg, {G, Path} from "react-native-svg";

const ArrowDown = (props) => (
    <Svg
        width={25}
        height={25}
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <G id="KeyboardArrowUpRounded">
            <Path
                id="Vector"
                d="M8.61875 15.2105L12.4988 11.3305L16.3787 15.2105C16.7688 15.6005 17.3988 15.6005 17.7888 15.2105C18.1788 14.8205 18.1788 14.1905 17.7888 13.8005L13.1988 9.21047C12.8088 8.82047 12.1788 8.82047 11.7888 9.21047L7.19875 13.8005C6.80875 14.1905 6.80875 14.8205 7.19875 15.2105C7.58875 15.5905 8.22875 15.6005 8.61875 15.2105Z"
                fill="#FFFDF9"
            />
        </G>
    </Svg>
);
export default ArrowDown;
