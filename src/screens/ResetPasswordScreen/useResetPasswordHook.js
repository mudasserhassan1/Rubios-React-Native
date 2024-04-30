import {createRef, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {isValidPassword} from '../../utils/validationUtils';
import {userResetPasswordRequest} from '../../redux/actions/user';
import {useNavigation} from '@react-navigation/native';
import {resetAndNavigate} from '../../utils/navigationUtils';
import { screens, strings } from "../../constants";
import {PASSWORD_REGEX} from '../../hooks/useSignup';
import {logFirebaseCustomEvent} from '../../utils/logFirebaseCustomeEvents';

export const INPUT_KEYS = {
  PASSWORD: 'PASSWORD',
  CONFIRM_PASSWORD: 'CONFIRM_PASSWORD',
};

const useResetPasswordHook = ({route}) => {
  const [password, setPassword] = useState('');
  const [resetPasswordToken, setResetPasswordToken] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordSecureTextEntry, setPasswordSecureTextEntry] = useState(true);
  const [confirmPasswordSecureTextEntry, setConfirmPasswordSecureTextEntry] = useState(true);

  const {loadingAuth} = useSelector(({user: {loading: loadingAuth}}) => ({
    loadingAuth,
  }));
  const isLoading = loadingAuth;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setParams({
      backPress: () => resetAndNavigate(screens.SIGN_IN),
    });
  }, [navigation]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'reset_password_screen',
    }).then();
  }, []);

  const onSubmitClick = () => {
    if (!isValidPassword(password) || !password.match(PASSWORD_REGEX)) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Password does not match');
      setConfirmPasswordError('Password does not match');
      return;
    }
    const data = {
      password: password,
      password_confirmation: confirmPassword,
    };
    dispatch(userResetPasswordRequest(data, resetPasswordToken));
  };

  const handlePasswordVisibility = () => setPasswordSecureTextEntry(prevState => !prevState);
  const handleConfirmPasswordVisibility = () =>
    setConfirmPasswordSecureTextEntry(prevState => !prevState);

  const handelPasswordChange = text => {
    setPassword(text);
    if (passwordError || confirmPasswordError) {
      setPasswordError('');
      setConfirmPasswordError('');
    }
  };
  const handelConfirmPasswordChange = text => {
    setConfirmPassword(text);
    if (passwordError || confirmPasswordError) {
      setPasswordError('');
      setConfirmPasswordError('');
    }
  };

  const validatePassword = () => {
    if (!isValidPassword(password)) {
      setPasswordError('Password must be greater than 8');
    } else {
      setPasswordError('');
      setConfirmPasswordError('');
    }
  };
  const validateConfirmPassword = () => {
    if (!isValidPassword(confirmPassword)) {
      setConfirmPasswordError('Password should be greater than 8');
    } else {
      setPasswordError('');
      setConfirmPasswordError('');
    }
  };
  const inputsRef = useRef({});

  useEffect(() => {
    setResetPasswordToken(route.params.paramKey);
    Object.values(INPUT_KEYS).forEach(key => (inputsRef.current[key] = createRef()), {});
  }, [route.params.paramKey]);
  const onSubmitEditing = key => {
    let nextKey;
    switch (key) {
      case INPUT_KEYS.PASSWORD:
        nextKey = INPUT_KEYS.CONFIRM_PASSWORD;
        break;
    }
    nextKey && inputsRef.current?.[nextKey]?.current?.focus?.();
  };
  return {
    password,
    resetPasswordToken,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    isLoading,
    onSubmitClick,
    handelPasswordChange,
    handelConfirmPasswordChange,
    validateConfirmPassword,
    onSubmitEditing,
    inputsRef,
    validatePassword,
    passwordSecureTextEntry,
    confirmPasswordSecureTextEntry,
    handlePasswordVisibility,
    handleConfirmPasswordVisibility,
    isButtonDisabled:
      !isValidPassword(password) ||
      !isValidPassword(confirmPassword) ||
      !!passwordError ||
      !!confirmPasswordError,
  };
};
export default useResetPasswordHook;
