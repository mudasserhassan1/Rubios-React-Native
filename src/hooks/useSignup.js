import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Keyboard, Linking, Platform, StyleSheet, TouchableOpacity, View,} from 'react-native';

import {constants, INPUT_KEYS, PASSWORD_REGEX, screens, strings} from '../constants';
import useAuthSelector from './reduxStateHooks/useAuthSelector';
import InputField from '../components/InputField';
import {currentDateTime, formatDateTime, formatTime} from '../utils/timeUtils';
import RText from '../components/RText';
import {colors} from '../theme';
import DatePicker from 'react-native-date-picker';
import {isValidEmail} from '../utils/validationUtils';
import {clearProviderError, updateUser, userRegister} from '../redux/actions/user';
import useBasketSelector from './reduxStateHooks/useBasketSelector';
import CheckBox from '../components/CheckBox/CheckBox';
import RButton from '../components/RButton';
import {navigateTo} from '../utils/navigationUtils';
import LocationsModal from '../screens/SignupScreen/LocationsModal';
import {getMScale, getScale, getVerticalScale, SCREEN_HEIGHT} from '../theme/metrics';
import useGuestSelector from './reduxStateHooks/useGuestSelector';
import ImageComponent from '../components/ImageComponent/ImageComponent';
import {images} from '../assets';
import EditIcon from '../assets/svgs/EditIcon';
import {formatLocationName, isIos} from '../utils/sharedUtils';
import {useRoute} from '@react-navigation/native';
import CheckIcon from '../assets/svgs/CheckIcon';
import CheckIconActive from '../assets/svgs/CheckIconActive';
import useUserSelector from './reduxStateHooks/useUserSelector';
import {logToConsole} from '../configs';
import {sendOTP, verifyOTP, verifyPhoneNumber} from '../services/otp';
import {displayToast, showAlert} from '../helpers/toast';
import {logFirebaseCustomEvent} from '../utils/logFirebaseCustomeEvents';
import messaging from '@react-native-firebase/messaging';
import {getFcmTokenSuccess} from '../redux/actions/token';
import useFirebaseConfigSelector from "./reduxStateHooks/useFirebaseConfigSelector";

const useSignup = ({registerType, orderMode}) => {
  const [inputState, setInputState] = useState({});
  const [inputError, setInputError] = useState({});
  const [favLocation, setFavLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleDobModal, setIsVisibleDobModal] = useState(false);
  const [isCheckedTermsAndCondition, setIsCheckedTermsAndCondition] = useState(false);
  const [isCheckedNewsLetter, setIsCheckedNewsLetter] = useState(true);
  const [isLocationsModelVisible, setLocationsModelVisible] = useState(false);
  const [agreeToReceiveSms, setAgreeToReceiveSms] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [singleLocation, setSingleLocation] = useState(null);

  const scrollRef = useRef(null);
  const inputsRef = useRef({});
  const isVerifiedMobile = useRef(false);

  const {params = {}} = useRoute();
  const {screenName = 'Home'} = params;


  const {INPUTS, PASSWORD_INPUTS, INVITE_CODE_INPUTS} = constants;
  const isRegisterCheckout = registerType === 'REGISTER_CHECKOUT';

  const {
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    password = '',
    confirmPassword = '',
    birthday,
    code = '',
    inviteCode = '',
  } = inputState || {};

  const {
    authToken: mAuthToken,
    authLoading: loadingAuth,
    providerLoading: loadingProvider,
    isLoggedIn,
    providerError,
    isSocialSignup,
  } = useAuthSelector();
  const {isGuest, guestUser} = useGuestSelector();
  const {basket} = useBasketSelector();
  const {userDataLoading, error: userError = {}, isAccessibilityOn} = useUserSelector();
  const {data: updateUserError = []} = userError || {};

  const {data = {}} = providerError || {};
  const {errors: {base = [], email: emailError = [], phone: phoneError = [], birthday: birthdayError = []} = {}} = data || {};

  const isInviteCodeError = useCallback(() => base?.[0]?.includes('invite code'), [base]);
  const isBirthdayError = useCallback(() => base?.[0]?.includes('young'), [base]);

  const dispatch = useDispatch();
  const {fcmToken = ''} = useSelector(state => state.token);

  const {privacy_policy_url, terms_and_conditions_url} = useFirebaseConfigSelector();
  useEffect(() => {
    Object.values(INPUT_KEYS).forEach(key => (inputsRef.current[key] = createRef()), {});
  }, []);

  //error handling for users in case of social signup
  useEffect(() => {
    if (isSocialSignup) {
      if (updateUserError?.length) {
        updateUserError?.forEach(item => {
          if (item.toLowerCase().includes('phone')) {
            scrollRef?.current?.scrollToPosition?.(0, 0, true);
            return setInputError(prevState => ({...prevState, [INPUT_KEYS.PHONE]: item}));
          }
          if (item.toLowerCase().includes('young')) {
            return setInputError(prevState => ({
              ...prevState,
              [INPUT_KEYS.BIRTHDAY]: 'You must be 13 years old to join Rubio’s Rewards',
            }));
          }
          if (item.toLowerCase().includes('invite code')) {
            return setInputError(prevState => ({
              ...prevState,
              [INPUT_KEYS.INVITE_CODE]: base?.[0] || 'Invalid invite code',
            }));
          }
        });
      }
    }
  }, [isSocialSignup, updateUserError]);

  const validateInputForApiErrors = () => {
    let key, error;
    if (emailError?.length) {
      scrollRef?.current?.scrollToPosition?.(0, 0, true);
      key = INPUT_KEYS.EMAIL;
      error = emailError?.[0];
    } else if (phoneError?.length) {
      key = INPUT_KEYS.PHONE;
      error = 'Mobile number is already in use';
      scrollRef?.current?.scrollToPosition?.(0, 0, true);
    } else if (base?.[0]?.includes('invite code')) {
      key = INPUT_KEYS.INVITE_CODE;
      error = base?.[0] || 'Invalid invite code';
    } else if (base?.[0]?.includes('young')) {
      key = INPUT_KEYS.BIRTHDAY;
      error = 'You must be 13 years old to join Rubio’s Rewards';
    }
    setInputError(prevState => ({
      ...prevState,
      [key]: error,
    }));
  }
  //normal user signup error handling
  useEffect(() => {
    validateInputForApiErrors();
  }, [providerError]);


  useEffect(() => {
    resetState();
  }, [mAuthToken, isGuest, guestUser, orderMode]);

  const {user: userProfile = {}} = useAuthSelector();
  const {
    first_name = '',
    last_name = '',
    email: emailaddress = '',
    phone: contactnumber = '',
  } = userProfile || {};

  const resetState = () => {
    setInputState({
      [INPUT_KEYS.FIRST_NAME]: isGuest ? guestUser?.firstname : first_name || '',
      [INPUT_KEYS.LAST_NAME]: isGuest ? guestUser?.lastname : last_name || '',
      [INPUT_KEYS.EMAIL]: isGuest ? guestUser?.emailaddress : emailaddress || '',
      [INPUT_KEYS.PHONE]: isGuest ? '' : contactnumber || '',
    });
    if (inputError[INPUT_KEYS.PHONE]) {
      setInputError(prevState => ({...prevState, [INPUT_KEYS.PHONE]: ''}));
    }
  };

  const showDobPicker = useCallback(() => setIsVisibleDobModal(true), []);
  const closeDobPicker = useCallback(() => setIsVisibleDobModal(false), []);
  const closeLocationModal = useCallback(() => {
    setLocationsModelVisible(false);
  }, []);

  const goToChooseLocationScreen = useCallback(() => {
    navigateTo(screens.CHOOSE_STORE, {
      onSelectItem: onFavLocationItemPress,
      choosingFavLocation: true,
    });
    Keyboard?.dismiss();
  }, []);

  const onChangeTermsAndConditionCheckbox = () => {
    setIsCheckedTermsAndCondition(prevState => !prevState);
  };

  const onChangeNewsLetterCheckbox = () => {
    setIsCheckedNewsLetter(prevState => !prevState);
  };

  const isButtonLoading = isLoading || loadingProvider || loadingAuth;
  const isMainSignup = registerType === 'REGISTER_MAIN';
  const isOrderConfirmationSignup = registerType === 'REGISTER_CONFIRMATION';

  // useEffect(() => {
  //   if (providerError && !loadingProvider) {
  //     setIsLoading(false);
  //   }
  // }, [loadingProvider]);

  useEffect(() => {
    if (fcmToken === null || fcmToken === '') {
      registerFCMToken().then();
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
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };
  const handleInputChange = (key, text) => {
    if (key === INPUT_KEYS.PASSWORD || key === INPUT_KEYS.CONFIRM_PASSWORD) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PASSWORD]: '',
        [INPUT_KEYS.CONFIRM_PASSWORD]: '',
      }));
    }
    // for all input fields
    if (inputError[key]) {
      setInputError(prevState => ({...prevState, [key]: ''}));
      //if error is stored in redux
      if (key === INPUT_KEYS.INVITE_CODE && isInviteCodeError()) {
        dispatch(clearProviderError());
      }
      if (key === INPUT_KEYS.EMAIL && emailError?.length) {
        dispatch(clearProviderError());
      }
      // Not an input field
      if (key === INPUT_KEYS.BIRTHDAY && isBirthdayError()) {
        dispatch(clearProviderError());
        setInputError(prevState => ({
          ...prevState,
          [INPUT_KEYS.BIRTHDAY]: '',
        }));
      }
    }
    if (key === INPUT_KEYS.PHONE) {
      setInputState(prevState => ({
        ...prevState,
        [INPUT_KEYS.VERIFICATION_CODE]: ''
      }))
      isVerifiedMobile.current = false;
    }
    setInputState(prevState => ({...prevState, [key]: text}));
  };

  const onSubmitEditing = key => {
    let nextKey;
    switch (key) {
      case INPUT_KEYS.FIRST_NAME:
        nextKey = INPUT_KEYS.LAST_NAME;
        break;
      case INPUT_KEYS.LAST_NAME:
        nextKey = isRegisterCheckout ? INPUT_KEYS.PHONE : INPUT_KEYS.EMAIL;
        break;
      case INPUT_KEYS.EMAIL:
        nextKey = isMainSignup ? INPUT_KEYS.PHONE : INPUT_KEYS.VEHICLE_MODEL;
        break;
      case INPUT_KEYS.PHONE:
        nextKey = isRegisterCheckout ? INPUT_KEYS.EMAIL : INPUT_KEYS.VERIFICATION_CODE;
        break;
      case INPUT_KEYS.VERIFICATION_CODE:
        nextKey = INPUT_KEYS.PASSWORD;
        break;
      case INPUT_KEYS.PASSWORD:
        nextKey = INPUT_KEYS.CONFIRM_PASSWORD;
        break;
      case INPUT_KEYS.CONFIRM_PASSWORD:
        Keyboard.dismiss();
        break;
      default:
        Keyboard.dismiss();
        break;
    }
    nextKey ? inputsRef.current?.[nextKey]?.current?.focus?.() : Keyboard.dismiss();
  };

  const validateUserInfoInputs = () => {
    if (!firstName) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.FIRST_NAME]: strings.first_name_required,
      }));
      return false;
    }
    if (!lastName) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.LAST_NAME]: strings.last_name_required,
      }));
      return false;
    }
    if (!email) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.EMAIL]: strings.email_required,
      }));
      return false;
    }
    if (!isValidEmail(email.trim())) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.EMAIL]: strings.email_invalid,
      }));
      return false;
    }
    return true;
  };

  const updateUserInfo = () => {
    const obj = {
      ...(isMainSignup && {invite_code: inviteCode}),
      marketing_email_subscription: isCheckedNewsLetter,
      terms_and_conditions: true,
      favourite_location_ids: singleLocation?.location_id ?? '',
      phone: phone.replace(/\D/g, ''),
    };
    if (birthday) {
      obj.birthday = formatDateTime(birthday, 'YYYY-MM-DD');
    }
    return dispatch(updateUser(obj, false, () => setIsLoading(false)));
  }
  const verifyPhoneAndSendCode = async () => {
    if (phone?.length < 10) {
      return setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PHONE]: 'Invalid phone number',
      }));
    }
    setIsOtpLoading(true);
    const mobileNumber = `+1${phone.replace(/\D/g, '')}`;
    await verifyPhoneNumber(mobileNumber).then(async () => {
      try {
        handleInputChange(INPUT_KEYS.VERIFICATION_CODE, '');
        await sendOTP(mobileNumber);
        setIsOtpLoading(false);
        showAlert({
          title: 'Verify Phone Number',
          message:
              "We've sent a text message with your verification code. Please enter the code and verify your phone number before continuing to the next step.",
          rightText: 'Verify Phone Number',
          onPressRight: () => inputsRef.current?.[INPUT_KEYS.VERIFICATION_CODE]?.current?.focus?.(),
        });
      } catch (e) {
        setIsOtpLoading(false);
        const {data = {}} = e?.response || {};
        const {message = ''} = data || {};
        if (message?.toLowerCase().includes('invalid')) {
          setInputError(prevState => ({
            ...prevState,
            [INPUT_KEYS.PHONE]: 'Invalid mobile number.',
          }));
        } else {
          displayToast('ERROR', 'Something is wrong at server. Please try again later.', true);
        }
      }
    }).catch(e => {
      setIsOtpLoading(false);
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PHONE]: 'Mobile number is already in use',
      }));
    })
  };

  const verifyMobileCode = async isUpdateProfile => {
    setIsLoading(true);
    const mobileNumber = `+1${phone.replace(/\D/g, '')}`;
    try {
      const verifyCodeResponse = await verifyOTP(mobileNumber, code);
      const {status = ''} = verifyCodeResponse?.data || {};
      if (status === 'approved') {
        isVerifiedMobile.current = true;
        if (isUpdateProfile) {
          updateUserInfo();
        } else {
          onSignup(screenName);
        }
      } else {
        isVerifiedMobile.current = false;
        setIsLoading(false);
        scrollRef.current?.scrollToPosition?.(0, 100, true);
        setInputError(prevState => ({
          ...prevState,
          [INPUT_KEYS.VERIFICATION_CODE]: 'Invalid code, please try again',
        }));
      }
    } catch (e) {
      isVerifiedMobile.current = false;
      setIsLoading(false);
      const {data = {}} = e?.response || {};
      const {message = ''} = data || {};
      if (message?.includes('code')) {
        scrollRef.current?.scrollToPosition?.(0, 100, true);
        setInputError(prevState => ({
          ...prevState,
          [INPUT_KEYS.VERIFICATION_CODE]: 'Invalid code, please try again',
        }));
      }
      logToConsole({e: e.response});
    }
  };
  const validateMobileNumberInput = () => {
    const filteredPhone = phone.replace(/\D/g, '');
    if (!isOrderConfirmationSignup && !filteredPhone) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PHONE]: strings.provide_a_phone_number,
      }));
      return false;
    }
    if (!isOrderConfirmationSignup && filteredPhone.length < 10) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PHONE]: strings.phone_invalid,
      }));
      return false;
    }

    return true;
  };

  const validatePasswordInputs = () => {
    if (password.length === 0) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PASSWORD]: strings.password_required,
      }));
      scrollRef?.current?.scrollToPosition?.(0, SCREEN_HEIGHT / 2, true);
      return false;
    }
    if (password.length < 8 || !password.match(PASSWORD_REGEX)) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.PASSWORD]: strings.password_invalid,
      }));
      scrollRef?.current?.scrollToPosition?.(0, SCREEN_HEIGHT / 2, true);
      return false;
    }
    if (confirmPassword?.length === 0) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.CONFIRM_PASSWORD]: strings.confirm_password_required,
      }));
      scrollRef?.current?.scrollToPosition?.(0, SCREEN_HEIGHT / 2, true);
      return false;
    }
    if (String(password) !== String(confirmPassword)) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.CONFIRM_PASSWORD]: strings.password_must_match,
        [INPUT_KEYS.PASSWORD]: strings.password_must_match,
      }));
      scrollRef?.current?.scrollToPosition?.(0, SCREEN_HEIGHT / 2, true);
      return false;
    }
    return true;
  };

  const validateFavLocation = () => {
    if (isMainSignup && favLocation === null) {
      setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.LOCATIONS]: errors.location.required,
      }));
      return false;
    }
    return true;
  };

  const isGuestSingUpButtonDisabled = useMemo(
    () =>
      Boolean(
        !firstName.trim() ||
          !lastName.trim() ||
          !email.trim() ||
          // (phone && !phone.trim()) ||
          !password.trim() ||
          !confirmPassword.trim() ||
          !isCheckedTermsAndCondition ||
          loadingProvider ||
          loadingAuth,
      ),
    [
      confirmPassword,
      email,
      firstName,
      isCheckedTermsAndCondition,
      lastName,
      loadingAuth,
      loadingProvider,
      password,
    ],
  );

  const handleAgreeToReceiveSms = () => setAgreeToReceiveSms(prevState => !prevState);

  const onFavLocationItemPress = (storeItem, singleLocationStore) => {
    handleInputChange(INPUT_KEYS.LOCATIONS, storeItem.name);
    setFavLocation(storeItem);
    setInputError(prevState => ({...prevState, [INPUT_KEYS.LOCATIONS]: ''}));
    setSingleLocation(singleLocationStore);
  };

  const formattedDob = useMemo(
    () => (birthday ? formatTime(birthday, constants.TIME_FORMAT.MDY_SLASH) : ''),
    [birthday],
  );

  const errors = constants.AUTH_VALIDATION_ERRORS;

  const handleButtonPress = async () => {
    Keyboard?.dismiss();
    if (validateFavLocation()) {
      if (isSocialSignup) {
        if (!isVerifiedMobile?.current) {
          return await verifyMobileCode(true);
        }
        return updateUserInfo();
      }
      if (validatePasswordInputs()) {
        if (!isVerifiedMobile?.current) {
          return await verifyMobileCode();
        }
        return onSignup(screenName);
      }
    }
  };

  const isButtonDisabled = useMemo(() => {
    return (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      (!isSocialSignup && (!password?.trim() || !confirmPassword?.trim())) ||
      !isCheckedTermsAndCondition ||
      !phone?.trim() ||
      // !agreeToReceiveSms ||
      isOtpLoading ||
          // isValidMobile ||
      code?.length < 4 ||
          inputError[INPUT_KEYS.EMAIL] ||
          inputError[INPUT_KEYS.PHONE] ||
          inputError[INPUT_KEYS.VERIFICATION_CODE] ||
      !favLocation ||
      isInviteCodeError() ||
      userDataLoading ||
      isLoading
    );
  }, [
    firstName,
    lastName,
    email,
    isSocialSignup,
    password,
    confirmPassword,
    isCheckedTermsAndCondition,
    phone,
    // agreeToReceiveSms,
    // isValidMobile,
    isOtpLoading,
    code?.length,
    favLocation,
    isInviteCodeError,
    userDataLoading,
    isLoading,
  ]);

  const getParsedPhoneNumber = () => {
    const number = phone || '';
    const unmasked = `+1${number?.replace(/\D/g, '')}`;
    if (unmasked.length >= 10) {
      const firstThree = unmasked?.slice(0, 2);
      const lastFour = unmasked?.slice(unmasked.length - 4, unmasked.length);
      return `${firstThree} XXX XXX ${lastFour}`;
    }
    return number;
  };

  const onSignup = (screenName) => {
    Keyboard?.dismiss();
    const today = formatDateTime(new Date(), 'DD-MM-YYYY');
    const birthdate = birthday ? formatDateTime(birthday, 'DD-MM-YYYY') : '';
    if (birthday && (today === birthdate)) {
      setIsLoading(false);
      return setInputError(prevState => ({
        ...prevState,
        [INPUT_KEYS.BIRTHDAY]: 'You must be 13 years old to join Rubio’s Rewards',
      }))
    }
    setIsLoading(true);
    const obj = {
      first_name: firstName,
      last_name: lastName,
      email: email.trim(),
      ...(!isOrderConfirmationSignup && {phone: phone.replace(/\D/g, ''),}),
      password: password,
      password_confirmation: password,
      favourite_location_ids: singleLocation?.location_id ?? '',
      ...(isMainSignup && {invite_code: inviteCode}),
      marketing_email_subscription: isCheckedNewsLetter,
      marketing_pn_subscription: !!fcmToken,
      terms_and_conditions: true,
    };
    if (birthday) {
      obj.birthday = formatDateTime(birthday, 'YYYY-MM-DD');
    }
    if (screenName === 'CHECKOUT') {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'signup',
        click_destination: screens.CHECKOUT,
      }).then();
    } else {
      logFirebaseCustomEvent(strings.click, {
        click_label: 'signup',
        click_destination: screens.HOME_SCREEN,
      }).then();
    }
     logFirebaseCustomEvent(strings.click, {
       click_label: strings.complete,
       click_destination: screens.HOME_SCREEN,
     }).then();
    return dispatch(userRegister(obj, registerType, basket?.id || '', isGuest, screenName, () => setIsLoading(false)));
  };

  const onTermOfUsePress = () => {
    if (isAccessibilityOn) {
      return;
    }
    Keyboard?.dismiss();
    Linking?.canOpenURL(terms_and_conditions_url).then(supported => {
      if (supported) {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'terms_of_use',
          click_destination: 'Open Terms Of Use URL in browser',
        }).then();
        Linking?.openURL(terms_and_conditions_url);
      }
    });
  };

  const onPrivacyPolicyPress = () => {
    if (isAccessibilityOn) {
      return;
    }
    Keyboard?.dismiss();
    Linking?.canOpenURL(privacy_policy_url).then(supported => {
      if (supported) {
        logFirebaseCustomEvent(strings.click, {
          click_label: 'privacy_policy',
          click_destination: 'Open Privacy Policy URL in browser',
        }).then();
        Linking?.openURL(privacy_policy_url);
      }
    });
  };

  const renderUserInfoInputsJSX = () => {
    return INPUTS.map(item => {
      const {key, isMasked = false, placeHolder, ...rest} = item || {};
      if (key === INPUT_KEYS.PHONE || key === INPUT_KEYS.VERIFICATION_CODE) {
        return null;
      }
      if (isRegisterCheckout && key === INPUT_KEYS.EMAIL) {
        return null;
      }
      return (
        <InputField
          isMaskedInput={isMasked}
          key={key}
          ref={inputsRef.current[key]}
          placeholder={placeHolder}
          value={inputState[key]}
          onChangeText={text => handleInputChange(key, text)}
          error={inputError[key]}
          editable={!isLoggedIn || key === INPUT_KEYS.PHONE}
          onSubmitEditing={() => onSubmitEditing(key)}
          {...rest}
        />
      );
    });
  };

  const renderEmailInput = () => {
    return INPUTS.map(item => {
      const {key, isMasked = false, placeHolder, ...rest} = item || {};
      if (key === INPUT_KEYS.EMAIL) {
        return (
          <InputField
            isMaskedInput={isMasked}
            key={key}
            ref={inputsRef.current[key]}
            placeholder={'Enter Email'}
            value={inputState[key]}
            onChangeText={text => handleInputChange(key, text)}
            error={inputError[key]}
            editable={!isLoggedIn || key === INPUT_KEYS.PHONE}
            onSubmitEditing={() => onSubmitEditing(key)}
            RightAccessoryComponent={() => (
              <View style={{alignSelf: 'center', marginEnd: getMScale(15)}}>
                {!inputError[key] && isValidEmail(inputState?.[key] || '') ? (
                  <CheckIconActive />
                ) : (
                  <CheckIcon />
                )}
              </View>
            )}
            {...rest}
          />
        );
      }
      return null;
    });
  };

  const renderPhoneInputRightAccessory = () => {
    if (!isRegisterCheckout) {
      return (
        <TouchableOpacity
          onPress={verifyPhoneAndSendCode}
          activeOpacity={0.7}
          accessible
          disabled={phone?.length === 0}
          accessibilityState={isIos ? {disabled: phone.length === 0}: {}}
          accessibilityLabel={'Verify'}
          accessibilityRole={'button'}
          accessibilityHint={phone.length === 0 ? 'Enter phone number to enable' : 'Activate to send verification code'}
          style={{alignSelf: 'center', end: 20}}>
          {isOtpLoading ? (
            <ActivityIndicator color={colors.secondaryColor} size={'small'} />
          ) : (
            <RText
              text={'Verify'}
              color={!inputState[INPUT_KEYS.PHONE] ? '#d9d9d9' : colors.primaryLink}
            />
          )}
        </TouchableOpacity>
      );
    }
    return null;
  };
  const renderMobileNumberInput = () => {
    return INPUTS.map(item => {
      const {key, isMasked = false, placeHolder, ...rest} = item || {};
      if (key === INPUT_KEYS.PHONE) {
        return (
          <InputField
            isMaskedInput={isMasked}
            key={key}
            ref={inputsRef.current[key]}
            placeholder={isRegisterCheckout ? 'Enter Mobile Number' : placeHolder}
            value={inputState[key]}
            onChangeText={text => handleInputChange(key, text)}
            error={inputError[key]}
            RightAccessoryComponent={renderPhoneInputRightAccessory}
            editable={!isLoggedIn || key === INPUT_KEYS.PHONE}
            onSubmitEditing={!isRegisterCheckout ?  verifyPhoneAndSendCode : null}
            {...rest}
          />
        );
      }
    });
  };

  const renderVerificationCodeInput = () => {
    return INPUTS.map(item => {
      const {key, placeHolder, ...rest} = item || {};
      if (key === INPUT_KEYS.VERIFICATION_CODE) {
        return (
          <InputField
            key={key}
            ref={inputsRef.current[key]}
            placeholder={placeHolder}
            value={inputState[key]}
            keyboardType={constants.KEYBOARD_TYPES.NUMERIC}
            onChangeText={text => handleInputChange(key, text)}
            error={inputError[key]}
            onSubmitEditing={() => isSocialSignup ? Keyboard.dismiss() : onSubmitEditing(key)}
            {...rest}
          />
        );
      }
    });
  };

  const renderPasswordInputsJSX = () => {
    return PASSWORD_INPUTS.map(item => {
      const {key, placeHolder, isBirthdayField, ...rest} = item || {};
      if (key === INPUT_KEYS.INVITE_CODE && !isMainSignup) {
        return null;
      }
      return (
        <InputField
          onPress={showDobPicker}
          key={key}
          ref={inputsRef.current[key]}
          inputStyle={key === INPUT_KEYS.BIRTHDAY && {color: colors.black}}
          placeholder={placeHolder}
          isPasswordInput
          value={key === INPUT_KEYS.BIRTHDAY ? formattedDob : inputState[key]}
          onChangeText={text => handleInputChange(key, text)}
          error={inputError[key]}
          onSubmitEditing={() => onSubmitEditing(key)}
          {...rest}
        />
      );
    });
  };

  const renderDOBPicker = () => {
    return (
      <DatePicker
        accessible
        accessibilityHint={'activate to open date picker.'}
        modal
        allowFontSacaling={false}
        open={isVisibleDobModal}
        mode="date"
        date={inputState[INPUT_KEYS.BIRTHDAY] || currentDateTime}
        maximumDate={new Date()}
        onConfirm={date => {
          closeDobPicker();
          handleInputChange(INPUT_KEYS.BIRTHDAY, date);
        }}
        onCancel={closeDobPicker}
      />
    );
  };

  const renderLocationModalJSX = () => {
    return (
      <LocationsModal
        isVisible={isLocationsModelVisible}
        onClose={closeLocationModal}
        onItemClick={onFavLocationItemPress}
      />
    );
  };

  const renderTermsAndConditionsCheckboxJSX = () => {
    return (
      <View
          onAccessibilityTap={onChangeTermsAndConditionCheckbox}
          accessibilityRole={'checkbox'}
          accessible
          accessibilityHint={`activate to toggle setting`}
          accessibilityState={isIos ?  {checked: !!isCheckedTermsAndCondition} : {}}
          style={[styles.checkBoxContainer, isRegisterCheckout && {paddingStart: 10}]}>
        <CheckBox
            accessible={false}
            checked={isCheckedTermsAndCondition}
            height={isRegisterCheckout ? 15 : 20}
            width={isRegisterCheckout ? 15 : 20}
            onValueChange={onChangeTermsAndConditionCheckbox}>
          <RText
            size={'xxs'}
            accessibilityElementsHidden
            style={[styles.text, isOrderConfirmationSignup && {color: colors.white}]}>
            {strings.term1}{' '}
            <RText
              text={strings.term2 + ' '}
              size={'xxs'}
              textStyle={styles.underLinedText}
              weight={'semiBold'}
              onPress={onTermOfUsePress}
            />
            <RText size={'xxs'} text={strings.term3 + ' '} />
            <RText
              text={strings.privacy_policy}
              weight={'semiBold'}
              size={'xxs'}
              onPress={onPrivacyPolicyPress}
              textStyle={styles.underLinedText}
            />
          </RText>
        </CheckBox>
      </View>
    );
  };

  const renderEmailUpdatesCheckboxJSX = () => {
    return (
      <View
          style={[styles.checkBoxContainer, isRegisterCheckout && {paddingStart: 0}]}>
        <CheckBox
          height={isRegisterCheckout ? 15 : 20}
          width={isRegisterCheckout ? 15 : 20}
          textSize={isRegisterCheckout ? 'xxs' : 'xs'}
          checked={isCheckedNewsLetter}
          onValueChange={onChangeNewsLetterCheckbox}
          text={
            isRegisterCheckout
              ? 'Send me emails with special offers and updates'
              : strings.email_updates_text
          }
        />
      </View>
    );
  };

  const renderAlreadyAMemberJSX = () => {
    return (
      <View style={styles.alreadyMemberView}>
        <RText text={'Already a Member? '} />
        <TouchableOpacity
          accessible
          accessibilityHint={'activate to go to login screen.'}
          onPress={() => navigateTo(screens.SIGN_IN)}>
          <RText
            text={'Login'}
            textStyle={{textDecorationLine: 'underline'}}
            preset={'bold'}
            color={colors.secondaryColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const buttonTitle = useMemo(() => {
    if (isMainSignup) {
      return strings.complete;
    }
    return strings.signup;
  }, [isMainSignup]);

  const renderSignupButtonJSX = () => {
    const isDisabled = (isMainSignup || isOrderConfirmationSignup || isSocialSignup)
        ? !!isButtonDisabled
        : !!isGuestSingUpButtonDisabled;
    return (
      <View style={{marginTop: getMScale(30), alignSelf: 'center'}}>
        <RButton
          accessibilityHint={isDisabled ? 'complete all information to activate' : 'activate to sign up.'}
          onPress={handleButtonPress}
          title={buttonTitle}
          loading={isLoading || isOtpLoading || (isSocialSignup && userDataLoading)}
          disabled={isDisabled}
        />
      </View>
    );
  };

  //For guest checkout screen
  const renderSignupAndLoginButton = () => {
    return (
      <View
        style={{
          marginVertical: getMScale(30),
          // justifyContent: 'space-between',
          // flexDirection: 'row',
          alignItems: 'center',
          width: '95%',
          alignSelf: 'center',
        }}>
        <RButton
          accessibilityHint={'activate to complete sign up.'}
          onPress={() => {
            if (validatePasswordInputs()) {
              onSignup('CHECKOUT');
            }
          }}
          title={buttonTitle}
          buttonStyle={{width: '100%'}}
          loading={isButtonLoading}
          disabled={
            isMainSignup || isOrderConfirmationSignup
              ? isButtonDisabled
              : isGuestSingUpButtonDisabled
          }
        />
        <View style={[styles.alreadyMemberView, {marginTop: getMScale(10)}]}>
          <RText text={'Already a Member? '} size={'xs'} />
          <TouchableOpacity
            accessible
            accessibilityHint={'activate to go to login screen'}
            disabled={isButtonLoading}
            onPress={() =>
              navigateTo('AuthStack', {
                screen: screens.SIGN_IN,
                params: {screenName: screens.CHECKOUT},
              })
            }>
            <RText
              text={'Login'}
              textStyle={{textDecorationLine: 'underline'}}
              preset={'bold'}
              size={'xs'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderAgreeToReceiveSms = () => {
    return (
      <View style={styles.checkBoxContainer}>
        <CheckBox
          checked={agreeToReceiveSms}
          color={colors.palette.black_53}
          onValueChange={handleAgreeToReceiveSms}
          text={strings.agree_to_receive_sms}
          height={20}
          width={20}
        />
      </View>
    );
  };

  const renderBirthdayInput = () => {
    return INVITE_CODE_INPUTS.map(item => {
      const {key} = item || {};
      if (key === INPUT_KEYS.BIRTHDAY) {
        return (
          <InputField
            key={INPUT_KEYS.BIRTHDAY}
            ref={inputsRef.current[INPUT_KEYS.BIRTHDAY]}
            placeholder={'MM/DD/YYYY'}
            label={isRegisterCheckout ? 'Birthday (Optional)' : strings.birthday}
            inputStyle={{color: colors.black}}
            value={formattedDob}
            editable={false}
            error={inputError[INPUT_KEYS.BIRTHDAY]}
            onPress={showDobPicker}
            pointerEvents={'none'}
          />
        );
      }
      return null;
    });
  };

  const renderInviteCodeInput = () => {
    return INVITE_CODE_INPUTS.map(item => {
      const {key} = item || {};
      if (key === INPUT_KEYS.INVITE_CODE) {
        return (
          <InputField
            key={key}
            ref={inputsRef.current[INPUT_KEYS.INVITE_CODE]}
            placeholder={strings.enter_referral_code}
            label={strings.referral_code}
            onChangeText={text => handleInputChange(INPUT_KEYS.INVITE_CODE, text)}
            inputStyle={{color: colors.black}}
            value={inviteCode}
            error={inputError[INPUT_KEYS.INVITE_CODE]}
          />
        );
      }
      return null;
    });
  };
  const renderSelectedLocationView = () => {
    const {
      name = '',
      streetaddress = '',
      city = '',
      distance = '',
      calendars = [],
    } = favLocation || {};
    const {ranges = []} = calendars?.[0] || [];
    const {end = ''} = ranges?.[0] || {};
    const formattedName = formatLocationName(name);

    return (
      <View
          accessible
          accessibilityHint={'activate to change favourite location'}
          onAccessibilityTap={goToChooseLocationScreen}
          style={styles.selectedLocationParent}>
        <ImageComponent source={images.selected_loc} style={{width: 70, height: 70}} />
        <View style={styles.locationItemParent}>
          <View style={styles.locationInfoView}>
            <RText text={formattedName} textStyle={styles.locationName} weight={'bold'} />
            <RText
              text={`${streetaddress}, ${city}`}
              textStyle={{marginTop: 3}}
              color={colors.subTitleText}
              size={'xs'}
            />
            {calendars?.length > 0 ? (
              <RText
                text={`${distance} mi • Open until ${formatDateTime(
                  end,
                  'hh:mm A',
                  constants.TIME_FORMAT.YYYYMMDD_HH_mm,
                )}`}
                size={'xs'}
                color={colors.subTitleText}
                textStyle={{marginTop: 3}}
              />
            ) : null}
          </View>
          <TouchableOpacity
            accessible
            accessibilityHint={'activate to open location modal.'}
            activeOpacity={0.5}
            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
            onPress={goToChooseLocationScreen}
            style={styles.editIconView}>
            <EditIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderFavLocationView = () => {
    return (
      <View style={{marginVertical: getVerticalScale(10)}}>
        <RText text={strings.favourite_restaurant} accessibilityRole={'header'} weight={'semiBold'} size={'md'} />
        <RText
          text={strings.favourite_restaurant_message}
          color={colors.subTitleText}
          size={'xs'}
          textStyle={{marginTop: getVerticalScale(10)}}
        />
        {favLocation ? (
          <>{renderSelectedLocationView()}</>
        ) : (
          <TouchableOpacity
            accessible
            accessibilityLabel={favLocation ? 'Edit Favourite location' : 'add favourite location'}
            accessibilityRole={'button'}
            accessibilityHint={'activate to open location modal.'}
            activeOpacity={0.8}
            onPress={goToChooseLocationScreen}
            style={{flexDirection: 'row', alignItem: 'center', marginTop: 10}}>
            <ImageComponent
              source={images.add_location}
              style={{width: 25, height: 25}}
            />
            <RText
              text={strings.add_fav_location}
              color={colors.secondary}
              size={'xs'}
              weight={'semiBold'}
              textStyle={{marginStart: 10, alignSelf: 'center', textDecorationLine: 'underline'}}
            />
          </TouchableOpacity>
        )}
        {inputError[INPUT_KEYS.LOCATIONS] ? (
          <RText
            text={inputError[INPUT_KEYS.LOCATIONS]}
            color={colors.error}
            textStyle={{marginTop: 10}}
          />
        ) : null}
      </View>
    );
  };

  const renderInviteCodeView = () => {
    return (
      <View style={{marginVertical: 10}}>
        <RText text={strings.invite_code} accessibilityRole={'header'} size={'md'} weight={'semiBold'} />
        <RText
          text={strings.invite_code_message}
          color={colors.subTitleText}
          size={'xs'}
          textStyle={{marginTop: getVerticalScale(10)}}
        />
        <View style={{marginTop: getMScale(7)}}>{renderInviteCodeInput()}</View>
      </View>
    );
  };

  return {
    isButtonLoading,
    isSocialSignup,
    renderUserInfoInputsJSX,
    renderPasswordInputsJSX,
    renderTermsAndConditionsCheckboxJSX,
    renderEmailUpdatesCheckboxJSX,
    renderAlreadyAMemberJSX,
    renderSignupButtonJSX,
    renderDOBPicker,
    validateUserInfoInputs,
    validatePasswordInputs,
    handleInputChange,
    renderEmailInput,
    renderMobileNumberInput,
    renderLocationModalJSX,
    renderAgreeToReceiveSms,
    renderBirthdayInput,
    renderFavLocationView,
    renderInviteCodeView,
    renderInviteCodeInput,
    renderSignupAndLoginButton,
    validateMobileNumberInput,
    renderVerificationCodeInput,
    inputState,
    inputError,
    INPUT_KEYS,
    isCheckedTermsAndCondition,
    isCheckedNewsLetter,
    getParsedPhoneNumber,
    resetState,
    isLoggedIn,
    scrollRef,
  };
};

const styles = StyleSheet.create({
  link: {
    color: '#6178f7',
  },
  checkBoxContainer: {
    marginVertical: getMScale(10),
    paddingHorizontal: getMScale(15),
  },
  checkBox: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
    alignSelf: 'flex-start',
  },
  emailUpdatesTextStyle: {
    marginStart: getMScale(5),
    paddingEnd: getMScale(20),
  },
  text: {
    marginStart: getMScale(10),
    paddingEnd: getMScale(22),
    alignItems: 'center',
  },
  alreadyMemberView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underLinedText: {
    textDecorationLine: 'underline',
    color: colors.primaryLink,
  },
  selectedLocationParent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationItemParent: {
    marginVertical: getVerticalScale(10),
    paddingStart: getMScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  locationInfoView: {width: '90%', marginStart: getMScale(10)},
  locationName: {textTransform: 'uppercase'},
  editIconView: {alignSelf: 'center', alignItems: 'flex-end', width: '20%'},
  editIcon: {width: getScale(20), height: getScale(20), alignSelf: 'flex-end'},
});
export default useSignup;
