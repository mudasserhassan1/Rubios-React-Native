import {useEffect, useRef} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import VersionNumber from 'react-native-version-info';
import {logToConsole} from './ReactotronConfig';
import {Alert, Linking} from 'react-native';
import {
  saveAndroidForceUpdate,
  saveAndroidVersionNumber,
  saveIOSForceUpdate,
  saveIOSVersionNumber,
  excludeRestaurants, saveConfig,
} from '../redux/actions/firebase-config-values';
import {useDispatch} from 'react-redux';
import {isAndroid, isIos} from '../utils/sharedUtils';
import {displayToast} from '../helpers/toast';
import {addForegroundHandler, removeForegroundHandler} from '../containers/AppStateHandler';
import Config from 'react-native-config';

let rcDefaults = require('./remote_config_defaults.json');

const RemoteConfig = () => {
  const isAlertVisible = useRef(false);
  const iosAppStoreLink = 'itms-apps://apps.apple.com/us/app/rubios/id1444744071';
  const androidPlayStoreLink = 'https://play.google.com/store/apps/details?id=com.rubios.app';
  const dispatch = useDispatch();

  useEffect(() => {
    const setDefaults = async () => await remoteConfig().setDefaults(rcDefaults);
    setDefaults().then(r => {});
    const unsubscribe = remoteConfig().onConfigUpdated(getRemoteConfig);
    addForegroundHandler('REMOTE_CONFIG', getRemoteConfig);
    return () => {
      unsubscribe();
      removeForegroundHandler('REMOTE_CONFIG');
    };
  }, [dispatch]);

  const displayForceUpdateAlert = ({
    iosForceUpdate,
    iosVersionNumber,
    androidForceUpdate,
    androidVersionNumber,
  }) => {
    if (
      ((isIos && iosForceUpdate && VersionNumber?.appVersion < iosVersionNumber) ||
        (isAndroid && androidForceUpdate && VersionNumber?.appVersion < androidVersionNumber)) &&
      !isAlertVisible.current
    ) {
      isAlertVisible.current = true;
      Alert.alert(
        'Update Required',
        'We have launched a new and improved app. Please update to continue using\n' + 'the app.',
        [
          {
            text: 'Update Now',
            onPress: () => {
              Linking?.canOpenURL(isIos ? iosAppStoreLink : androidPlayStoreLink).then(
                supported => {
                  isAlertVisible.current = false;
                  if (supported) {
                    Linking?.openURL(isIos ? iosAppStoreLink : androidPlayStoreLink);
                  } else {
                    displayToast('ERROR', 'Unsupported url.');
                  }
                },
              );
            },
          },
        ],
      );
    }
  };

  const retrieveConfigsFromRemote = () => {
    const iosForceUpdate = remoteConfig()?.getBoolean('is_force_update_ios');
    const androidForceUpdate = remoteConfig()?.getBoolean('is_force_update_android');
    const iosVersionNumber = remoteConfig()?.getValue('ios_app_version')?._value || '';
    const androidVersionNumber = remoteConfig()?.getValue('android_app_version')?._value ?? '';
    const excludedRestaurants = remoteConfig()?.getValue('exclude_restaurants');
    saveConfigUrls();
    dispatch(saveIOSForceUpdate(iosForceUpdate));
    dispatch(saveAndroidForceUpdate(androidForceUpdate));
    dispatch(saveIOSVersionNumber(iosVersionNumber));
    dispatch(saveAndroidVersionNumber(androidVersionNumber));
    dispatch(excludeRestaurants(remoteConfig()?.getValue('exclude_restaurants')));
    if (Config.ENVIRONMENT === 'LIVE') {
      displayForceUpdateAlert({
        iosForceUpdate,
        androidForceUpdate,
        iosVersionNumber,
        androidVersionNumber,
      });
    }
    return {
      iosForceUpdate,
      androidForceUpdate,
      iosVersionNumber,
      androidVersionNumber,
      excludedRestaurants,
    };
  };

  const saveConfigUrls = () => {
    const configKey = Config.ENVIRONMENT === 'LIVE' ? 'live_config' : 'sandbox_config';
    const config = remoteConfig()?.getValue(configKey);
    const parsedConfig = JSON.parse(config?._value || '{}');
    logToConsole({parsedConfig})
    dispatch(saveConfig(parsedConfig));
  }

  const getRemoteConfig = async () => {
    try {
      await remoteConfig().fetchAndActivate();
      retrieveConfigsFromRemote();
    } catch (e) {
      retrieveConfigsFromRemote();
      logToConsole({getRemoteConfig: e.message})
    }
  };

  return null;
};

export default RemoteConfig;
