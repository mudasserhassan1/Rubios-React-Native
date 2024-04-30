import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const DeliveryIConSmall = props => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 37 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={18.5} cy={18.5} r={18.5} fill="#FFCE38" />
    <Path
      d="M7.87548 13.9774C7.46698 15.643 8.21714 17.3226 9.48563 18.3912C9.42407 19.0301 9.29618 19.6785 9.26319 20.3078C9.21812 21.1851 9.17203 22.0674 9.18462 22.9462C9.19244 23.4752 9.1302 24.1419 9.72373 24.3669C10.1256 24.5191 10.6812 24.4832 11.1633 24.4167C11.3434 25.5125 12.2235 26.431 13.3714 26.6281C14.8493 26.8818 16.2773 25.9194 16.6755 24.4926C17.2421 24.6228 17.9685 24.5429 18.4317 24.5569C19.4877 24.5898 20.5667 24.6881 21.6204 24.6007C21.6303 24.5997 21.6386 24.597 21.6485 24.596C21.8902 25.6106 22.7354 26.4417 23.8199 26.6279C25.1887 26.8629 26.5154 26.0543 27.0202 24.7997C27.0663 24.8053 27.1139 24.8086 27.1656 24.8053C27.6931 24.7751 28.2208 24.7439 28.7483 24.7137C29.1487 24.69 29.4225 24.4096 29.4505 24.0115C29.5269 22.9446 29.607 21.878 29.675 20.8112C29.7189 20.1262 29.9221 19.2554 29.3439 18.7364C28.8354 18.2787 28.0504 18.4449 27.4873 18.0245C26.8521 17.5509 26.4229 16.8245 26.0094 16.1648C25.3083 15.047 24.4443 13.0833 22.9498 12.9785C21.1519 12.8528 19.2654 12.9292 17.452 13.0861C16.6214 10.7802 13.2962 10.3152 11.1701 10.3762C10.6266 10.392 10.3773 10.8598 10.4241 11.2794C10.2188 11.387 10.0237 11.5033 9.84533 11.6127C8.92545 12.1778 8.14161 12.8916 7.8753 13.9774L7.87548 13.9774ZM15.4169 24.3739C15.1007 25.209 14.2108 25.7074 13.3373 25.4625C12.4838 25.2227 11.9312 24.2925 12.202 23.4281C12.3727 22.8833 12.7184 22.6029 13.1397 22.4228C13.2375 22.6425 13.4378 22.807 13.7468 22.7912C14.6915 22.743 15.8323 23.274 15.4168 24.3739L15.4169 24.3739ZM25.8656 24.3739C25.5495 25.209 24.6596 25.7074 23.7861 25.4625C22.9325 25.2227 22.38 24.2925 22.6507 23.4281C22.8215 22.8833 23.1672 22.6029 23.5885 22.4228C23.6863 22.6425 23.8866 22.807 24.1956 22.7912C25.1403 22.743 26.2811 23.274 25.8656 24.3739L25.8656 24.3739ZM21.7758 14.1794C22.1232 14.1936 22.6843 14.1082 23.0055 14.2432C23.3907 14.4044 23.6727 15.0025 23.8961 15.3296C24.3199 15.9494 24.6993 16.595 25.1002 17.2297C25.2847 17.5217 25.4811 17.8154 25.6952 18.095C25.3631 18.0998 25.0332 18.1071 24.7151 18.0998C23.8077 18.0799 22.8963 18.0625 21.9921 17.9751C21.7048 17.9472 21.419 17.8605 21.1349 17.8369C21.0953 17.8336 21.0637 17.8285 21.0382 17.8227C20.9994 17.5751 20.9444 17.3282 20.9079 17.0804C20.763 16.1003 20.7126 15.0124 20.271 14.1051C20.7722 14.1344 21.2745 14.159 21.7757 14.1794L21.7758 14.1794ZM21.0265 17.8204C20.8904 17.7853 20.9772 17.7289 21.0265 17.8204V17.8204ZM17.6366 13.8823C18.2572 13.9541 18.8799 14.0101 19.5032 14.0551C19.6388 15.2991 19.6894 16.5389 19.8114 17.7857C19.9051 18.7408 20.3675 19.0443 21.2641 19.1974C22.2134 19.3593 23.19 19.377 24.1504 19.4056C25.1483 19.4348 27.491 19.5872 27.6175 19.6323C27.8247 19.7059 28.2428 19.7008 28.3401 19.8515C28.4663 20.0467 28.2616 20.8865 28.2434 21.1314C28.1889 21.8708 28.1401 22.6106 28.0912 23.35C27.7854 23.3687 27.4806 23.3878 27.1748 23.4065C26.9002 22.1689 25.4784 21.429 24.1953 21.3904C23.9854 21.3842 23.8269 21.4601 23.7149 21.5776C22.8358 21.6587 21.9702 22.439 21.696 23.24C21.6709 23.2368 21.6472 23.2306 21.6202 23.2296C20.5134 23.1704 19.3847 23.3102 18.2796 23.3777C17.8458 23.4046 17.2426 23.3629 16.7385 23.476C16.5025 22.1973 15.053 21.4295 13.7464 21.3904C13.5365 21.3843 13.378 21.4601 13.266 21.5776C12.4303 21.6545 11.6078 22.3637 11.2927 23.1213C11.0226 23.1208 10.7296 23.1619 10.4507 23.1601C10.4266 22.8313 10.4545 22.4793 10.4303 22.1706C10.3902 21.6529 10.3381 21.1361 10.2915 20.6186C10.2371 20.0081 10.1005 19.3878 9.99953 18.771C10.0136 18.7804 10.0274 18.7909 10.0419 18.8003C13.4144 20.9326 18.1401 17.7569 17.6368 13.8824L17.6366 13.8823ZM11.2345 11.9341C12.9666 11.8802 16.1807 11.9121 16.2856 14.2255C16.3652 15.9828 14.9619 17.6394 13.292 18.0539C11.6966 18.4501 9.93201 17.5459 9.24514 16.0643C8.76741 15.0334 8.90654 13.9028 9.68425 13.0656C10.1507 12.5632 10.6667 12.2074 11.2344 11.9341L11.2345 11.9341Z"
      fill="#052C42"
    />
    <Path
      d="M12.2115 16.0355C13.0465 15.9816 13.9255 15.9362 14.74 15.7342C15.5019 15.5453 15.3663 14.2376 14.5495 14.3288C14.0021 14.3902 13.4601 14.4907 12.9152 14.5747C12.9817 13.9735 13.1218 13.3711 13.0288 12.7773C12.9875 12.5142 12.605 12.5038 12.4853 12.7065C12.0686 13.411 12.0565 14.3056 11.6212 15.0074C11.3598 15.4301 11.6946 16.0691 12.2115 16.0355Z"
      fill="#052C42"
    />
  </Svg>
);
export default DeliveryIConSmall;
