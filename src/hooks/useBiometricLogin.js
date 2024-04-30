import {useEffect, useMemo, useState} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import {getCredentials} from '../utils/keychainService';
import {userLogin} from '../redux/actions/user';
import {useDispatch} from 'react-redux';
import useBasketSelector from './reduxStateHooks/useBasketSelector';
import {Alert} from 'react-native';
import useGuestSelector from './reduxStateHooks/useGuestSelector';
import {useRoute} from '@react-navigation/native';
import {logToConsole} from '../configs';

const useBioMetricLogin = ({prefillInputs}) => {
  const [biometryType, setBiometryType] = useState(null);
  const [userCredentials, setUserCredentials] = useState(null);

  const dispatch = useDispatch();
  const {basket = {}} = useBasketSelector();
  const {id: basketId} = basket || {};
  const {isGuest} = useGuestSelector();

  const {params} = useRoute();
  const {screenName = 'Home'} = params || {};

  useEffect(() => {
    checkBiometricSupport().then();
    checkUserCredentials().then();
  }, []);

  const checkUserCredentials = async () => {
    const userId = await getCredentials();
    if (userId) {
      setUserCredentials(userId);
    }
  };

  const isBiometricIconVisible = useMemo(() => {
    return !!biometryType && !!userCredentials;
  }, [biometryType, userCredentials]);

  const checkBiometricSupport = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {biometryType: type} = await rnBiometrics.isSensorAvailable();
      // biometryType will be one of "FaceID" or "TouchID" on iOS
      // and "Biometrics" on Android (covering fingerprint, face, and iris).
      setBiometryType(type);
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const handleBiometricLogin = async () => {
    // return checkFaceIdPermission();
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: "Sign in to Rubio's",
        fallbackEnabled: true, // Enable if you want to show "Enter Passcode" option
      });

      if (success) {
        prefillInputs(userCredentials?.username, userCredentials?.password);
        dispatch(
          userLogin(
            {email: userCredentials?.username, password: userCredentials?.password},
            basketId || '',
            isGuest,
            screenName,
          ),
        );
      } else {
        Alert.alert(
          'Authentication Failed!',
          `Something went wrong during authentication with ${biometryType}. Please try signing in with email/password.`,
        );
        // Biometric authentication failed or the user canceled.
        console.log('Biometric authentication failed or canceled.');
      }
    } catch (error) {
      // Alert.alert(
      //   'Error',
      //   error?.message || 'Something went wrong. Please try a different method.',
      // );
      console.error('Error with biometric authentication:', error?.message);
      checkBiometricSupport();
    }
  };

  return {
    biometryType,
    userCredentials,
    handleBiometricLogin,
    isBiometricIconVisible,
  };
};
export default useBioMetricLogin;
