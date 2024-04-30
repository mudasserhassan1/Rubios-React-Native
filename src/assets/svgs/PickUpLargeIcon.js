import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const PickUpLargeIcon = props => (
  <Svg
    width={90}
    height={90}
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={45} cy={45} r={45} fill="#FFCE38" />
    <Path
      d="M65.6816 61.2897C65.5821 60.9913 63.2445 40.9467 62.0507 35.4255C61.5036 32.7893 60.8569 30.1033 59.8621 27.6164C58.6185 24.4832 56.1316 22.9412 52.7495 22.9412C49.4666 22.9412 32.1576 24.9804 32.0582 25.03C29.6707 24.7812 27.2336 25.4278 25.7911 27.3181C23.0553 30.8994 25.8409 35.8735 30.3173 34.9779C32.307 34.5801 33.7991 32.2921 32.9536 30.3023C32.1081 28.2631 29.3227 28.3127 28.0791 29.9045C27.5319 30.601 28.4273 31.5956 29.0739 30.8994C30.2677 29.7056 32.0582 30.8994 31.0138 32.3915C30.417 33.237 29.2233 33.2869 28.3279 32.9882C25.8409 32.2422 26.3881 28.8103 28.278 27.666C29.9195 26.7211 32.1577 26.8701 33.9481 27.5167C34.0975 30.0037 33.5999 32.4906 33.1026 34.8781C32.456 38.0613 31.5606 41.1948 30.6156 44.3282C29.0736 49.3524 27.482 54.6739 24.9951 59.2995C24.5973 60.0456 24.9452 60.9906 25.791 61.2393C29.82 62.4331 33.5004 64.373 36.9821 66.5615C37.181 66.8599 37.5293 67.0588 37.977 67.0588C43.0005 66.9098 47.9743 66.7109 52.9483 65.8653C57.0767 65.2187 61.3541 64.3234 65.1344 62.4334C65.6815 62.2841 65.6316 61.2394 65.6815 61.2892L65.6816 61.2897ZM29.4217 59.8471C30.317 59.4493 31.2121 59.0512 32.1574 58.8027C32.3068 59.0515 33.6994 61.7374 33.749 61.8368C32.3564 61.0907 30.9138 60.3942 29.4217 59.8471ZM36.7831 63.0801C36.2858 62.0853 34.2961 57.9572 33.5002 57.2108C34.4951 55.2212 36.6338 45.2737 36.6833 42.4885C36.6833 41.4936 35.1414 41.2451 34.8929 42.2397C34.3457 44.9255 32.7043 54.5753 32.2071 56.6638C31.461 56.7137 29.0735 57.8576 28.5762 58.1064C30.516 53.978 31.8591 49.4516 33.1523 45.1242C34.1472 41.8912 35.0423 38.6581 35.6889 35.3257C36.0867 33.4853 36.4349 31.5455 36.5344 29.6057C37.3303 30.7995 37.4298 32.3415 37.4298 34.0325C37.4793 43.7316 37.2804 53.4306 36.7832 63.0804L36.7831 63.0801ZM52.2515 63.6772C47.974 64.2739 43.5975 64.6221 39.2701 64.5726C39.5684 58.2059 39.7673 51.8393 39.8172 45.4727C39.8671 42.1403 39.8172 38.8077 39.7673 35.5247C39.7175 33.0377 39.9167 30.1031 38.2254 28.0638C37.6782 27.4172 36.982 26.8204 36.1362 26.3229C40.8616 25.9749 45.4877 25.4278 50.1133 25.0795C51.5559 24.9801 53.0976 24.7812 54.4902 25.1294C56.5794 25.6267 57.5243 27.1191 58.1709 29.009C59.0164 31.5456 59.6135 34.132 60.1606 36.7184C61.205 42.0902 61.9015 47.5118 62.5481 52.9336C62.7969 55.1222 62.9958 57.3604 63.2446 59.549C63.2945 59.9468 63.2945 60.4444 63.344 60.9416C59.8622 62.4833 55.9826 63.1795 52.2523 63.6771L52.2515 63.6772Z"
      fill="#052C42"
    />
    <Path
      d="M57.326 39.1556C56.3311 39.9016 55.784 41.2447 54.5902 41.7919C54.0929 42.0406 53.8937 41.8913 53.4959 41.5431C52.8493 40.9959 52.9986 40.6975 53.446 40.0011C54.0427 39.0062 54.9381 38.1111 55.2864 36.967C55.4357 36.4697 54.8387 36.0716 54.4409 36.3204C53.0978 37.1163 51.6057 38.9068 51.2079 40.4488C51.0585 41.0954 51.2079 41.742 51.6057 42.2392C51.3569 42.4381 51.1084 42.6869 50.8596 42.9853C48.7209 41.2942 46.5822 39.6528 44.4435 37.9618C43.747 37.4147 42.5535 37.713 42.6031 38.7079C42.6529 40.3493 42.9014 41.9908 43.7469 43.4829C44.4434 44.6267 45.6368 46.0693 47.0793 45.9699C47.3777 45.92 47.7259 45.6216 47.6265 45.2734C47.2287 44.229 46.1839 43.6319 45.6368 42.5876C45.388 42.1399 45.239 41.6922 45.0897 41.1949C46.5818 42.3887 48.0739 43.5326 49.566 44.6767C49.5161 44.7762 47.4273 47.4621 46.4324 48.7553C45.537 49.9491 47.5267 51.0929 48.4221 49.9491C49.367 48.7057 51.3568 46.1193 51.3568 46.0694C52.5506 46.9648 53.7443 47.9098 54.9381 48.8052C56.0324 49.6507 57.1267 47.7608 56.0324 46.9153C54.8885 46.0698 53.7942 45.1744 52.6999 44.3289C52.8988 44.0801 53.0482 43.7817 53.1972 43.4833C53.2967 43.5332 53.3961 43.5828 53.4956 43.5828C54.7389 44.0305 56.0321 43.1351 56.9275 42.3395C57.5741 41.7427 58.519 40.8969 58.7679 40.0514C58.9175 39.4543 58.0225 38.6085 57.326 39.1557L57.326 39.1556Z"
      fill="#052C42"
    />
    <Path
      d="M56.4799 52.4361C56.1816 52.9333 55.8333 53.7293 55.2862 54.0276C54.5401 54.4254 53.9929 53.8782 53.3463 53.5799C52.6499 53.2316 51.9038 52.9333 51.1082 53.0826C50.3621 53.232 49.815 53.7791 49.4172 54.4257C48.9695 55.1222 48.6711 55.52 47.7261 55.1718C47.2289 54.9729 47.1294 54.8235 46.5823 54.7739C46.1845 54.7241 46.0352 55.1718 46.0352 55.4704C46.1845 56.6642 47.6267 57.5596 48.8205 57.4601C49.3177 57.4102 49.8154 57.2113 50.2131 56.8634C50.7104 56.4157 50.9096 55.5702 51.5063 55.3214C52.1529 55.0231 52.8494 55.7691 53.496 56.0179C54.0927 56.2667 54.6898 56.3661 55.3364 56.2667C56.729 55.9683 57.5745 54.6752 58.2711 53.5309C58.9669 52.3365 57.1765 51.2423 56.48 52.436L56.4799 52.4361Z"
      fill="#052C42"
    />
    <Path
      d="M55.5358 57.311C54.7898 57.8082 53.3971 57.311 52.5516 57.5099C51.6066 57.6592 50.6118 58.1066 50.015 58.853C49.5178 59.4996 50.1145 60.4445 50.96 60.0468C52.0543 59.4996 52.8004 59.1514 54.0436 59.3007C54.939 59.4002 55.7346 59.45 56.5306 58.9525C57.4755 58.256 56.5306 56.6145 55.5357 57.311L55.5358 57.311Z"
      fill="#052C42"
    />
  </Svg>
);
export default PickUpLargeIcon;