import analytics from '@react-native-firebase/analytics';
import Config from 'react-native-config';
import {logToConsole} from "../configs";
import {navigationRef} from "./navigationUtils";

export const logFirebaseCustomEvent = async (eventName, item) => {
  if (Config.ENVIRONMENT === 'LIVE') {
    const {name: screenName = ''} = navigationRef?.current?.getCurrentRoute();
    const formattedName = screenName?.toLowerCase()?.split(' ').join('_').concat('_screen');
    if (eventName !== 'screen') {
      item = {screen_name: formattedName, ...item}
    }
    // logToConsole({eventName, item});
    await analytics().logEvent(eventName, item);
  } else {
    return;
  }
};
