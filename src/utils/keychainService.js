import * as Keychain from 'react-native-keychain';
import {Alert} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCredentials = async () => {
  const deviceId = await AsyncStorage.getItem('uniqueId');
  return new Promise((resolve, reject) => {
    Keychain.getGenericPassword({service: deviceId})
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getInternetCredentials = async server => {
  return new Promise((resolve, reject) => {
    Keychain.getInternetCredentials(server)
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const handleCredentialsConfirmation = async (username, password) => {
  const credentials = await getCredentials();
  const rnBiometrics = new ReactNativeBiometrics();
  const {biometryType} = await rnBiometrics.isSensorAvailable();
  if (!credentials && biometryType) {
    Alert.alert(
      `Would you like to enable ${biometryType} Login?`,
      `Allowing the ${biometryType} will help you login into Rubio's App instantly.`,
      [{text: 'No, thanks'}, {text: 'Enable', onPress: () => setCredentials(username, password)}],
    );
  } else {
    return setCredentials(username, password);
  }
};

export const setCredentials = async (username, password) => {
  const deviceId = await AsyncStorage.getItem('uniqueId');
  return new Promise((resolve, reject) => {
    Keychain.setGenericPassword(username, password, {service: deviceId})
      .then(resp => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const setAppleCredentials = (server, key, credentials) => {
  return new Promise((resolve, reject) => {
    Keychain.setInternetCredentials(server, key, credentials)
      .then(resp => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const resetCredentials = async () => {
  await Keychain.resetGenericPassword();
};
