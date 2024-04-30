import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {constants, strings} from '../../constants';
import InputField from '../../components/InputField';
import RButton from '../../components/RButton';
import {Screen} from '../../components/Screen';
import {colors} from '../../theme';
import styles from './styles';
import RText from '../../components/RText';
import useSignInHook from './useSignInHook';
import SocialLoginOptions from '../../components/SocialLoginOptions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import {getMScale, getVerticalScale, SCREEN_HEIGHT} from '../../theme/metrics';
import {images} from '../../assets';

const SignInScreen = () => {
  const {
    email,
    password,
    emailError,
    passwordError,
    ref_password,
    isButtonDisabled,
    isLoading,
    onSubmitClick,
    onSignupClick,
    continueAsGuest,
    onForgotPasswordClick,
    handelEmailChange,
    handelPasswordChange,
    providerError,
    isLoginError,
    isBiometricIconVisible,
    handleBiometricLogin,
  } = useSignInHook();

  const isLoginButtonDisabled = isLoading ||
      isButtonDisabled ||
      !!passwordError ||
      (providerError?.length > 0);

  const renderMainInputsView = () => {
    return (
      <View style={styles.mainInputsView}>
        <RText
          weight={'headerBold'}
          size={'lg'}
          textStyle={styles.title}
          text={strings.welcome_back}
          accessibilityRole={'header'}
        />
        <View style={styles.inputsView}>
          <InputField
            placeholder={strings.enter_email}
            value={email}
            onChangeText={handelEmailChange}
            blurOnSubmit={false}
            label={strings.email_address}
            error={emailError}
            onSubmitEditing={() => ref_password.current?.focus()}
            autoCapitalize={'none'}
            keyboardType={constants.KEYBOARD_TYPES.EMAIL_ADDRESS}
            textContentType={'username'}
          />
          <InputField
            ref={ref_password}
            placeholder={strings.enter_password}
            value={password}
            error={passwordError}
            label={strings.password}
            onSubmitEditing={onSubmitClick}
            isPasswordInput
            isBioMetricVisible={isBiometricIconVisible && !password}
            handleBiometricLogin={handleBiometricLogin}
            onChangeText={handelPasswordChange}
            returnKeyType={'done'}
            textContentType={'password'}
          />
          {providerError?.length > 0 || emailError || passwordError ? (
            <RText
              accessibilityLabel={
                emailError && passwordError
                  ? 'There is some issue with email & password, Please fix it and retry.'
                  : providerError[0]
              }
              text={providerError[0]}
              textStyle={styles.apiErrorTextStyle}
              size={'xs'}
              color={colors.error}
              accessible
            />
          ) : null}
        </View>
        <TouchableOpacity
          accessibilityRole={'link'}
          accessibilityHint={'activate to reset password'}
          disabled={isLoading}
          onPress={onForgotPasswordClick}
          style={{
            alignSelf: 'flex-end',
            marginTop: providerError.length > 0 && isLoading ? 10 : 0,
          }}>
          <RText size={'xxs'} color={colors.primaryLink} text={strings.forgot_password} />
        </TouchableOpacity>
        <RButton
          onPress={onSubmitClick}
          accessibilityHint={isLoginButtonDisabled ? 'complete login information to activate' : 'activate to login'}
          title={strings.login}
          click_label={strings.login}
          click_destination={strings.home_screen}
          loading={isLoading}
          disabled={isLoginButtonDisabled}
          buttonStyle={styles.loginButton}
        />
        <TouchableOpacity activeOpacity={0.7} accessibilityRole={'link'} accessibilityHint={'activate to create new account'} onPress={onSignupClick}>
          <RText textStyle={styles.signupText}>
            <RText text={`${strings.dont_have_account}  `} size={'xxs'} />
            <RText
              text={strings.signup}
              size={'xxs'}
              color={colors.primaryLink}
              weight={'semiBold'}
              textStyle={{textDecorationLine: 'underline'}}
            />
          </RText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomMostContainer}>
        <SocialLoginOptions disabled={isLoading} />
        <TouchableOpacity
          accessibilityRole={'button'}
          accessibilityHint={'Activate to continue as guest'}
          disabled={isLoading}
          onPress={continueAsGuest}
          style={styles.buttonAsGuest}>
          <RText textStyle={styles.textAsGuest} text={strings.continue_as_guest} />
          <View style={styles.continueAsGuestArrow}>
            <MaterialCommunityIcons name={'arrow-right'} size={15} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Screen
      backgroundImage={require('./login_background.png')}
      preset={constants.SCREEN_PRESETS.SCROLL}
      StatusBarProps={{translucent: true, backgroundColor: 'rgba(0,0,0,0)'}}
      containerStyle={{height: SCREEN_HEIGHT, width: '100%', resizeMode: 'stretch'}}>
      <Image
        source={require('./rubios.png')}
        style={styles.iconMain}
        accessible
        accessibilityLabel={'Rubios Coastal Grill Logo'}
      />
      <View style={{marginTop: getVerticalScale(20)}}>
        <ImageComponent
          accessible={false}
          source={images.waveLine}
          resizeMode={'stretch'}
          style={{width: getMScale(420), height: getMScale(15)}}
        />
      </View>
      {renderMainInputsView()}
      {renderBottomView()}
    </Screen>
  );
};

export default React.memo(SignInScreen);
