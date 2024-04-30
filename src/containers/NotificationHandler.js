import {useEffect, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import {logToConsole} from '../configs';
import {useDispatch} from 'react-redux';

const NotificationHandler = ({onNotificationTap, onNewNotification} = {}) => {
  const onTokenRef = useRef(null);
  const onMessageRef = useRef(null);
  const onNotificationOpenedAppRef = useRef(null);

  const handlerListener = async () => {
    const permissionGranted = await messaging().hasPermission();

    if (permissionGranted) {
      //Foreground
      onMessageRef.current = messaging().onMessage(async remoteMessage => {
        logToConsole({foregroundNotification: remoteMessage});
        if (remoteMessage) {
          // onNewNotification(1);
        }
      });
    }
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      logToConsole({remoteMessage});
    });

    //Background
    onNotificationOpenedAppRef.current = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        logToConsole({remoteMessage});
        if (remoteMessage) {
          // onNotificationTap(remoteMessage, false);
          // navigateTo(screens.NOTIFICATIONS);
        }
      },
    );
    //Quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        logToConsole({quitState: remoteMessage});
        if (remoteMessage) {
          // navigateTo(screens.NOTIFICATIONS);
        }
      });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          onNotificationTap(remoteMessage, true);
          logToConsole({
            'getInitialNotification:': remoteMessage,
          });
        }
      });

    //Token Refresh
    onTokenRef.current = messaging().onTokenRefresh(async token => {
      logToConsole({onTokenRefresh: token});
      // dispatch(getFcmTokenSuccess(token));

      // await sendFcmTokenToServer(token);
    });
  };

  useEffect(() => {
    handlerListener().then();
    return () => {
      onTokenRef.current?.();
      onMessageRef.current?.();
      onNotificationOpenedAppRef.current?.();
    };
  }, []);

  return null;
};

export default NotificationHandler;
