import React from 'react';
import {useEffect, useState} from 'react';
import appleAuth from '@invertase/react-native-apple-authentication';
import {StyleSheet, Text, View} from 'react-native';
import {logToConsole} from '../configs';
import {useDispatch} from 'react-redux';
import {userRegisterApple} from '../redux/actions/user';
import SocialButtonWrapper from '../components/SocialButtonWrapperComponent';
import {images} from '../assets';
import {useRoute} from '@react-navigation/native';
import useBasketSelector from './reduxStateHooks/useBasketSelector';
import useGuestSelector from './reduxStateHooks/useGuestSelector';
import Keychain from 'react-native-keychain';
import {
  getCredentials,
  getInternetCredentials,
  setAppleCredentials,
} from '../utils/keychainService';
import {screens} from "../constants";
import RText from "../components/RText";
/**
 * You'd technically persist this somewhere for later use.
 */
let user = null;

/**
 * Fetches the credential state for the current user, if any, and updates state on completion.
 */
async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
  if (user === null) {
    updateCredentialStateForUser('N/A');
  } else {
    const credentialState = await appleAuth.getCredentialStateForUser(user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      updateCredentialStateForUser('AUTHORIZED');
    } else {
      updateCredentialStateForUser(credentialState);
    }
  }
}
/**
 * Starts the Sign-In flow.
 */
async function onAppleButtonPress(
  updateCredentialStateForUser,
  dispatch,
  basketId,
  isGuest,
  screenName,
) {
  // start a login request
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const {
      user: newUser,
      identityToken,
      authorizationCode,
      fullName,
      realUserStatus /* etc */,
    } = appleAuthRequestResponse;
    const {givenName, familyName} = fullName;
    user = newUser;
    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
    let userName;
    if (givenName && familyName) {
      const object = {
        firstName: givenName,
        lastName: familyName,
      };
      userName = object;
      const appleCredentials = JSON.stringify(object);
      await setAppleCredentials(newUser, 'appleCredentials', appleCredentials);
    } else {
      const response = await getInternetCredentials(newUser);
      const {password} = response || {};
      userName = JSON.parse(password || '{}');
    }
    if (identityToken) {
      const user = {
        first_name: givenName ?? userName?.firstName,
        last_name: familyName ?? userName?.lastName,
        // gender: 'Male',
        external_source: 'Apple',
        external_source_id: newUser,
        authorization_code: authorizationCode,
      };
      dispatch(userRegisterApple(user, basketId, isGuest, screenName));
    } else {
      // no token - failed sign-in?
      logToConsole({SigninFailed: true});
    }

    if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
      logToConsole({realUserStatus: "I'm a real person!"});
    }
  } catch (error) {
    if (error.code === appleAuth.Error.CANCELED) {
      logToConsole({error: 'User canceled Apple Sign in.'});
    } else {
      console.error(error);
      logToConsole({error: error});
    }
  }
}

const useAppleAuth = ({disabled = false}) => {
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

  const dispatch = useDispatch();

  const {basket} = useBasketSelector();
  const {id: basketId} = basket || {};

  const {isGuest} = useGuestSelector();
  const {params} = useRoute();
  const {screenName = screens.HOME_SCREEN} = params || {};

  useEffect(() => {
    if (!appleAuth.isSupported) {
      return;
    }

    fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
      updateCredentialStateForUser(`Error: ${error.code}`),
    );
  }, []);

  useEffect(() => {
    if (!appleAuth.isSupported) {
      return;
    }

    return appleAuth.onCredentialRevoked(async () => {
      console.warn('Credential Revoked');
      fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
        updateCredentialStateForUser(`Error: ${error.code}`),
      );
    });
  }, []);

  const renderErrorMessage = () => {
    if (!appleAuth.isSupported) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <RText>Apple Authentication is not supported on this device.</RText>
        </View>
      );
    }
    return null;
  };

  const renderAppleButtonJSX = () => {
    if (!appleAuth.isSupported) {
      return null;
    }
    return (
      <SocialButtonWrapper
        imageName={images.apple}
        onPress={() =>
          onAppleButtonPress(updateCredentialStateForUser, dispatch, basketId, isGuest, screenName)
        }
        // containerStyle={containerStyle}
        disabled={!!disabled}
        accessibilityLabel={'Apple Login'}
        accessibilityHint={'activate to login using apple account'}
        // imageStyle={imageStyle}
      />
    );
  };
  return {
    renderAppleButtonJSX,
    renderErrorMessage,
    credentialStateForUser,
  };
};

const styles = StyleSheet.create({
  appleButton: {
    width: 200,
    height: 60,
    margin: 10,
  },
});
export default useAppleAuth;
