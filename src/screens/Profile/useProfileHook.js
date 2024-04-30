import {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {constants, PASSWORD_REGEX, screens, strings} from '../../constants';
import {isValidEmail, isValidPassword} from '../../utils/validationUtils';
import {Alert, Keyboard, Linking, PermissionsAndroid, Platform} from 'react-native';
import {deleteUserAccount, updateUser} from '../../redux/actions/user';
import {useFocusEffect} from '@react-navigation/native';
import useUserSelector from '../../hooks/reduxStateHooks/useUserSelector';
import {locationPermissionStatus} from '../../utils/permissionsUtils';
import {logToConsole} from '../../configs';
import {getCredentials} from '../../utils/keychainService';
import {debounce} from 'lodash';
import {sendOTP, updateUseronOurDB, verifyOTP, verifyPhoneNumber} from '../../services/otp';
import {displayToast} from '../../helpers/toast';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';
import useProviderSelector from '../../hooks/reduxStateHooks/useProviderSelector';
import {getFcmTokenSuccess} from '../../redux/actions/token';
import messaging from '@react-native-firebase/messaging';
import {isIos} from '../../utils/sharedUtils';
import {requestNotifications, RESULTS} from 'react-native-permissions';

const INPUT_KEYS = {
  FIRST_NAME: 'FIRST_NAME',
  LAST_NAME: 'LAST_NAME',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  CURRENT_PASSWORD: 'CURRENT PASSWORD',
  NEW_PASSWORD: 'NEW PASSWORD',
  CONFIRM_PASSWORD: 'CONFIRM_PASSWORD',
  BIRTHDAY: 'BIRTHDAY',
};

const useProfileHook = () => {
  const dispatch = useDispatch();
  const inputsRef = useRef({});
  const errors = constants.AUTH_VALIDATION_ERRORS;

  useEffect(() => {
    Object.values(INPUT_KEYS).forEach(key => (inputsRef.current[key] = createRef()), {});
  }, []);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'my_profile_screen',
    });
  }, []);

  const {userProfile = {}} = useUserSelector();
  const {userDataLoading} = useUserSelector();
  const {providerToken} = useProviderSelector();
  const {user = {}} = providerToken || {};
  const {apple_uid: appleUser = ''} = user || {};
  const changePasswordBottomSheetRef = useRef();
  const changeMobileNumberBottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['62%'], []);
  const phoneNumberSnapPoints = useMemo(() => ['50%'], []);
  const phoneNumberSnapPoints_ = useMemo(() => ['76%'], []);

  const {
    email: userEmail = '',
    first_name = '',
    last_name = '',
    phone = '',
    birthday = null,
    marketing_email_subscription = false,
    marketing_pn_subscription = false,
    sms_subscription = false,
    fb_uid: isFBUser = '',
  } = userProfile || {};

  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);
  const [email, setEmail] = useState(userEmail);
  const [mobile, setMobile] = useState(phone);
  const [password, setPassword] = useState('');
  const [currenntPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [checked, setChecked] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [currenntPasswordError, setCurrentPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [errorLastName, setErrorLastName] = useState('');
  const [locationError, setLocationError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);
  const [isEmailNotificationToggleOn, setIsEmailNotificationToggleOn] = useState(
    marketing_email_subscription,
  );
  const [isLocationSharingToggleOn, setIsLocationSharingToggleOn] = useState(false);
  const [isFaceIdToggleOn, setIsFaceIdToggleOn] = useState(false);
  const [isPushNotificationToggleOn, setIsPushNotificationToggleOn] =
    useState(marketing_pn_subscription);
  const [isSMSSubscribed, setISMSSubscribed] = useState(sms_subscription);
  const [isPNSubscribed, setIsPNSubscribed] = useState(marketing_pn_subscription);
  const [headerTitle, setHeaderTitle] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showOTPView, setShowOTPView] = useState(false);
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [code, setCode] = useState('');
  const [otpLoader, setOtpLoader] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [isEmailToggleLoading, setIsEmailToggleLoading] = useState(false);
  const [isPNToggleLoading, setIsPNToggleLoading] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(() => {
    locationPermissionStatus().then(value => {
      if (value.isGranted === true) {
        setIsLocationSharingToggleOn(true);
      }
    });
    getCredentials().then(value => {
      if (value?.username !== '' || null) {
        setIsFaceIdToggleOn(true);
      }
    });
  });

  const onConsent = item => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'delete_account',
      click_destination: 'Show consent dialog of Delete Account',
    });
    Alert.alert(
      'Delete Account',
      'This cannot be undone and you will lose all your saved preferences and favorites.',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          // style: 'destructive',
          onPress: () => {
            try {
              setDeleteAccountLoading(true);
              logFirebaseCustomEvent(strings.click, {
                click_label: 'Remove',
                click_destination: screens.LAST_ONBOARDING,
              });
              dispatch(deleteUserAccount(() => setDeleteAccountLoading(false)));
            } catch (e) {
              setDeleteAccountLoading(true);
              logToConsole({e: e.message});
            }
          },
        },
      ],
    );
  };

  const validateInputFields = () => {
    if (!firstName?.trim()) {
      setFirstNameError(errors.firstName.required);
      return false;
    }

    if (!lastName?.trim()) {
      setErrorLastName(errors.lastName.required);
      return false;
    }
    if (!email?.trim()) {
      setEmailError(errors.email.required);
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError(errors.email.invalid);
      return false;
    }
    if (!mobile?.trim()) {
      setMobileError(errors.phone.required);
      return false;
    }
    if (mobile && mobile?.trim()?.replace(/\D/g, '').length < 10) {
      setMobileError(errors.phone.invalid);
      return false;
    }
    return true;
  };

  const passwordValidationEligible = useMemo(() => {
    return currenntPassword || password || confirmPassword;
  }, [currenntPassword, password, confirmPassword]);

  const signupFieldsValid = useMemo(() => {
    let isValidAndNonEmptyEmail = !!email && isValidEmail(email);
    let isValidMobile = mobile && mobile.replace(/\D/g, '').length === 10;
    return firstName && lastName && isValidAndNonEmptyEmail && isValidMobile;
  }, [email, firstName, lastName, mobile]);

  const onSubmitClick = updatedInfo => {
    Keyboard?.dismiss();
    if (validateInputFields()) {
      const obj = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        marketing_email_subscription: isEmailNotificationToggleOn,
        marketing_pn_subscription: isPushNotificationToggleOn,
        sms_subscription: isSMSSubscribed,
        phone: mobile.replace(/\D/g, ''),
        ...(currenntPassword &&
          password &&
          confirmPassword && {
            current_password: currenntPassword,
            password: password,
            password_confirmation: password,
          }),
      };
      const objectToSend = updatedInfo || obj || {};
      dispatch(updateUser(objectToSend, true, callBackStatus));
    }
  };

  const callBackStatus = status => {
    if (status === 'success') {
      if (headerTitle === 'change password') {
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        changePasswordBottomSheetRef?.current?.closeSheet();
      } else {
        setOtpLoader(false);
        setShowOTPView(false);
        setCode('');
        changeMobileNumberBottomSheetRef?.current?.closeSheet();
      }
    } else {
      setCode('');
      setOtpLoader(false);
    }
  };

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const checkIfDataUpdated = useCallback(() => {
  //   if (userEmail !== email) {
  //     onSubmitClick();
  //     return;
  //   } else if (first_name !== firstName) {
  //     onSubmitClick();
  //     return;
  //   } else if (last_name !== lastName) {
  //     onSubmitClick();
  //     return;
  //   }
  // });

  const checkIfDataUpdated = () => {
    onSubmitClick();
  };

  const handelFirstNameChange = text => {
    setFirstName(text);
    if (firstNameError) {
      setFirstNameError('');
    }
  };

  const handelLastNameChange = text => {
    setLastName(text);
    if (errorLastName) {
      setErrorLastName('');
    }
  };

  const handelEmailChange = text => {
    setEmail(text?.trim());
    if (emailError) {
      setEmailError('');
    }
  };

  const handelPhoneChange = text => {
    setMobile(text?.trim());
    if (mobileError) {
      setMobileError('');
    }
  };

  const handleCurrentPassword = text => {
    setCurrentPassword(text?.trim());
    if (currenntPasswordError) {
      setCurrentPasswordError('');
    }
  };
  const handelPasswordChange = text => {
    setPassword(text?.trim());
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handelConfirmPasswordChange = text => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const onSubmitEditing = key => {
    let nextKey;
    switch (key) {
      case INPUT_KEYS.CURRENT_PASSWORD:
        nextKey = INPUT_KEYS.NEW_PASSWORD;
        break;
      case INPUT_KEYS.NEW_PASSWORD:
        nextKey = INPUT_KEYS.CONFIRM_PASSWORD;
        break;
    }
    nextKey && inputsRef.current?.[nextKey]?.current?.focus();
  };

  const updateInfo = data => {
    dispatch(updateUser(data, true, communicationCallBack));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedEmailUpdate = useCallback(debounce(updateInfo, 700), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPNUpdate = useCallback(debounce(updateInfo, 700), []);

  const communicationCallBack = status => {
    setIsEmailToggleLoading(false);
    setIsPNToggleLoading(false);
  };

  const onChangePasswordUpdate = () => {
    Keyboard.dismiss();
    if (validatePasswordFields()) {
      const obj = {
        current_password: currenntPassword,
        password: password,
        password_confirmation: password,
      };
      dispatch(updateUser(obj, true, callBackStatus));
    }
  };

  const validatePasswordFields = () => {
    if (!currenntPassword) {
      setCurrentPasswordError(errors.password.required);
      return false;
    }
    if (!isValidPassword(currenntPassword)) {
      setCurrentPasswordError(errors.password.invalid);
      return false;
    }
    if (!password) {
      setPasswordError(errors.password.required);
      return false;
    }
    if (!isValidPassword(password)) {
      setPasswordError(errors.password.invalid);
      return false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(errors.password.required);
      return false;
    }
    if (!isValidPassword(confirmPassword)) {
      setConfirmPasswordError(errors.password.invalid);
      return false;
    }
    if (password.length < 8 || !password.match(PASSWORD_REGEX)) {
      setPasswordError(strings.passwordInstructions);
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError(errors.confirmPassword.invalid);
      return false;
    }
    return true;
  };
  const onPushNotificationTogglePress = () => {
    setIsPushNotificationToggleOn(!isPushNotificationToggleOn);
  };
  const onLOcationSharingToggle = () => {
    setIsLocationSharingToggleOn(!isLocationSharingToggleOn);
  };
  const onFaceIdToggle = () => {
    setIsFaceIdToggleOn(!isFaceIdToggleOn);
  };
  const onSMSToggle = value => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'via_text_message',
      click_destination: 'Via Text Message Checkbox toggled',
    });
    setISMSSubscribed(value);
  };

  const handleFCMToken = async value => {
    if (value === true) {
      try {
        if (Platform.OS === 'ios') {
          const token = await messaging().getAPNSToken();
          logToConsole({apnToken: token});
          dispatch(getFcmTokenSuccess(token));
          debouncedPNUpdate({marketing_pn_subscription: value, apn_token: token});
        } else {
          messaging()
            .registerDeviceForRemoteMessages()
            .then(async () => {
              const token = await messaging().getToken();
              dispatch(getFcmTokenSuccess(token));
              debouncedPNUpdate({marketing_pn_subscription: value, gcm_token: token});
            })
            .catch(e => {
              logToConsole({registerDeviceAndGetFCM: e.message});
            });
        }
      } catch (e) {
        logToConsole({registerDeviceAndGetFCM: e.message});
      }
    } else {
      dispatch(getFcmTokenSuccess(''));
      isIos
        ? debouncedPNUpdate({marketing_pn_subscription: value, apn_token: ''})
        : debouncedPNUpdate({marketing_pn_subscription: value, gcm_token: ''});
    }
  };
  const onEmailTogglePress = value => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'via_email',
      click_destination: 'Via Email Checkbox toggled',
    });
    setIsEmailToggleLoading(true);
    setIsEmailNotificationToggleOn(value);
    debouncedEmailUpdate({marketing_email_subscription: value});
  };
  const onPNToggle = async value => {
    logFirebaseCustomEvent(strings.click, {
      click_label: 'via_push_notification',
      click_destination: 'Via Push Notification Checkbox toggled',
    });
    messaging()
      .hasPermission()
      .then(async enabled => {
        if (enabled !== -1) {
          handleFCMToken(value).then(r => {
            setIsPNToggleLoading(true);
            setIsPNSubscribed(value);
          });
        } else {
          requestPermission(value).then(r => {
            setIsPNToggleLoading(true);
            setIsPNSubscribed(value);
          });
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };
  async function requestPermission(value) {
    if (Platform === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(
        status => {
          handlePermissionResult(status, value);
        },
      );
    } else {
      requestNotifications(['alert', 'sound']).then(({status, settings}) => {
        handlePermissionResult(status, value);
      });
    }
  }
  const handlePermissionResult = async (r, value) => {
    if (r === RESULTS.GRANTED) {
      handleFCMToken(value);
      displayToast('SUCCESS', 'Permission has been granted.');
    } else {
      Linking?.openSettings();
    }
  };
  const onPasswordTap = () => {
    Keyboard.dismiss();
    setHeaderTitle('change password');
    changePasswordBottomSheetRef?.current?.openSheet();
  };
  const onPhoneTap = () => {
    Keyboard.dismiss();
    setHeaderTitle('Edit phone');
    changeMobileNumberBottomSheetRef?.current?.openSheet();
  };
  const handleCrossBtn = () => {
    if (headerTitle === 'change password') {
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setCurrentPasswordError('');
      setPasswordError('');
      setConfirmPasswordError('');
      changePasswordBottomSheetRef?.current?.closeSheet();
      logFirebaseCustomEvent(strings.click, {
        click_label: 'crossIcon',
        click_destination: 'Close Change Password bottom Sheet',
      });
    } else {
      setMobile(phone);
      setShowOTPView(false);
      setCode('');
      setVerificationCodeError('');
      changeMobileNumberBottomSheetRef?.current?.closeSheet();
      logFirebaseCustomEvent(strings.click, {
        click_label: 'crossIcon',
        click_destination: 'Close Change Phone bottom Sheet',
      });
    }
  };

  const isPasswordCriteriaMet = useMemo(() => {
    return (
      currenntPassword.length >= 8 &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      currenntPassword?.trim() !== '' &&
      password?.trim() !== '' &&
      confirmPassword?.trim() !== ''
    );
  }, [currenntPassword, password, confirmPassword]);

  const phoneNumber = phone;
  const phoneRegex = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/;
  const isValidUSMobileNumber = useMemo(() => phoneRegex.test(phoneNumber), [phoneNumber]);

  const isPhoneCriteriaMet = useMemo(() => {
    return mobile?.trim()?.length >= 14;
  }, [mobile]);

  const onPhoneVerifyTap = () => {
    if (!first_name || !lastName || !isValidEmail(email)) {
      changeMobileNumberBottomSheetRef?.current?.closeSheet();
    } else {
      Keyboard?.dismiss();
      setOtpLoader(true);
      verifyPhoneNumber(`+1${mobile.replace(/\D/g, '')}`)
        .then(() => {
          sendOTP(`+1${mobile.replace(/\D/g, '')}`)
            .then(() => {
              setOtpLoader(false);
              setShowOTPView(true);
            })
            .catch(error => {
              setOtpLoader(false);
              displayToast('ERROR', 'Please provide a valid number');
              logToConsole({error});
            });
        })
        .catch(error => {
          setOtpLoader(false);
          displayToast('ERROR', 'This number is already in use.');
          logToConsole({error});
        });
    }
  };
  const onOTPVerify = () => {
    setOtpLoader(true);
    verifyOTP(`+1${mobile.replace(/\D/g, '')}`, code)
      .then(response => {
        logToConsole({response});
        if (response?.data?.valid) {
          updateUseronOurDB_();
        } else {
          displayToast('ERROR', 'Invalid code, please try again');
          setOtpLoader(false);
        }
      })
      .catch(error => {
        setVerificationCodeError('Invalid code, please try again');
        // displayToast('ERROR', 'Invalid code, please try again');
        setOtpLoader(false);
        logToConsole({e: error.response});
      });
  };

  const updateUseronOurDB_ = () => {
    updateUseronOurDB(`+1${mobile.replace(/\D/g, '')}`, email)
      .then(response => {
        onSubmitClick();
      })
      .catch(error => {
        setOtpLoader(false);
        logToConsole({error});
      });
  };

  const onPasswordUpdateBtn = () => {
    if (!first_name || !lastName || !isValidEmail(email)) {
      changePasswordBottomSheetRef?.current?.closeSheet();
    } else {
      onSubmitClick();
    }
  };

  const isSameNumber = phone === mobile;
  return {
    INPUT_KEYS,
    firstName,
    lastName,
    email,
    mobile,
    birthday,
    currenntPassword,
    password,
    confirmPassword,
    dob,
    checked,
    emailError,
    currenntPasswordError,
    passwordError,
    confirmPasswordError,
    firstNameError,
    errorLastName,
    locationError,
    mobileError,
    inputsRef,
    onSubmitClick,
    handelFirstNameChange,
    handelLastNameChange,
    handelEmailChange,
    handelPhoneChange,
    handleCurrentPassword,
    handelPasswordChange,
    handelConfirmPasswordChange,
    onSubmitEditing,
    setDob,
    setChecked,
    isToggleDisabled,
    onEmailTogglePress,
    onPushNotificationTogglePress,
    isPushNotificationToggleOn,
    isEmailNotificationToggleOn,
    userDataLoading,
    isLocationSharingToggleOn,
    onLOcationSharingToggle,
    onFaceIdToggle,
    onSMSToggle,
    onPNToggle,
    isFaceIdToggleOn,
    isSMSSubscribed,
    isPNSubscribed,
    onConsent,
    onPasswordTap,
    onPhoneTap,
    changePasswordBottomSheetRef,
    snapPoints,
    changeMobileNumberBottomSheetRef,
    headerTitle,
    handleCrossBtn,
    phoneNumberSnapPoints,
    isValidUSMobileNumber,
    isPasswordCriteriaMet,
    isPhoneCriteriaMet,
    onPhoneVerifyTap,
    isKeyboardOpen,
    phoneNumberSnapPoints_,
    showOTPView,
    verificationCodeError,
    setVerificationCodeError,
    code,
    setCode,
    onOTPVerify,
    checkIfDataUpdated,
    otpLoader,
    setOtpLoader,
    onPasswordUpdateBtn,
    isSameNumber,
    deleteAccountLoading,
    isFBUser,
    appleUser,
    onChangePasswordUpdate,
    isEmailToggleLoading,
    isPNToggleLoading,
  };
};

export default useProfileHook;
