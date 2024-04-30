import React from 'react';
import styles from './styles';
import {screens, strings} from '../../constants';
import InputField from '../../components/InputField';
import RButton from '../../components/RButton';
import RText from '../../components/RText';
import useResetPasswordHook, {INPUT_KEYS} from './useResetPasswordHook';
import {Screen} from '../../components/Screen';
import {colors} from '../../theme';
import {View} from 'react-native';
import {getVerticalScale} from '../../theme/metrics';

const ResetPasswordScreen = ({route}) => {
  const {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    isLoading,
    inputsRef,
    onSubmitClick,
    handelPasswordChange,
    handelConfirmPasswordChange,
    onSubmitEditing,
    isButtonDisabled,
  } = useResetPasswordHook({route});

  return (
    <Screen preset={'scroll'} backgroundColor={colors.white} withHeader style={styles.screen}>
      <RText
        textStyle={styles.title}
        text={strings.reset_password_info}
        color={colors.subTitleText}
      />
      <View style={{marginTop: getVerticalScale(10)}}>
        <InputField
          key={INPUT_KEYS.PASSWORD}
          ref={inputsRef.current[INPUT_KEYS.PASSWORD]}
          placeholder={strings.enter_password}
          value={password}
          label={'Password'}
          // onBlur={validatePassword}
          onChangeText={handelPasswordChange}
          isPasswordInput
          blurOnSubmit={false}
          error={passwordError}
          onSubmitEditing={() => onSubmitEditing(INPUT_KEYS.PASSWORD)}
        />
        <InputField
          key={INPUT_KEYS.CONFIRM_PASSWORD}
          ref={inputsRef.current[INPUT_KEYS.CONFIRM_PASSWORD]}
          placeholder={strings.enter_password}
          value={confirmPassword}
          label={'Confirm Password'}
          onChangeText={handelConfirmPasswordChange}
          isPasswordInput
          blurOnSubmit={false}
          error={confirmPasswordError}
          onSubmitEditing={() => onSubmitEditing(INPUT_KEYS.CONFIRM_PASSWORD)}
        />
      </View>
      <RButton
        accessibilityHint={'activate to reset password'}
        onPress={onSubmitClick}
        title={strings.reset_password_}
        buttonStyle={styles.button}
        click_label={strings.reset_password_}
        click_destination={screens.SIGN_IN}
        loading={isLoading}
        disabled={isButtonDisabled || isLoading}
      />
    </Screen>
  );
};

export default ResetPasswordScreen;
