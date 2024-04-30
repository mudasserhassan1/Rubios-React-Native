import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {isValidEmail} from '../../utils/validationUtils';
import {constants, strings} from '../../constants';
import {userForgotPasswordRequest} from '../../redux/actions/user';
import {openInbox} from 'react-native-email-link';
import {Keyboard} from 'react-native';
import {logFirebaseCustomEvent} from "../../utils/logFirebaseCustomeEvents";

const useForgotPasswordHook = () => {
  const INPUT_KEYS = {
    EMAIL: 'EMAIL',
  };

  const [email, setEmail] = useState('');
  const [btnDisabled, setBtnDisable] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [loadingAPICall, setIsLoading] = useState(false);
  const {loading: loadingUser} = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!email) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
  }, [email]);

  useEffect(() => {
    logFirebaseCustomEvent(strings.screen_name_filter, {
      screen_name: 'forgot_password_screen',
    });
  }, []);

  const handelEmailChange = text => {
    setEmail(text.replace(/\s/g, ''));
    if (emailError) {
      setEmailError('');
    }
  };

  const callBack = status => {
    setIsLoading(false);
  };
  const onResetPassword = () => {
    if (!isValidEmail(email)) {
      setEmailError(constants.AUTH_VALIDATION_ERRORS.email.invalid);
      return;
    }
    Keyboard?.dismiss();
    setIsLoading(true);
    dispatch(userForgotPasswordRequest({email}, callBack));
  };

  const handleOnOpenInboxPress = async () => {
    try {
      logFirebaseCustomEvent(strings.click, {
        click_label: strings.open_email,
        click_destination: 'open Native Mail Application',
      });
      await openInbox();
    } catch (e) {}
  };

  return {
    INPUT_KEYS,
    email,
    emailError,
    isLoading: loadingUser,
    handelEmailChange,
    onResetPassword,
    handleOnOpenInboxPress,
    btnDisabled,
    loadingAPICall,
  };
};

export default useForgotPasswordHook;
