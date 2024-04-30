import React from 'react';
import {ImageBackground, Dimensions, Platform, PermissionsAndroid} from 'react-native';
import {PERMISSIONS, requestNotifications, RESULTS} from 'react-native-permissions';

import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setIsOnBoarded} from '../../redux/actions/newUser';
import {screens} from '../../constants';
import {checkPermissions} from '../../utils/permissionsUtils';
import {isIos} from '../../utils/sharedUtils';
import {logToConsole} from '../../configs';
import messaging from '@react-native-firebase/messaging';
import {getFcmTokenSuccess} from '../../redux/actions/token';

const {width} = Dimensions.get('window');

const OnBoarding = ({image, title, text, withButton = false, buttons = [], handleNext}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePermissionResult = async r => {
    if (r === RESULTS.GRANTED) {
      try {
        if (isIos) {
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
    }
  };
  async function requestNotificationPermission() {
    if (Platform.OS === 'android') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      await handlePermissionResult(status);
    } else {
      const {status} = await requestNotifications(['alert', 'sound']);
      await handlePermissionResult(status);
    }
  }

  const onButtonPress = actionKey => {
    switch (actionKey) {
      case 'login':
        dispatch(setIsOnBoarded(true));
        break;
      case 'signup':
        navigation.navigate(screens.SIGNUP);
        dispatch(setIsOnBoarded(true));
        break;
      case 'orderNow':
        dispatch(setIsOnBoarded(true));
        break;
      case 'location':
        const locationPermissionType = isIos
          ? PERMISSIONS.IOS.LOCATION_ALWAYS
          : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION || PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        checkPermissions(locationPermissionType).then(() => {
          handleNext?.();
        });
        break;
      case 'notification':
        requestNotificationPermission().then(r => handleNext?.());
        break;
      default:
        break;
    }
  };

  return (
    <ImageBackground source={image} style={[styles.imageBackground, {width}]} resizeMode="cover">
      {/*<View style={{paddingTop: getMScale(120), width: getMScale(300), alignSelf: 'center'}}>*/}
      {/*  <RText*/}
      {/*    accessible*/}
      {/*    accessibilityLabel={title}*/}
      {/*    text={title}*/}
      {/*    size={'xxl'}*/}
      {/*    weight={'headerBold'}*/}
      {/*    numberOfLines={2}*/}
      {/*    color={colors.secondary}*/}
      {/*    textStyle={styles.titleStyle}*/}
      {/*  />*/}
      {/*  <View accessible={false} style={{marginTop: getVerticalScale(10)}}>*/}
      {/*    <RText text={text} color={colors.primary} textStyle={styles.subTitleStyle} size={'sm'} />*/}
      {/*  </View>*/}
      {/*</View>*/}
    </ImageBackground>
  );
};
export default OnBoarding;
