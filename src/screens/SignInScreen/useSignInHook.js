import {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {isValidEmail} from '../../utils/validationUtils';
import {AccessibilityInfo, Alert, Keyboard, Platform} from 'react-native';
import {clearProviderError, guestUserLogin, userLogin, userLogout} from '../../redux/actions/user';
import {constants, screens, strings} from '../../constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {resetBasketRequest} from '../../redux/actions/basket';
import useBasketSelector from '../../hooks/reduxStateHooks/useBasketSelector';
import {goBack} from '../../utils/navigationUtils';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import useGuestSelector from '../../hooks/reduxStateHooks/useGuestSelector';
import useBioMetricLogin from '../../hooks/useBiometricLogin';
import useAuthSelector from '../../hooks/reduxStateHooks/useAuthSelector';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import {logToConsole} from '../../configs';
import messaging from '@react-native-firebase/messaging';
import {getFcmTokenSuccess} from '../../redux/actions/token';
import {store} from '../../redux/store';
import useUserSelector from "../../hooks/reduxStateHooks/useUserSelector";

const useSignInHook = () => {
  const navigation = useNavigation();
  const errors = constants.AUTH_VALIDATION_ERRORS;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {isLoading} = useAuthSelector();

  const {params} = useRoute();
  const {screenName = 'Home'} = params || {};

  const {
    providerLoading: loadingProvider,
    authLoading: loadingAuth,
    isSocialSignup,
    isLoggedIn,
  } = useAuthSelector();
  const {isGuestLogin} = useSelector(state => state.guestLogin);

  const {basket} = useBasketSelector();
  const {error = null} = useProviderSelector();
  const {data: {errors: {base = []} = {}} = {}} = error || {};

  const dispatch = useDispatch();
  const {fcmToken = ''} = store.getState().token;

  const fillInputOnBiometricLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  const {handleBiometricLogin, isBiometricIconVisible} = useBioMetricLogin({
    prefillInputs: fillInputOnBiometricLogin,
  });

  const {isAccessibilityOn} = useUserSelector();

  useEffect(() => {
    if (isAccessibilityOn) {
      AccessibilityInfo.announceForAccessibility(emailError || base?.[0])
    }
  }, [emailError, base]);

  const ref_password = useRef();

  const isButtonLoading = isLoading && (loadingAuth || loadingProvider);

  const isLoginError = base[0]?.toLowerCase().includes('incorrect');
  const isButtonDisabled = useMemo(() => !email.trim() || !password.trim(), [email, password]);

  useEffect(() => {
    if (isLoggedIn && isSocialSignup && !loadingAuth && !loadingProvider) {
      navigation.navigate(screens.SIGNUP);
    }
  }, [isLoggedIn, isSocialSignup, loadingAuth, loadingProvider, navigation]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'sign_in_screen',
    });
  }, []);

  useEffect(() => {
    if (fcmToken === null || fcmToken === '') {
      registerFCMToken().then(r => {});
    }
  }, [dispatch, fcmToken]);
  const registerFCMToken = async () => {
    messaging()
      .hasPermission()
      .then(async enabled => {
        if (enabled !== -1) {
          try {
            if (Platform.OS === 'ios') {
              const token = await messaging().getAPNSToken();
              logToConsole({apnToken: token});
              dispatch(getFcmTokenSuccess(token));
            } else {
              messaging()
                .registerDeviceForRemoteMessages()
                .then(async () => {
                  const token = await messaging().getToken();
                  dispatch(getFcmTokenSuccess(token));
                  logToConsole({fcmToken: token});
                })
                .catch(e => {
                  logToConsole({registerDeviceAndGetFCM: e.message});
                });
            }
          } catch (e) {
            logToConsole({registerDeviceAndGetFCM: e.message});
          }
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };
  const validateEmail = () => {
    if (!email) {
      setEmailError(errors.email.required);
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError(errors.email.invalid);
      return false;
    }
    return true;
  };

  const {isGuest} = useGuestSelector();

  const removeSocialAccountInfo = () => {
    if (isSocialSignup) {
      dispatch(userLogout());
    }
  };
  const validatePassword = () => {
    if (!password) {
      setPasswordError(errors.password.required);
      return false;
    }
    // if (!isValidPassword(password)) {
    //   setPasswordError('Must be at least 8 characters');
    //   return false;
    // }
    return true;
  };

  const onSubmitClick = () => {
    if (validateEmail() && validatePassword()) {
      Keyboard?.dismiss();
      dispatch(userLogin({email, password}, basket?.id || '', isGuest, screenName));
    }
  };

  const onSignupClick = () => {
    if (!isLoading) {
      removeSocialAccountInfo();
      logFirebaseCustomEvent(strings.click, {
        click_label: 'sign_up',
        click_destination: 'Sign Up Screen',
      });
      navigation.navigate(screens.SIGNUP, {screenName});
    }
  };
  const continueAsGuest = () => {
    removeSocialAccountInfo();
    if (isGuestLogin) {
      return goBack();
    }
    logFirebaseCustomEvent(strings.click, {
      click_label: 'continue_as_guest',
      click_destination: 'Home Screen',
    });
    dispatch(guestUserLogin());
    return dispatch(resetBasketRequest());
  };

  const onForgotPasswordClick = () => {
    removeSocialAccountInfo();
    logFirebaseCustomEvent(strings.click, {
      click_label: 'forgot_password',
      click_destination: 'Forgot Password Screen',
    });
    navigation.navigate(screens.FORGOT_PASSWORD);
  };

  const handelEmailChange = text => {
    clearError();
    if (emailError) {
      setEmailError('');
    }
    let emailText = text?.trim();
    setEmail(emailText);
  };
  const handelPasswordChange = text => {
    clearError();
    if (passwordError) {
      setPasswordError('');
    }
    let pwd = text;
    setPassword(pwd);
  };

  const clearError = () => {
    if (base.length > 0) {
      dispatch(clearProviderError());
    }
  };
  return {
    email,
    password,
    emailError,
    passwordError,
    isLoading,
    ref_password,
    isButtonLoading,
    isButtonDisabled,
    validateEmail,
    validatePassword,
    onSubmitClick,
    onSignupClick,
    continueAsGuest,
    onForgotPasswordClick,
    handelEmailChange,
    handelPasswordChange,
    providerError: base,
    isBiometricIconVisible,
    handleBiometricLogin,
    isLoginError,
  };
};
export default useSignInHook;
