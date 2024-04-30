import {Linking, Platform} from 'react-native';
import {strings} from '../constants';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {showAlert} from '../helpers/toast';
import {isAndroid, isIos} from './sharedUtils';
import messaging from '@react-native-firebase/messaging';
import {getFcmTokenSuccess} from '../redux/actions/token';
import {logToConsole} from '../configs';
import {useDispatch} from 'react-redux';

const handleOpenAppSettings = () => {
  setTimeout(() => {
    return Linking.openSettings();
  }, 200);
};

export const handleBlockedPermission = type => {
  if (type === 'blocked') {
    return showAlert({
      message:
        'It seems that you may have blocked the app to access your location. Please allow it in settings to access nearby restaurants.',
      isLeft: true,
      rightText: 'Go to Settings',
      onPressRight: handleOpenAppSettings,
    });
  }

  if (type === 'unavailable') {
    return showAlert({
      title: 'Location services not available',
      message:
        'It seems that Location Services are turned off. Please turn it on in the settings to access the nearby restaurants.',
      isLeft: true,
      rightText: 'Go to Settings',
      onPressRight: handleOpenAppSettings,
    });
  }
};

export const checkPermissions = async type => {
  return new Promise((resolve, reject) => {
    check(type)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            resolve(RESULTS.UNAVAILABLE);
            break;
          case RESULTS.DENIED:
            resolve(await requestPermission(type));
            break;
          case RESULTS.LIMITED:
            break;
          case RESULTS.GRANTED:
            resolve(RESULTS.GRANTED);
            break;
          case RESULTS.BLOCKED:
            resolve(RESULTS.BLOCKED);
            break;
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

const ANDROID_LOCATION_PERMISSION_INFO = {
  title: strings.perms_app_name,
  message: strings.perms_message,
  buttonNeutral: strings.ask_me_later,
  buttonNegative: strings.cancel,
  buttonPositive: strings.ok,
};

export const requestPermission = async permissionType => {
  const rationale =
    isAndroid && (permissionType === PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION ||
    permissionType === PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      ? ANDROID_LOCATION_PERMISSION_INFO
      : {};
  return new Promise(resolve => {
    request(permissionType, rationale).then(async result => {
      resolve(result);
    });
  });
};

export const RegisterDeviceAndGetFCM = async () => {
  const dispatch = useDispatch();
  try {
    if (Platform.OS === 'ios') {
      const token = await messaging().getAPNSToken();
      dispatch(getFcmTokenSuccess(token));
    } else {
      messaging()
        .registerDeviceForRemoteMessages()
        .then(async () => {
          const token = await messaging().getToken();
          dispatch(getFcmTokenSuccess(token));
        })
        .catch(e => {
          logToConsole({registerDeviceAndGetFCM: e.message});
        });
    }
  } catch (e) {
    logToConsole({registerDeviceAndGetFCM: e.message});
  }
};

export const checkIfLocationPermissionEnabled = async () => {
  const type = isIos ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  return new Promise(resolve => {
    checkPermissions(type).then(result => {
      if (result === RESULTS.GRANTED) {
        resolve({isGranted: true});
      } else {
        resolve({isGranted: false});
      }
    });
  });
};

export const locationPermissionStatus = async () => {
  const type = isIos ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  return new Promise(resolve => {
    checkPermissionsStatus(type).then(result => {
      if (result === RESULTS.GRANTED) {
        resolve({isGranted: true});
      } else {
        resolve({isGranted: false});
      }
    });
  });
};

export const checkPermissionsStatus = async type => {
  return new Promise((resolve, reject) => {
    check(type)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            resolve(result);
            break;
          case RESULTS.DENIED:
            // resolve(await requestPermission(type));
            break;
          case RESULTS.LIMITED:
            break;
          case RESULTS.GRANTED:
            resolve(RESULTS.GRANTED);
            break;
          case RESULTS.BLOCKED:
            resolve(RESULTS.BLOCKED);
            break;
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};
