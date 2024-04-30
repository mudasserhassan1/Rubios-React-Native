import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const MyOrdersSmallIcon = props => (
  <Svg
    width={51}
    height={51}
    viewBox="0 0 51 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle cx={25.5} cy={25.5} r={25.5} fill="#FFCE38" />
    <Path
      d="M15.005 24.7226C15.2744 27.0274 15.4241 29.0032 15.6934 31.1283C15.9029 32.8945 15.8729 34.9599 16.5016 36.6361C17.1302 38.3124 18.5971 38.4321 20.1834 38.4621C22.4882 38.5219 24.8231 38.4921 27.1578 38.4921H30.4504C31.3186 38.4921 32.1865 38.4323 32.8751 37.8335C33.6234 37.205 34.1923 36.1573 34.4017 35.1995C34.7908 33.4932 34.9405 31.6972 35.21 29.9612C35.4794 28.2849 35.7488 26.6086 36.0183 24.9622C36.1081 24.4534 35.6591 24.1241 35.1802 24.3336C34.8809 24.4533 34.5814 24.5432 34.2522 24.6031C35.1203 22.1185 35.7787 19.5443 36.1978 16.94C36.4673 15.2037 36.9461 12.0607 34.282 12.0008C31.8274 11.941 30.4206 14.9344 29.5224 16.7604C29.1633 17.4788 28.834 18.227 28.5345 18.9455C28.0555 18.5563 27.457 18.2571 27.2174 17.8379C27.3073 17.778 27.427 17.6882 27.5467 17.6283C27.7262 17.5086 27.876 17.2392 27.7861 17.0296C27.5467 16.3111 27.2773 15.6228 27.0378 14.9044C26.948 14.6051 26.7085 14.5152 26.4093 14.5452C24.6732 14.8147 23.0866 15.5031 21.5003 16.2215C21.2907 16.3114 21.201 16.6106 21.2609 16.8202C21.4404 17.5387 21.68 18.2271 21.8894 18.9455C21.9793 19.2447 22.2786 19.3945 22.5778 19.3346C22.6677 19.3046 22.7874 19.2748 22.9071 19.2447C22.967 19.544 22.9371 19.7836 22.7874 20.1427C22.6078 20.5619 22.4881 20.9808 22.3983 21.4C21.9493 20.6518 21.2008 20.0829 20.1831 19.8435C19.4948 19.6937 18.7763 19.6937 18.0877 19.8735C17.6986 19.4543 17.2496 19.0952 16.7408 18.9157C16.2019 18.7361 15.7231 19.5144 16.1721 19.8735C16.4115 20.0531 16.6511 20.2028 16.8905 20.3823C16.7708 20.4722 16.6511 20.5619 16.5314 20.6518C15.5736 21.4601 15.0049 22.8967 15.5435 24.0942C15.4539 24.154 14.945 24.3336 15.0049 24.7227L15.005 24.7226ZM29.8219 18.6759C30.2411 17.7181 30.7199 16.79 31.2287 15.8921C31.7974 14.9042 32.486 13.6472 33.6234 13.258C35.7787 12.5098 35.3595 15.4731 34.9704 17.2991C33.8029 17.0597 32.4858 17.1196 31.5279 17.8979C31.1688 18.1971 31.558 18.6761 31.9471 18.6163C32.935 18.4666 33.7431 18.1972 34.7309 18.4067V18.4666C34.641 18.9156 34.5213 19.3646 34.4316 19.8135C33.2342 19.634 31.9471 19.6938 30.8994 20.3524C30.5403 20.5918 30.7497 21.1607 31.1986 21.0408C32.2163 20.7714 33.1743 20.6817 34.192 20.8014C34.0423 21.3102 33.8928 21.8191 33.713 22.3279C32.5156 21.9986 30.9292 21.9986 30.0611 22.8069C29.8515 23.0165 30.031 23.3158 30.2706 23.3458C30.8694 23.3758 31.4681 23.2261 32.0666 23.2261C32.4858 23.2261 32.9047 23.316 33.3239 23.4056C33.1742 23.8248 32.9946 24.2438 32.8449 24.663C31.857 24.5432 30.8692 24.2738 29.9414 24.1241C29.2229 24.0342 28.5644 24.0342 27.9058 24.1241C28.4449 22.2681 29.0436 20.4421 29.8219 18.6762L29.8219 18.6759ZM27.3674 19.3046C27.6666 19.4842 27.9062 19.7238 28.1456 19.9332C28.0259 20.2625 27.9062 20.5918 27.7865 20.891C27.4572 21.2501 27.2178 21.5496 26.6491 21.5794C26.0804 21.6094 25.5415 21.4297 24.9729 21.4597C24.434 21.5196 23.9252 21.6991 23.4761 22.0284C23.536 21.5494 23.6557 21.0405 23.8653 20.5018C24.0448 20.0827 24.1946 19.6637 24.1047 19.2147C24.0747 19.0051 23.955 18.8556 23.9251 18.646C23.9251 18.5862 23.8951 18.5263 23.8951 18.4963C24.0148 18.4663 24.1345 18.4365 24.2542 18.3766C24.5237 18.2867 25.8408 17.6882 26.0204 17.8079C26.1701 17.8978 26.23 18.4665 26.3795 18.646C26.6489 18.9753 27.0681 19.1249 27.3674 19.3046ZM27.2176 22.6272C27.0679 23.166 26.9184 23.7347 26.7686 24.3034C26.2298 24.4231 25.6911 24.5729 25.1222 24.7226C24.703 24.8423 24.254 24.9322 23.8351 24.962C23.6854 24.4532 23.5656 23.9741 23.5058 23.4953C23.9548 22.9565 24.4338 22.5375 25.2121 22.5375C25.7509 22.5375 26.2896 22.7171 26.8285 22.6872C26.9482 22.6872 27.0979 22.6572 27.2176 22.6272L27.2176 22.6272ZM22.6977 18.1072C22.578 17.7481 22.4283 17.3888 22.3386 16.9996C23.5658 16.4009 24.7931 15.892 26.1401 15.6527C26.2598 16.0418 26.4095 16.431 26.5292 16.8201C26.5292 16.8201 22.8773 17.5385 22.6977 18.1072ZM17.6087 21.5198C17.6388 21.4898 17.6686 21.4898 17.6986 21.4599C17.7885 21.6395 17.8782 21.819 17.968 22.0286C18.1776 22.4478 18.9259 22.268 18.866 21.7892C18.836 21.5498 18.8062 21.3402 18.7163 21.1008C19.1953 21.0109 19.734 21.0409 20.183 21.1907C21.7395 21.6697 22.1587 23.4058 21.7395 24.8126C21.0211 24.6331 20.3327 24.3636 19.6441 24.1541C18.6562 23.8846 17.6085 23.6452 16.6209 23.7949C16.6509 22.8668 16.7408 22.0885 17.6087 21.5198ZM16.0522 25.2314C17.5787 24.4231 19.6143 25.411 21.1411 25.86C22.8772 26.339 24.374 26.1592 26.0803 25.6804C26.9485 25.441 27.8164 25.1716 28.7144 25.1716C29.5825 25.1716 30.4206 25.3511 31.2886 25.5307C32.486 25.7701 33.6234 25.9198 34.7609 25.6504C34.3417 28.3744 33.354 34.6604 33.2641 35.0496C33.1444 35.4985 32.905 36.0074 32.6356 36.3965C31.9171 37.3844 30.7798 37.2048 29.702 37.1748C27.6965 37.1149 25.6609 37.1149 23.6553 37.1448H20.7217C19.9434 37.1448 18.3869 37.474 17.848 36.7556C17.3091 36.0372 17.3091 34.8698 17.2195 34.0317C17.0697 32.9541 16.95 31.9064 16.8003 30.8287C16.5609 28.9729 16.3213 27.1168 16.022 25.2907C16.0224 25.2312 16.0224 25.2313 16.0522 25.2313L16.0522 25.2314Z"
      fill="#052C42"
    />
    <Path
      d="M17.9695 23.4054C18.149 23.4054 18.3286 23.2259 18.3286 23.0463C18.3286 22.8367 18.1789 22.6872 17.9695 22.6872C17.7899 22.6872 17.6104 22.8668 17.6104 23.0463C17.6102 23.2259 17.7599 23.4054 17.9695 23.4054Z"
      fill="#052C42"
    />
    <Path
      d="M19.7654 22.6577C19.9449 22.6577 20.1245 22.4782 20.1245 22.2986C20.1245 22.0891 19.9748 21.9395 19.7654 21.9395C19.5858 21.9395 19.4062 22.1191 19.4062 22.2986C19.4062 22.508 19.5558 22.6577 19.7654 22.6577Z"
      fill="#052C42"
    />
    <Path
      d="M20.8113 23.7655C20.9908 23.7655 21.1704 23.586 21.1704 23.4064C21.1704 23.1968 21.0207 23.0473 20.8113 23.0473C20.6317 23.0473 20.4521 23.2269 20.4521 23.4064C20.4521 23.586 20.6017 23.7655 20.8113 23.7655Z"
      fill="#052C42"
    />
    <Path
      d="M20.0617 31.4281C20.7802 31.2784 21.4087 30.59 22.0673 30.2307C22.8155 29.8115 23.6238 29.5122 24.4619 29.3625C24.7314 29.3027 24.9409 29.183 25.0905 29.4224C25.27 29.6918 25.0306 29.8714 24.8809 30.1108C24.6415 30.4999 24.4019 30.9191 24.1925 31.3082C23.8632 31.9668 23.3842 32.715 23.3243 33.4635C23.2943 33.9723 23.4142 34.4514 23.8632 34.7208C24.4619 35.1099 25.1803 34.7806 25.7789 34.5711C27.545 33.9425 29.2213 33.1044 30.7779 32.1165C31.4963 31.6675 30.8377 30.5001 30.0895 30.9491C29.2812 31.458 26.5572 32.8648 26.0484 33.0743C25.809 33.1642 25.0007 33.6132 24.7911 33.5534C24.3719 33.4036 24.8809 32.6852 25.0305 32.3859C25.2401 31.9668 26.617 29.8415 26.4971 29.0933C26.078 26.3993 20.0316 29.3327 19.6425 31.009C19.6128 31.3084 19.8222 31.488 20.0618 31.4281L20.0617 31.4281Z"
      fill="#052C42"
    />
  </Svg>
);
export default MyOrdersSmallIcon;