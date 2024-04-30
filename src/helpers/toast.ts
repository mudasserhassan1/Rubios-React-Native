import {showMessage} from 'react-native-flash-message';
import {Alert} from 'react-native';
import {store} from "../redux/store";
import {logToConsole} from "../configs";

interface settingsConfig {
  position?: string;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number | string;
  theme?: string;
}

enum toastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

type toast = keyof typeof toastType;

const defaultSettings: any = {
  position: 'bottom-left',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const showAlert: any = ({
  title = "Rubio's Coastal Grill",
  message = 'Something went wrong. Please try again later',
  isLeft = false,
  leftText = 'Cancel',
  rightText = 'Ok',
  options = {},
  onPressLeft = () => {},
  onPressRight = () => {},
}) => {
  const buttons = [
    {
      text: rightText,
      onPress: onPressRight,
    },
  ];
  if (isLeft) {
    buttons.unshift({
      text: leftText,
      onPress: onPressLeft,
    });
  }
  Alert.alert(title, message, buttons, {
    cancelable: false,
    ...options,
  });
};

export const displayToast = (type: toast, message: string, alert = false) => {
  const {isAccessibilityOn = false} = store.getState().user ?? {};
  if (isAccessibilityOn) {
    showAlert({title: message, message: ' '});
  } else {
    switch (type) {
      case toastType.SUCCESS:
        showMessage({message, type: 'success'});
        break;
      case toastType.ERROR:
        if (alert) {
          showAlert({message});
        } else {
          showMessage({message, type: 'danger'});
        }
        break;
      case toastType.INFO:
        showMessage({message, type: 'info'});
        break;
      default:
        break;
    }
  }
};
