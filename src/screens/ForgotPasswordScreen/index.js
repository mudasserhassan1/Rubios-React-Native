import React from 'react';
import styles from './styles';
import {strings} from '../../constants';
import InputField from '../../components/InputField';
import RButton from '../../components/RButton';
import RText from '../../components/RText';
import useForgotPasswordHook from './useForgotPasswordHook';
import {Screen} from '../../components/Screen';
import {colors} from '../../theme';
import {TouchableOpacity} from 'react-native';

const ForgotPasswordScreen = () => {
  const {
    INPUT_KEYS,
    email,
    emailError,
    loadingAPICall,
    handelEmailChange,
    onResetPassword,
    handleOnOpenInboxPress,
    btnDisabled,
  } = useForgotPasswordHook();

  return (
    <Screen preset={'scroll'} withHeader backgroundColor={colors.white} style={styles.screen}>
      <RText textStyle={styles.info} color={colors.textGray} text={strings.forgot_password_info} />
      <InputField
        key={INPUT_KEYS.EMAIL}
        placeholder={strings.enter_email}
        value={email}
        label={strings.email_address}
        onChangeText={handelEmailChange}
        blurOnSubmit={false}
        error={emailError}
        containerStyle={styles.input}
        onSubmitEditing={onResetPassword}
        returnKeyType={'done'}
      />
      <RButton
        accessibilityHint={'activate to send verification link on your email address.'}
        onPress={onResetPassword}
        title={strings.send_instructions}
        buttonStyle={styles.button}
        loading={loadingAPICall}
        disabled={loadingAPICall || btnDisabled || !!emailError}
      />
      <TouchableOpacity
        accessible
        accessibilityHint={'activate to open your email app.'}
        onPress={handleOnOpenInboxPress}
        style={{alignSelf: 'center'}}>
        <RText
          size={'medium'}
          color={colors.primaryLink}
          text={strings.open_email}
          textStyle={styles.openEmailTextStyle}
        />
      </TouchableOpacity>
    </Screen>
  );
};

export default ForgotPasswordScreen;
